'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, User, KeyRound, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import apiClient from '@/lib/axios';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get('/profile');
        setName(res.data.data.name);
        setEmail(res.data.data.email);
      } catch (error) {
        toast.add({ variant: 'destructive', title: 'Error', description: 'Gagal mengambil data profil' });
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await apiClient.put('/profile', { name });
      toast.add({ title: 'Berhasil', description: 'Profil berhasil diperbarui.' });
    } catch (error: any) {
      toast.add({
        variant: 'destructive',
        title: 'Gagal',
        description: error.response?.data?.message || 'Gagal memperbarui profil.',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    // ... logic password
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.add({ variant: 'destructive', title: 'Error', description: 'Konfirmasi password baru tidak cocok!' });
      return;
    }
    if (newPassword.length < 6) {
      toast.add({ variant: 'destructive', title: 'Error', description: 'Password minimal 6 karakter.' });
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.put('/profile/password', {
        old_password: oldPassword,
        new_password: newPassword,
      });
      toast.add({ title: 'Berhasil', description: 'Password berhasil diubah.' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.add({
        variant: 'destructive',
        title: 'Gagal',
        description: error.response?.data?.message || 'Gagal mengubah password.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <User className="h-6 w-6" />
          <h1 className="text-2xl font-bold tracking-tight">Profil & Keamanan</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Informasi Profil
          </CardTitle>
          <CardDescription>
            Perbarui nama Anda. Alamat email tidak dapat diubah karena merupakan identitas utama undangan project Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingProfile ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Nama Lengkap</label>
                <Input
                  placeholder="Nama Lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Alamat Email</label>
                <Input
                  type="email"
                  value={email}
                  disabled
                  className="bg-muted text-muted-foreground"
                />
              </div>
              <Button type="submit" disabled={savingProfile || !name} className="w-full sm:w-auto self-end mt-2">
                {savingProfile ? 'Menyimpan...' : 'Simpan Profil'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <KeyRound className="h-5 w-5 text-primary" />
            Ubah Password
          </CardTitle>
          <CardDescription>
            Ubah password Anda secara berkala untuk menjaga keamanan akun, terutama jika Anda masuk menggunakan password sementara dari fitur Invite.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Password Lama</label>
              <Input
                type="password"
                placeholder="Masukkan password lama"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Password Baru</label>
                <Input
                  type="password"
                  placeholder="Masukkan password baru"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Konfirmasi Password Baru</label>
                <Input
                  type="password"
                  placeholder="Ulangi password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>
            <Button type="submit" disabled={submitting || !oldPassword || !newPassword || !confirmPassword || newPassword.length < 6} className="w-full sm:w-auto self-end mt-2">
              {submitting ? 'Menyimpan...' : 'Simpan Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


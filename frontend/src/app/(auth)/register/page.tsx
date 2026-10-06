'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const role = 'user';
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.add({ variant: 'destructive', title: 'Registrasi Gagal', description: 'Password minimal 6 karakter.' });
      return;
    }
    setLoading(true);

    try {
      await apiClient.post('/register', { name, email, password, role });
      toast.add({
        title: 'Registrasi Berhasil!',
        description: 'Silakan login dengan akun Anda.',
      });
      router.push('/login');
    } catch (error: any) {
      toast.add({
        variant: 'destructive',
        title: 'Registrasi Gagal',
        description: error.response?.data?.message || 'Terjadi kesalahan.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="border-b bg-background px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">Taskly</span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Form */}
      <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleRegister}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Register</CardTitle>
            <CardDescription className="text-center">
              Buat akun baru untuk memulai.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Nama Lengkap</label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Memproses...' : 'Daftar'}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Sudah punya akun?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Login di sini
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
      </div>
    </div>
  );
}


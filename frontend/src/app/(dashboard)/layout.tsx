'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import apiClient from '@/lib/axios';
import { toast } from '@/components/ui/toast';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPasswordTemporary, setIsPasswordTemporary] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    // Check if user has temporary password
    const tempCookie = Cookies.get('isPasswordTemporary');
    if (tempCookie === 'true') {
      setIsPasswordTemporary(true);
    }

    const fetchNotifs = () => {
      apiClient.get('/notifications').then(res => {
        setUnreadCount(res.data.data.length);
      }).catch(() => {});
    };

    // Fetch immediately on mount or path change
    fetchNotifs();

    // Polling setiap 30 detik agar realtime
    const interval = setInterval(fetchNotifs, 30000);

    return () => clearInterval(interval);
  }, [pathname]);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) return;
    if (newPassword.length < 6) {
      toast.add({ variant: 'destructive', title: 'Gagal', description: 'Password minimal 6 karakter.' });
      return;
    }
    setChangingPassword(true);
    try {
      await apiClient.put('/profile/password', { new_password: newPassword });
      Cookies.remove('isPasswordTemporary');
      setIsPasswordTemporary(false);
      toast.add({ title: 'Berhasil', description: 'Password berhasil diperbarui! Silakan lanjutkan.' });
    } catch (error: any) {
      toast.add({ variant: 'destructive', title: 'Gagal', description: error.response?.data?.message || 'Gagal mengubah password' });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('role');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <Link href="/projects" className="text-xl font-bold text-primary">
          TaskApp
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/notifications" className="relative text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Link>
          <div className="flex gap-2">
            <Link href="/profile">
              <Button variant="ghost">Profil</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>

      {/* Force Change Password Modal */}
      {isPasswordTemporary && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl p-6 max-w-sm w-full shadow-lg border">
            <h2 className="text-xl font-bold mb-2">Amankan Akun Anda</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Anda saat ini masuk menggunakan password sementara. Demi keamanan, silakan ganti password Anda sekarang.
            </p>
            <div className="flex flex-col gap-3">
              <input 
                type="password" 
                placeholder="Password Baru" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input 
                type="password" 
                placeholder="Konfirmasi Password Baru" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button 
                onClick={handleChangePassword} 
                disabled={changingPassword || !newPassword || newPassword !== confirmPassword || newPassword.length < 6}
                className="mt-2"
              >
                {changingPassword ? 'Menyimpan...' : 'Ganti Password'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

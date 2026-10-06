'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';

import { useEffect, useState } from 'react';
import { Bell, Sparkles, Home } from 'lucide-react';
import apiClient from '@/lib/axios';
import { toast } from '@/components/ui/toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

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
      <header className="border-b bg-background px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px]">
              <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
              <div className="flex flex-col gap-6 pt-6">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                    <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-lg tracking-tight">Taskly</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  <Link href="/projects" className="text-sm font-medium hover:text-primary">
                    Dashboard Projects
                  </Link>
                  <Link href="/notifications" className="text-sm font-medium hover:text-primary flex items-center justify-between">
                    Notifikasi
                    {unreadCount > 0 && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link href="/profile" className="text-sm font-medium hover:text-primary">
                    Profil Saya
                  </Link>
                </nav>
                <div className="mt-auto border-t pt-4">
                  <Button variant="destructive" className="w-full" onClick={handleLogout}>
                    Keluar
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity hidden md:flex">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">Taskly</span>
          </Link>
          <span className="text-border hidden md:inline">|</span>
          <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden md:inline">
            Dashboard
          </Link>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4">
          <ThemeToggle />
          <div className="hidden md:flex items-center gap-4">
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


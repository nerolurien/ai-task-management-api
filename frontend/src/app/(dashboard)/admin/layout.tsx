'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Sparkles, ArrowLeft, Shield, Users, Activity, BarChart3, LogOut, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = Cookies.get('token');
    const role = Cookies.get('role');

    if (!token) {
      router.push('/login');
      return;
    }

    if (role !== 'admin') {
      router.push('/projects');
      return;
    }

    setAuthorized(true);
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('role');
    router.push('/login');
  };

  if (authorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Memvalidasi izin administrator...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-muted/20">
      {}
      <header className="border-b bg-background/95 backdrop-blur px-4 md:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/projects" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1 px-2.5 rounded-md hover:bg-muted">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Kembali ke Proyek</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-sm shadow-amber-500/10">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight">Internal Operational</span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  Admin Panel
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground hidden sm:block">Pengelolaan data sistem dan monitoring operasional internal</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="outline" size="sm" className="gap-2 text-destructive border-destructive/20 hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {}
      <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
        {children}
      </main>

      <footer className="border-t py-4 text-center text-xs text-muted-foreground bg-background">
        Taskly Internal Operational & System Management &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

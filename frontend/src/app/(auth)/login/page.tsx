'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/toast';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await apiClient.post('/login', { email, password });
      // Asumsi backend merespon dengan { token: '...', user: { role: '...' } }
      const token = res.data.token || res.data.data?.token?.token; // Sesuaikan Adonis response
      const role = res.data.user?.role || res.data.data?.user?.role || 'user';
      const isTemporary = res.data.user?.isPasswordTemporary || res.data.data?.user?.isPasswordTemporary || false;
      
      if (token) {
        Cookies.set('token', token, { expires: 7 });
        Cookies.set('role', role, { expires: 7 });
        if (isTemporary) {
          Cookies.set('isPasswordTemporary', 'true', { expires: 7 });
        } else {
          Cookies.remove('isPasswordTemporary');
        }
        toast.add({ title: 'Login Berhasil!' });
        router.push('/projects');
      } else {
        toast.add({ variant: 'destructive', title: 'Login gagal, token tidak ditemukan.' });
      }
    } catch (error: any) {
      toast.add({
        variant: 'destructive',
        title: 'Login Gagal',
        description: error.response?.data?.message || 'Email atau password salah.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <form onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Masuk untuk mengelola task dan project Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              {loading ? 'Memproses...' : 'Login'}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Belum punya akun?{' '}
              <Link href="/register" className="text-primary hover:underline">
                Daftar di sini
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

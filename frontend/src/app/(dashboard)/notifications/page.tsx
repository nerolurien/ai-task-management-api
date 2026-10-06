'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/toast';
import apiClient from '@/lib/axios';

interface Notification {
  id: number | string;
  type: string;
  status: 'pending' | 'accepted' | 'rejected';
  project: { id: number; name: string };
  sender?: { id: number; name: string; email: string };
  task?: { id: number; title: string; dueDate: string; isOverdue: boolean };
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get('/notifications');
      setNotifications(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRespond = async (id: number, status: 'accepted' | 'rejected') => {
    try {
      await apiClient.post(`/notifications/${id}/respond`, { status });
      toast.add({ title: `Undangan berhasil di${status === 'accepted' ? 'terima' : 'tolak'}` });
      fetchNotifications();
      // Optional: if accepted, redirect or show success message
    } catch (error: any) {
      toast.add({ variant: 'destructive', title: 'Gagal merespon undangan' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6" />
          <h1 className="text-2xl font-bold tracking-tight">Notifikasi</h1>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground border border-dashed rounded-xl">
          Tidak ada notifikasi baru.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {notifications.map((notif) => {
            if (notif.type === 'DEADLINE_REMINDER') {
              return (
                <Card key={notif.id} className="border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900/50">
                  <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-red-600 dark:text-red-400 text-base flex items-center gap-1.5">
                          ⚠️ Peringatan Deadline
                        </p>
                        <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 px-2 py-0.5 rounded-full font-bold">
                          {notif.task?.isOverdue ? 'OVERDUE' : 'HARI INI'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Task <span className="font-semibold text-foreground">"{notif.task?.title}"</span> di project <span className="font-semibold text-foreground">{notif.project.name}</span> harus selesai hari ini!
                      </p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <Link href={`/projects/${notif.project.id}/tasks`}>
                        <Button variant="outline" className="w-full md:w-auto border-red-200 hover:bg-red-100 dark:border-red-900 dark:hover:bg-red-900">
                          Lihat Task
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            }

            return (
              <Card key={notif.id}>
                <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-base">Undangan Project</p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">{notif.sender?.name}</span> mengundang Anda untuk bergabung ke project <span className="font-semibold text-primary">{notif.project?.name}</span>.
                    </p>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950" onClick={() => handleRespond(notif.id, 'rejected')}>
                      <X className="mr-1.5 h-4 w-4" /> Tolak
                    </Button>
                    <Button className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white" onClick={() => handleRespond(notif.id, 'accepted')}>
                      <Check className="mr-1.5 h-4 w-4" /> Terima
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

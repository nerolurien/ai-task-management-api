'use client';

import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Users, 
  FolderKanban, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  KeyRound, 
  Trash2, 
  Search, 
  Activity, 
  RefreshCw, 
  Server, 
  Sliders, 
  BarChart3,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { toast } from '@/components/ui/toast';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isPasswordTemporary: boolean;
  totalProjects: number;
  createdAt: string;
}

interface OperationalStats {
  summary: {
    totalUsers: number;
    totalAdmins: number;
    totalProjects: number;
    totalTasks: number;
    completionRate: number;
    totalActivities: number;
    totalAuditLogs: number;
  };
  taskDistribution: {
    todo: number;
    inProgress: number;
    done: number;
  };
  priorityDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  recentActivities: Array<{
    id: number;
    action: string;
    createdAt: string;
    user?: { id: number; name: string; email: string };
    project?: { id: number; name: string };
  }>;
  recentAuditLogs: Array<{
    id: number;
    action: string;
    status: string;
    failedReason: string | null;
    createdAt: string;
  }>;
}

const STATUS_COLORS = ['#3b82f6', '#f59e0b', '#10b981'];
const PRIORITY_COLORS = ['#ef4444', '#f59e0b', '#3b82f6'];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'users'>('monitoring');
  const [stats, setStats] = useState<OperationalStats | null>(null);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);

  const fetchAdminData = useCallback(async () => {
    try {
      setRefreshing(true);
      const [statsRes, usersRes] = await Promise.all([
        apiClient.get('/admin/stats'),
        apiClient.get('/users')
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
    } catch (error: any) {
      console.error('Failed to load admin data:', error);
      toast.add({
        variant: 'destructive',
        title: 'Gagal memuat data',
        description: error.response?.data?.message || 'Pastikan Anda memiliki hak akses administrator.'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);
  const handleToggleRole = async (user: UserItem) => {
    const targetRole = user.role === 'admin' ? 'user' : 'admin';
    const actionLabel = targetRole === 'admin' ? 'menjadikan Administrator' : 'mengubah menjadi User biasa';
    if (!confirm(`Apakah Anda yakin ingin ${actionLabel} untuk "${user.name}"?`)) return;

    try {
      await apiClient.put(`/users/${user.id}/role`, { role: targetRole });
      toast.add({
        title: 'Role Berhasil Diperbarui',
        description: `${user.name} sekarang berstatus sebagai ${targetRole}.`
      });
      fetchAdminData();
    } catch (error: any) {
      toast.add({
        variant: 'destructive',
        title: 'Gagal Mengubah Role',
        description: error.response?.data?.message || 'Terjadi kesalahan sistem'
      });
    }
  };
  const openResetPasswordModal = (user: UserItem) => {
    setSelectedUser(user);
    setNewPasswordInput('Password123!');
    setResetModalOpen(true);
  };
  const handleResetPasswordSubmit = async () => {
    if (!selectedUser) return;
    if (newPasswordInput.length < 6) {
      toast.add({
        variant: 'destructive',
        title: 'Password Tidak Valid',
        description: 'Password minimal 6 karakter.'
      });
      return;
    }

    setResettingPassword(true);
    try {
      await apiClient.put(`/users/${selectedUser.id}/reset-password`, {
        newPassword: newPasswordInput
      });
      toast.add({
        title: 'Password Berhasil Direset',
        description: `Password untuk ${selectedUser.name} telah direset menjadi "${newPasswordInput}". Pengguna wajib mengganti password saat login.`
      });
      setResetModalOpen(false);
      fetchAdminData();
    } catch (error: any) {
      toast.add({
        variant: 'destructive',
        title: 'Gagal Reset Password',
        description: error.response?.data?.message || 'Terjadi kesalahan'
      });
    } finally {
      setResettingPassword(false);
    }
  };
  const handleDeleteUser = async (user: UserItem) => {
    if (!confirm(`PERINGATAN: Apakah Anda yakin ingin menghapus akun "${user.name}" (${user.email})? Tindakan ini tidak dapat dibatalkan.`)) return;

    try {
      await apiClient.delete(`/users/${user.id}`);
      toast.add({
        title: 'Pengguna Dihapus',
        description: `Akun ${user.name} berhasil dihapus dari sistem operasional.`
      });
      fetchAdminData();
    } catch (error: any) {
      toast.add({
        variant: 'destructive',
        title: 'Gagal Menghapus',
        description: error.response?.data?.message || 'Gagal menghapus akun pengguna'
      });
    }
  };
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">Mengumpulkan metrik operasional internal...</p>
      </div>
    );
  }

  const taskDataChart = stats ? [
    { name: 'To Do', value: stats.taskDistribution.todo },
    { name: 'In Progress', value: stats.taskDistribution.inProgress },
    { name: 'Done', value: stats.taskDistribution.done }
  ] : [];

  const priorityDataChart = stats ? [
    { name: 'High', value: stats.priorityDistribution.high },
    { name: 'Medium', value: stats.priorityDistribution.medium },
    { name: 'Low', value: stats.priorityDistribution.low }
  ] : [];

  return (
    <div className="flex flex-col gap-6">
      {}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Dashboard Operasional Internal
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Pusat kendali sistem, pengelolaan hak akses data pengguna, dan analitik performa operasional.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchAdminData} 
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Metrik</span>
          </Button>
        </div>
      </div>

      {}
      <div className="flex border-b gap-3">
        <button
          onClick={() => setActiveTab('monitoring')}
          className={`pb-3 px-2 text-sm font-semibold flex items-center gap-2 transition-all relative ${
            activeTab === 'monitoring'
              ? 'text-amber-500 border-b-2 border-amber-500 font-bold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          Monitoring & Operasional Sistem
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-2 text-sm font-semibold flex items-center gap-2 transition-all relative ${
            activeTab === 'users'
              ? 'text-amber-500 border-b-2 border-amber-500 font-bold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="h-4 w-4" />
          Pengelolaan Pengguna & Hak Akses ({users.length})
        </button>
      </div>

      {}
      {activeTab === 'monitoring' && stats && (
        <div className="flex flex-col gap-6">
          {}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Pengguna</p>
                  <p className="text-2xl font-bold mt-1 text-foreground">{stats.summary.totalUsers}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{stats.summary.totalAdmins} akun administrator</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Users className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Proyek Aktif</p>
                  <p className="text-2xl font-bold mt-1 text-foreground">{stats.summary.totalProjects}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Workspace operasional</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <FolderKanban className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Tugas (Tasks)</p>
                  <p className="text-2xl font-bold mt-1 text-foreground">{stats.summary.totalTasks}</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">{stats.summary.completionRate}% Selesai</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Aktivitas & Audit Log</p>
                  <p className="text-2xl font-bold mt-1 text-foreground">{stats.summary.totalActivities + stats.summary.totalAuditLogs}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{stats.summary.totalActivities} interaksi terekam</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Activity className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-amber-500" />
                  Distribusi Status Tugas Operasional
                </CardTitle>
                <CardDescription className="text-xs">
                  Perbandingan beban kerja yang berstatus To Do, In Progress, dan Selesai.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={taskDataChart} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#0f172a', color: '#fff' }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {taskDataChart.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-around text-center border-t pt-4 mt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">To Do</p>
                    <p className="text-base font-bold text-blue-500">{stats.taskDistribution.todo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                    <p className="text-base font-bold text-amber-500">{stats.taskDistribution.inProgress}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Done</p>
                    <p className="text-base font-bold text-emerald-500">{stats.taskDistribution.done}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-500" />
                  Tingkat Prioritas Tugas
                </CardTitle>
                <CardDescription className="text-xs">
                  Klasifikasi urgensi pekerjaan yang sedang ditangani oleh tim.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={priorityDataChart}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {priorityDataChart.map((_, index) => (
                          <Cell key={`cell-priority-${index}`} fill={PRIORITY_COLORS[index % PRIORITY_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#0f172a', color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-around text-center border-t pt-4 mt-2">
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center">
                      <span className="h-2 w-2 rounded-full bg-red-500 inline-block" /> High
                    </p>
                    <p className="text-base font-bold text-red-500">{stats.priorityDistribution.high}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center">
                      <span className="h-2 w-2 rounded-full bg-amber-500 inline-block" /> Medium
                    </p>
                    <p className="text-base font-bold text-amber-500">{stats.priorityDistribution.medium}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center">
                      <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" /> Low
                    </p>
                    <p className="text-base font-bold text-blue-500">{stats.priorityDistribution.low}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  Aktivitas Pengguna Terkini
                </CardTitle>
                <CardDescription className="text-xs">
                  Audit interaksi pembuatan dan modifikasi tugas di seluruh proyek.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {stats.recentActivities.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted-foreground">Belum ada aktivitas terekam.</div>
                  ) : (
                    stats.recentActivities.map((act) => (
                      <div key={act.id} className="flex items-start gap-3 text-xs p-2.5 rounded-lg bg-muted/40 border">
                        <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-[10px]">
                          {act.user?.name ? act.user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground font-medium truncate">
                            <span className="font-semibold">{act.user?.name || 'Seseorang'}</span> {act.action}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Proyek: <span className="text-foreground/80 font-medium">{act.project?.name || 'Umum'}</span>
                          </p>
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {new Date(act.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {}
            <Card className="shadow-sm flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Server className="h-4 w-4 text-blue-500" />
                  Integritas & Status Proteksi Operasional
                </CardTitle>
                <CardDescription className="text-xs">
                  Parameter keamanan dan integritas modul internal sistem.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <div>
                        <p className="text-xs font-semibold">AI Rate Limiting Guard</p>
                        <p className="text-[11px] text-muted-foreground">Throttle 5 req / 10 menit per user aktif</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      Aktif
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                    <div className="flex items-center gap-2.5">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-xs font-semibold">Auto-Cleanup Undangan Kadaluarsa</p>
                        <p className="text-[11px] text-muted-foreground">Masa berlaku 1 jam dengan pembersihan berkala</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
                      Aktif
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                    <div className="flex items-center gap-2.5">
                      <KeyRound className="h-4 w-4 text-amber-500" />
                      <div>
                        <p className="text-xs font-semibold">Force Reset Password Interceptor</p>
                        <p className="text-[11px] text-muted-foreground">Mewajibkan reset password sementara pada login perdana</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      Enforced
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
                  <p className="font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" /> Mode Administrator Aktif
                  </p>
                  <p className="text-[11px] mt-1 text-muted-foreground">
                    Semua rute manajemen dilindungi oleh middleware verifikasi role admin terenkripsi di level AdonisJS kernel.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {}
      {activeTab === 'users' && (
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-lg">Pengelolaan Data Pengguna & Hak Akses</CardTitle>
                <CardDescription className="text-xs">
                  Daftar seluruh akun terdaftar, kelola hak akses administratif, serta lakukan reset password.
                </CardDescription>
              </div>

              {}
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama atau email..."
                    className="pl-8 h-8 text-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="h-8 rounded-md border border-input bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="all">Semua Role ({users.length})</option>
                  <option value="admin">Administrator</option>
                  <option value="user">User Biasa</option>
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto border-t">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] text-muted-foreground uppercase bg-muted/40 border-b">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Pengguna</th>
                    <th className="px-6 py-3 font-semibold">Role Sistem</th>
                    <th className="px-6 py-3 font-semibold">Total Proyek</th>
                    <th className="px-6 py-3 font-semibold">Status Password</th>
                    <th className="px-6 py-3 font-semibold">Terdaftar</th>
                    <th className="px-6 py-3 font-semibold text-right">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-xs">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                        Tidak ada pengguna yang cocok dengan kriteria pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-foreground">{u.name}</div>
                          <div className="text-muted-foreground text-[11px]">{u.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              u.role === 'admin'
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {u.role === 'admin' ? <ShieldCheck className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-foreground">
                          {u.totalProjects} Proyek
                        </td>
                        <td className="px-6 py-4">
                          {u.isPasswordTemporary ? (
                            <span className="text-[10px] font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              Sementara (Wajib Ganti)
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">
                              Permanen
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                          {new Date(u.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {}
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-[11px] px-2.5"
                              onClick={() => handleToggleRole(u)}
                            >
                              {u.role === 'admin' ? 'Jadikan User' : 'Jadikan Admin'}
                            </Button>

                            {}
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-[11px] px-2 gap-1 text-amber-600 hover:text-amber-700"
                              onClick={() => openResetPasswordModal(u)}
                              title="Reset Password Pengguna"
                            >
                              <KeyRound className="h-3 w-3" />
                              <span className="hidden sm:inline">Reset Password</span>
                            </Button>

                            {}
                            {u.role !== 'admin' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-[11px] px-2 text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteUser(u)}
                                title="Hapus Akun Pengguna"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {}
      <Dialog open={resetModalOpen} onOpenChange={setResetModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-amber-500" />
              Reset Password Pengguna
            </DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="flex flex-col gap-4 py-2">
              <p className="text-xs text-muted-foreground">
                Anda akan melakukan reset kata sandi untuk akun <span className="font-semibold text-foreground">{selectedUser.name}</span> ({selectedUser.email}). Kata sandi ini akan diatur sebagai kata sandi sementara, sehingga pengguna diwajibkan menggantinya saat login berikutnya.
              </p>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold">Password Baru Sementara</label>
                <Input
                  type="text"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Masukkan password sementara..."
                  className="font-mono text-xs"
                />
                <span className="text-[10px] text-muted-foreground">
                  Default: Password123! (Minimal 6 karakter)
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setResetModalOpen(false)}>
              Batal
            </Button>
            <Button 
              onClick={handleResetPasswordSubmit} 
              disabled={resettingPassword || !newPasswordInput}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {resettingPassword ? 'Menyimpan...' : 'Terapkan Reset Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import Cookies from 'js-cookie';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Folder, Pencil, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/toast';

interface Project {
  id: number;
  name: string;
  description: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  totalProjects: number;
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'users' | 'projects'>('users');
  
  const [isMounted, setIsMounted] = useState(false);
  const role = Cookies.get('role') || 'user';
  const isAdmin = role === 'admin';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      if (isAdmin) {
        const [projRes, usersRes] = await Promise.all([
          apiClient.get('/projects'),
          apiClient.get('/users')
        ]);
        setProjects(projRes.data.data || projRes.data);
        setUsers(usersRes.data.data);
      } else {
        const response = await apiClient.get('/projects');
        setProjects(response.data.data || response.data);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
      toast.add({ variant: 'destructive', title: 'Gagal memuat data' });
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;
    try {
      await apiClient.delete(`/users/${id}`);
      toast.add({ title: 'Berhasil', description: 'Pengguna berhasil dihapus' });
      fetchData();
    } catch (error: any) {
      toast.add({ variant: 'destructive', title: 'Gagal', description: error.response?.data?.message || 'Gagal menghapus pengguna' });
    }
  };

  const openCreateModal = () => {
    setEditProject(null);
    setFormName('');
    setFormDesc('');
    setShowModal(true);
  };

  const openEditModal = (project: Project) => {
    setEditProject(project);
    setFormName(project.name);
    setFormDesc(project.description || '');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formName.trim()) return;
    setSubmitting(true);
    try {
      if (editProject) {
        await apiClient.put(`/projects/${editProject.id}`, { name: formName, description: formDesc });
        toast.add({ title: 'Project berhasil diperbarui!' });
      } else {
        await apiClient.post('/projects', { name: formName, description: formDesc });
        toast.add({ title: 'Project berhasil dibuat!' });
      }
      setShowModal(false);
      fetchData();
    } catch (error: any) {
      toast.add({ variant: 'destructive', title: 'Gagal menyimpan project', description: error.response?.data?.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus project ini?')) return;
    try {
      await apiClient.delete(`/projects/${id}`);
      toast.add({ title: 'Project berhasil dihapus!' });
      fetchData();
    } catch (error: any) {
      toast.add({ variant: 'destructive', title: 'Gagal menghapus project', description: error.response?.data?.message });
    }
  };

  if (!isMounted) {
    return null; // Mencegah hydration mismatch antara server dan client
  }

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col gap-8">
      {isAdmin && (
        <div className="flex gap-2 border-b pb-2">
          <Button 
            variant={viewMode === 'users' ? 'default' : 'ghost'} 
            onClick={() => setViewMode('users')}
          >
            Manajemen Pengguna
          </Button>
          <Button 
            variant={viewMode === 'projects' ? 'default' : 'ghost'} 
            onClick={() => setViewMode('projects')}
          >
            Manajemen Project
          </Button>
        </div>
      )}

      {(!isAdmin || viewMode === 'projects') && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Daftar Project</h1>
              <p className="text-muted-foreground mt-1">
                Kelola project Anda atau buat project baru.
              </p>
            </div>
            <Button onClick={openCreateModal}>
              <Plus className="mr-2 h-4 w-4" /> Tambah Project
            </Button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-muted-foreground">Memuat projects...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="relative group">
                  <Link href={`/projects/${project.id}/tasks`}>
                    <Card className="hover:border-primary/50 transition-all cursor-pointer h-full hover:shadow-md">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Folder className="h-5 w-5 text-primary" />
                          {project.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="line-clamp-2">
                          {project.description || 'Tidak ada deskripsi.'}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Link>

                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 bg-background shadow"
                        onClick={(e) => { e.preventDefault(); openEditModal(project); }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 bg-background shadow text-destructive hover:text-destructive"
                        onClick={(e) => { e.preventDefault(); handleDelete(project.id); }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              {projects.length === 0 && (
                <div className="col-span-full py-12 text-center border-2 border-dashed rounded-lg text-muted-foreground">
                  Belum ada project. Klik &quot;Tambah Project&quot; untuk mulai.
                </div>
              )}
            </div>
          )}
        </>
      )}

      {isAdmin && viewMode === 'users' && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
              <p className="text-muted-foreground mt-1">Kelola akun pengguna di sistem.</p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-muted-foreground">Memuat pengguna...</div>
          ) : (
            <div className="bg-white rounded-md border shadow-sm overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-3 font-medium">Nama & Email</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium">Total Project</th>
                    <th className="px-6 py-3 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b last:border-0 hover:bg-muted/20">
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{u.name}</div>
                        <div className="text-muted-foreground">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {u.totalProjects} Project
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.role !== 'admin' && (
                          <Button variant="ghost" size="sm" className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteUser(u.id)}>
                            Hapus Akun
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modal Create/Edit Project */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editProject ? 'Edit Project' : 'Tambah Project Baru'}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Nama Project <span className="text-destructive">*</span></label>
              <Input
                placeholder="Contoh: E-Commerce Revamp"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Deskripsi</label>
              <Input
                placeholder="Deskripsi singkat project..."
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowModal(false)} disabled={submitting}>
                Batal
              </Button>
              <Button onClick={handleSubmit} disabled={submitting || !formName.trim()}>
                {submitting ? 'Menyimpan...' : editProject ? 'Simpan Perubahan' : 'Buat Project'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


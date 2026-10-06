'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AiCommandBar } from '@/components/AiCommandBar';
import { ProjectAnalytics } from '@/components/ProjectAnalytics';
import { toast } from '@/components/ui/toast';
import { ArrowLeft, Sparkles, Plus, Pencil, Trash2, ChevronRight, ChevronLeft, ClipboardList, Timer, CircleCheckBig, User, Mail, Calendar, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date?: string | null;
  dueDate?: string | null;
  assignee?: { id: number; name: string; email: string } | null;
  subtasks?: { id: number; title: string; isCompleted: boolean; is_completed?: number }[];
}

const columns = [
  { 
    id: 'todo', 
    title: 'To Do', 
    icon: <ClipboardList className="h-4 w-4" />,
    headerBg: 'bg-blue-50 dark:bg-blue-950/30',
    headerText: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    badgeBg: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    cardBorder: 'border-l-4 border-l-blue-400',
    emptyBorder: 'border-blue-200 dark:border-blue-800',
  },
  { 
    id: 'in_progress', 
    title: 'In Progress', 
    icon: <Timer className="h-4 w-4" />,
    headerBg: 'bg-amber-50 dark:bg-amber-950/30',
    headerText: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
    badgeBg: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    cardBorder: 'border-l-4 border-l-amber-400',
    emptyBorder: 'border-amber-200 dark:border-amber-800',
  },
  { 
    id: 'done', 
    title: 'Done', 
    icon: <CircleCheckBig className="h-4 w-4" />,
    headerBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    headerText: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
    badgeBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    cardBorder: 'border-l-4 border-l-emerald-400',
    emptyBorder: 'border-emerald-200 dark:border-emerald-800',
  },
];

type Status = 'todo' | 'in_progress' | 'done';

export default function TaskBoardPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const projectId = unwrappedParams.id;
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formStatus, setFormStatus] = useState<Status>('todo');
  const [formPriority, setFormPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [formDueDate, setFormDueDate] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // Detail modal state
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchComments = async (taskId: number) => {
    setLoadingComments(true);
    try {
      const res = await apiClient.get(`/tasks/${taskId}/comments`);
      setComments(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingComments(false);
    }
  };

  const openDetailModal = (task: Task) => {
    setDetailTask(task);
    setComments([]);
    fetchComments(task.id);
  };

  const handlePostComment = async () => {
    if (!newComment.trim() || !detailTask) return;
    setSubmittingComment(true);
    try {
      await apiClient.post(`/tasks/${detailTask.id}/comments`, { content: newComment });
      setNewComment('');
      fetchComments(detailTask.id);
    } catch (error) {
      toast.add({ variant: 'destructive', title: 'Gagal mengirim komentar' });
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtask.trim() || !detailTask) return;
    setSubmittingSubtask(true);
    try {
      const res = await apiClient.post(`/tasks/${detailTask.id}/subtasks`, { title: newSubtask });
      const createdSubtask = res.data.data;
      
      const updatedSubtasks = [...(detailTask.subtasks || []), createdSubtask];
      setDetailTask({ ...detailTask, subtasks: updatedSubtasks });
      setTasks(tasks.map(t => t.id === detailTask.id ? { ...t, subtasks: updatedSubtasks } : t));
      setNewSubtask('');
    } catch (e) {
      toast.add({ variant: 'destructive', title: 'Error', description: 'Gagal menambah subtask' });
    } finally {
      setSubmittingSubtask(false);
    }
  };

  const handleToggleSubtask = async (subtaskId: number, currentCompleted: boolean) => {
    if (!detailTask) return;
    try {
      const newStatus = !currentCompleted;
      // Optimistic
      const updatedSubtasks = (detailTask.subtasks || []).map(s => 
        s.id === subtaskId ? { ...s, is_completed: newStatus ? 1 : 0, isCompleted: newStatus } : s
      );
      setDetailTask({ ...detailTask, subtasks: updatedSubtasks });
      setTasks(tasks.map(t => t.id === detailTask.id ? { ...t, subtasks: updatedSubtasks } : t));

      await apiClient.put(`/subtasks/${subtaskId}`, { isCompleted: newStatus });
    } catch (e) {
      toast.add({ variant: 'destructive', title: 'Error', description: 'Gagal update subtask' });
      fetchTasks();
    }
  };

  const handleDeleteSubtask = async (subtaskId: number) => {
    if (!detailTask) return;
    try {
      const updatedSubtasks = (detailTask.subtasks || []).filter(s => s.id !== subtaskId);
      setDetailTask({ ...detailTask, subtasks: updatedSubtasks });
      setTasks(tasks.map(t => t.id === detailTask.id ? { ...t, subtasks: updatedSubtasks } : t));

      await apiClient.delete(`/subtasks/${subtaskId}`);
    } catch (e) {
      toast.add({ variant: 'destructive', title: 'Error', description: 'Gagal hapus subtask' });
      fetchTasks();
    }
  };

  // Invite modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);
  const [membersData, setMembersData] = useState<{creator: any, members: any[], pending: any[], isOwner?: boolean}>({ creator: null, members: [], pending: [] });
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [kickConfirmData, setKickConfirmData] = useState<{userId: number, email: string} | null>(null);
  const [unregisteredEmail, setUnregisteredEmail] = useState<string | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<{email: string, password: string} | null>(null);

  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const res = await apiClient.get(`/projects/${projectId}/members`);
      setMembersData(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMembers(false);
    }
  };

  const openInviteModal = () => {
    setShowInviteModal(true);
    fetchMembers();
  };

  // Activity Log state
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [activitySearch, setActivitySearch] = useState('');
  const [activitySort, setActivitySort] = useState<'desc' | 'asc'>('desc');

  const fetchActivities = async () => {
    setLoadingActivities(true);
    try {
      const res = await apiClient.get(`/projects/${projectId}/activities`);
      setActivities(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingActivities(false);
    }
  };

  // Subtasks State
  const [newSubtask, setNewSubtask] = useState('');
  const [submittingSubtask, setSubmittingSubtask] = useState(false);

  const openActivityModal = () => {
    setShowActivityModal(true);
    fetchActivities();
  };

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/projects/${projectId}/tasks`);
      setTasks(response.data.data || response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
      toast.add({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch tasks.'
      });
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // --- Manual Task CRUD ---
  const openCreateModal = () => {
    setEditTask(null);
    setFormTitle('');
    setFormDesc('');
    setFormStatus('todo');
    setFormPriority('medium');
    setFormDueDate('');
    setShowModal(true);
  };

  const openEditModal = (task: Task) => {
    setEditTask(task);
    setFormTitle(task.title);
    setFormDesc(task.description || '');
    setFormStatus(task.status);
    setFormPriority(task.priority);
    setFormDueDate(getDueDate(task) ? getDueDate(task)!.split('T')[0] : '');
    setDetailTask(null);
    setShowModal(true);
  };

  const handleSaveTask = async () => {
    if (!formTitle.trim()) return;
    setSubmitting(true);
    try {
      if (editTask) {
        await apiClient.put(`/tasks/${editTask.id}`, {
          title: formTitle,
          description: formDesc,
          status: formStatus,
          priority: formPriority,
          due_date: formDueDate || null,
        });
        toast.add({ title: 'Task berhasil diperbarui!' });
      } else {
        await apiClient.post(`/tasks`, {
          project_id: Number(projectId),
          title: formTitle,
          description: formDesc,
          status: formStatus,
          priority: formPriority,
          due_date: formDueDate || null,
        });
        toast.add({ title: 'Task berhasil dibuat!' });
      }
      setShowModal(false);
      fetchTasks();
    } catch (error: any) {
      toast.add({
        variant: 'destructive',
        title: 'Gagal menyimpan task',
        description: error.response?.data?.message || 'Terjadi kesalahan.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Yakin ingin menghapus task ini?')) return;
    try {
      await apiClient.delete(`/tasks/${taskId}`);
      toast.add({ title: 'Task berhasil dihapus!' });
      setDetailTask(null);
      fetchTasks();
    } catch (error: any) {
      toast.add({ variant: 'destructive', title: 'Gagal menghapus task', description: error.response?.data?.message });
    }
  };

  const handleMoveTask = async (task: Task, direction: 'next' | 'prev') => {
    const statusOrder: Status[] = ['todo', 'in_progress', 'done'];
    const currentIdx = statusOrder.indexOf(task.status);
    const newIdx = direction === 'next' ? currentIdx + 1 : currentIdx - 1;
    if (newIdx < 0 || newIdx >= statusOrder.length) return;

    const newStatus = statusOrder[newIdx];
    try {
      await apiClient.put(`/tasks/${task.id}`, { status: newStatus });
      toast.add({ title: `Task dipindah ke ${columns.find(c => c.id === newStatus)?.title}` });
      fetchTasks();
    } catch (error: any) {
      toast.add({ variant: 'destructive', title: 'Gagal memindahkan task' });
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      toast.add({ variant: 'destructive', title: 'Format email tidak valid' });
      return;
    }
    setInviting(true);
    try {
      const res = await apiClient.post('/invite', { email: inviteEmail, project_id: projectId });
      const { tempPassword, isNewUser } = res.data.data;
      
      toast.add({ 
        title: 'Undangan terkirim!', 
        description: 'User sudah terdaftar dan undangan telah masuk ke notifikasinya.'
      });
      setInviteEmail('');
      fetchMembers();
    } catch (error: any) {
      if (error.response?.data?.code === 'USER_NOT_FOUND') {
        setUnregisteredEmail(inviteEmail);
      } else {
        toast.add({ 
          variant: 'destructive', 
          title: 'Gagal mengundang', 
          description: error.response?.data?.message || 'Terjadi kesalahan' 
        });
      }
    } finally {
      setInviting(false);
    }
  };

  const handleForceInvite = async () => {
    if (!unregisteredEmail) return;
    setInviting(true);
    try {
      const res = await apiClient.post('/invite', { email: unregisteredEmail, project_id: projectId, forceCreate: true });
      const { tempPassword } = res.data.data;
      
      setGeneratedPassword({ email: unregisteredEmail, password: tempPassword });
      setInviteEmail('');
      setUnregisteredEmail(null);
      fetchMembers();
    } catch (error: any) {
      toast.add({ 
        variant: 'destructive', 
        title: 'Gagal membuat akun', 
        description: error.response?.data?.message || 'Terjadi kesalahan' 
      });
    } finally {
      setInviting(false);
    }
  };

  const executeKickMember = async () => {
    if (!kickConfirmData) return;
    
    try {
      await apiClient.delete(`/projects/${projectId}/members/${kickConfirmData.userId}`);
      toast.add({ title: 'Berhasil', description: 'Member berhasil dikeluarkan' });
      fetchMembers();
      fetchTasks();
    } catch (error: any) {
      toast.add({
        variant: 'destructive',
        title: 'Gagal',
        description: error.response?.data?.message || 'Gagal mengeluarkan member'
      });
    } finally {
      setKickConfirmData(null);
    }
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    
    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) {
      return;
    }
    
    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId as Status;
    
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    
    try {
      await apiClient.put(`/tasks/${taskId}`, { status: newStatus });
    } catch (e: any) {
      toast.add({ variant: 'destructive', title: 'Error', description: 'Gagal memindahkan task' });
      fetchTasks(); // Revert
    }
  };

  // --- Helpers ---
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500 hover:bg-red-600 text-white';
      case 'medium': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'low': return 'bg-green-500 hover:bg-green-600 text-white';
      default: return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  const getDueDate = (task: Task) => task.due_date || task.dueDate;

  const getComputedPriority = (task: Task) => {
    const dueDateStr = getDueDate(task);
    if (dueDateStr && task.status !== 'done') {
      const due = new Date(dueDateStr);
      const today = new Date();
      
      // Calculate diff in days
      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // If 2 days or less away (including overdue), force HIGH priority
      if (diffDays <= 2) {
        return 'high';
      }
    }
    return task.priority;
  };

  const isDueOrOverdue = (task: Task) => {
    if (!getDueDate(task) || task.status === 'done') return false;
    const due = new Date(getDueDate(task)!);
    due.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    return due.getTime() <= today.getTime();
  };

  const getStatusLabel = (status: Status) => columns.find(c => c.id === status)?.title || status;

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-muted/20">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Project
          </Button>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">Task Board</h1>
            <p className="text-muted-foreground">
              Buat task secara manual atau gunakan AI.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={openActivityModal}>
              <ClipboardList className="mr-2 h-4 w-4" />
              Riwayat
            </Button>
            <Button variant="outline" onClick={openInviteModal}>
              <Mail className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
            <Button onClick={openCreateModal}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Task
            </Button>
          </div>
        </div>

        {/* AI Command Bar */}
        <div className="flex items-center gap-3 w-full bg-background border rounded-2xl px-1 py-1 shadow-sm">
          <AiCommandBar projectId={projectId} onSuccess={fetchTasks} />
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-primary" />
          Contoh: &quot;Buatkan task Fix Bug Login dengan priority high&quot;
        </p>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="board" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="board">Papan Kanban</TabsTrigger>
            <TabsTrigger value="analytics">Statistik Project</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="board" className="mt-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">Loading tasks...</div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {columns.map((column) => {
              const columnTasks = tasks.filter(t => t.status === column.id);
              return (
                <div key={column.id} className={`flex flex-col gap-4 p-4 rounded-xl border ${column.border} bg-background`}>
                  {/* Column Header */}
                  <div className={`flex items-center justify-between font-semibold rounded-lg px-3 py-2 ${column.headerBg}`}>
                    <h2 className={`text-base flex items-center gap-2 ${column.headerText}`}>
                      {column.icon}
                      {column.title}
                    </h2>
                    <span className={`text-xs font-bold rounded-full px-2.5 py-0.5 ${column.badgeBg}`}>
                      {columnTasks.length}
                    </span>
                  </div>
                  
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div 
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`flex flex-col gap-3 min-h-[250px] transition-colors ${snapshot.isDraggingOver ? 'bg-muted/50 rounded-lg' : ''}`}
                      >
                        {columnTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  opacity: snapshot.isDragging ? 0.8 : 1,
                                }}
                              >
                                <Card
                                  className={`cursor-pointer hover:shadow-md transition-all shadow-sm group ${column.cardBorder} ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary/20' : ''} ${isDueOrOverdue(task) ? 'border-red-400 ring-1 ring-red-400 dark:border-red-900 dark:ring-red-900' : ''}`}
                                  onClick={() => openDetailModal(task)}
                                >
                                  <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                                    <CardTitle className="text-base leading-tight pr-2">{task.title}</CardTitle>
                                    <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 cursor-grab active:cursor-grabbing" />
                                  </CardHeader>
                                  <CardContent className="p-4 pt-0">
                                    {task.description && (
                                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                        {task.description}
                                      </p>
                                    )}
                                    <div className="flex justify-between items-center mb-2 flex-wrap gap-1">
                                      <div className="flex gap-1 flex-wrap">
                                        <Badge className={getPriorityColor(getComputedPriority(task))}>
                                          {getComputedPriority(task).toUpperCase()}
                                        </Badge>
                                        {isDueOrOverdue(task) && (
                                          <Badge variant="destructive" className="animate-pulse px-1.5 py-0">
                                            HARI INI
                                          </Badge>
                                        )}
                                      </div>
                                      {getDueDate(task) && (
                                        <span className={`text-xs flex items-center gap-1 ${
                                          new Date(getDueDate(task)!) < new Date() && task.status !== 'done' ? 'text-red-500 font-bold' : 'text-muted-foreground'
                                        }`}>
                                          <Calendar className="h-3 w-3" />
                                          {new Date(getDueDate(task)!).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex justify-between items-center">
                                      {task.assignee ? (
                                        <p className="text-xs text-muted-foreground flex items-center">
                                          <User className="h-3 w-3 mr-1" /> {task.assignee.name}
                                        </p>
                                      ) : <div />}
                                      {/* Move buttons - Optional now since we have DND, but keep for accessibility */}
                                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                        {task.status !== 'todo' && (
                                          <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleMoveTask(task, 'prev')}>
                                            <ChevronLeft className="h-3.5 w-3.5" />
                                          </Button>
                                        )}
                                        {task.status !== 'done' && (
                                          <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleMoveTask(task, 'next')}>
                                            <ChevronRight className="h-3.5 w-3.5" />
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {columnTasks.length === 0 && (
                          <div className={`text-sm text-center text-muted-foreground py-8 border border-dashed rounded-lg ${column.emptyBorder}`}>
                            Tidak ada task
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}
      </TabsContent>
      
      <TabsContent value="analytics" className="mt-0">
        <ProjectAnalytics tasks={tasks} />
      </TabsContent>
    </Tabs>

      {/* Detail Task Modal */}
      <Dialog open={!!detailTask} onOpenChange={(open) => !open && setDetailTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detailTask?.title}</DialogTitle>
          </DialogHeader>
          {detailTask && (
            <div className="flex flex-col gap-4 py-2">
              <div className="flex gap-2 flex-wrap">
                <Badge className={getPriorityColor(detailTask.priority)}>
                  {detailTask.priority.toUpperCase()}
                </Badge>
                <Badge variant="outline">
                  {getStatusLabel(detailTask.status)}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Deskripsi</p>
                <p className="text-sm text-muted-foreground">
                  {detailTask.description || 'Tidak ada deskripsi.'}
                </p>
              </div>
              {getDueDate(detailTask) && (
                <div>
                  <p className="text-sm font-medium mb-1">Tenggat Waktu</p>
                  <p className={`text-sm flex items-center gap-1.5 ${
                    new Date(getDueDate(detailTask)!) < new Date() && detailTask.status !== 'done' 
                      ? 'text-red-500 font-bold' 
                      : 'text-muted-foreground'
                  }`}>
                    <Calendar className="h-4 w-4" />
                    {new Date(getDueDate(detailTask)!).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    {new Date(getDueDate(detailTask)!) < new Date() && detailTask.status !== 'done' && ' (Overdue)'}
                  </p>
                </div>
              )}
              {detailTask.assignee && (
                <div>
                  <p className="text-sm font-medium mb-1">Assignee</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <User className="h-4 w-4" /> {detailTask.assignee.name} ({detailTask.assignee.email})
                  </p>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t mt-2">
                <Button variant="outline" size="sm" onClick={() => openEditModal(detailTask)}>
                  <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteTask(detailTask.id)}>
                  <Trash2 className="mr-2 h-3.5 w-3.5" /> Hapus
                </Button>
              </div>

              {/* Subtasks Section */}
              <div className="mt-4 pt-4 border-t flex flex-col gap-3">
                <h3 className="text-sm font-semibold">Sub-task (Checklist)</h3>
                <div className="flex flex-col gap-2">
                  {(detailTask.subtasks || []).map(s => (
                    <div key={s.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={s.isCompleted || s.is_completed === 1} 
                          onChange={() => handleToggleSubtask(s.id, !!(s.isCompleted || s.is_completed === 1))}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <span className={`text-sm ${s.isCompleted || s.is_completed === 1 ? 'line-through text-muted-foreground' : ''}`}>
                          {s.title}
                        </span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleDeleteSubtask(s.id)}>
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      </Button>
                    </div>
                  ))}
                  {(detailTask.subtasks || []).length === 0 && (
                    <p className="text-xs text-muted-foreground">Belum ada checklist.</p>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Input 
                    placeholder="Tambah checklist baru..." 
                    value={newSubtask} 
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                    className="text-sm h-8"
                  />
                  <Button size="sm" className="h-8" onClick={handleAddSubtask} disabled={submittingSubtask || !newSubtask.trim()}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-4 pt-4 border-t flex flex-col gap-3">
                <h3 className="text-sm font-semibold">Komentar</h3>
                
                <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-2">
                  {loadingComments ? (
                    <p className="text-xs text-muted-foreground">Memuat komentar...</p>
                  ) : comments.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Belum ada komentar.</p>
                  ) : (
                    comments.map(c => (
                      <div key={c.id} className="bg-muted/50 p-2.5 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold">{c.user.name}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(c.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm">{c.content}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <Input 
                    placeholder="Tulis komentar..." 
                    value={newComment} 
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                    className="text-sm"
                  />
                  <Button size="sm" onClick={handlePostComment} disabled={submittingComment || !newComment.trim()}>
                    Kirim
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Task Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTask ? 'Edit Task' : 'Tambah Task Baru'}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Judul Task <span className="text-destructive">*</span></label>
              <Input
                placeholder="Contoh: Fix Bug Login"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Deskripsi</label>
              <Input
                placeholder="Deskripsi task..."
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Status</label>
                <Select value={formStatus} onValueChange={(v) => setFormStatus(v as Status)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Priority</label>
                <Select value={formPriority} onValueChange={(v) => setFormPriority(v as 'low' | 'medium' | 'high')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Tenggat Waktu (Due Date)</label>
              <Input
                type="date"
                value={formDueDate}
                onChange={(e) => setFormDueDate(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowModal(false)} disabled={submitting}>
                Batal
              </Button>
              <Button onClick={handleSaveTask} disabled={submitting || !formTitle.trim()}>
                {submitting ? 'Menyimpan...' : editTask ? 'Simpan Perubahan' : 'Buat Task'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Invite Member Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Member Project
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Undang via email (nama@email.com)"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
              />
              <Button onClick={handleInvite} disabled={inviting || !inviteEmail.trim()}>
                {inviting ? 'Mengundang...' : 'Kirim'}
              </Button>
            </div>

            <div className="border-t pt-4 flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
              {loadingMembers ? (
                <p className="text-sm text-center text-muted-foreground py-2">Memuat daftar member...</p>
              ) : (
                <>
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Anggota Aktif</h4>
                    <div className="flex flex-col gap-2">
                      {membersData.creator && (
                        <div className="flex items-center justify-between bg-muted/30 p-2 rounded-md">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4" />
                            <span>{membersData.creator.name} <span className="text-muted-foreground text-xs">({membersData.creator.email})</span></span>
                          </div>
                          <Badge variant="secondary" className="text-[10px]">Owner</Badge>
                        </div>
                      )}
                      {membersData.members.map((m: any) => (
                        <div key={m.id} className="flex items-center justify-between bg-muted/30 p-2 rounded-md group">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{m.name} <span className="text-muted-foreground text-xs">({m.email})</span></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px]">Member</Badge>
                            {membersData.isOwner && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => setKickConfirmData({ userId: m.id, email: m.email })}
                              >
                                Keluarkan
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {membersData.pending.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Menunggu Konfirmasi</h4>
                      <div className="flex flex-col gap-2 opacity-70">
                        {membersData.pending.map((p: any) => (
                          <div key={p.id} className="flex items-center justify-between bg-muted/30 p-2 rounded-md border border-dashed group">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{p.user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[10px] text-yellow-600 border-yellow-600 bg-yellow-50">Pending</Badge>
                              {membersData.isOwner && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => setKickConfirmData({ userId: p.user.id, email: p.user.email })}
                                >
                                  Batalkan
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Activity Log Modal */}
      <Dialog open={showActivityModal} onOpenChange={setShowActivityModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Riwayat Aktivitas Project</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 mt-2">
            <Input 
              placeholder="Cari aktivitas atau nama..." 
              value={activitySearch} 
              onChange={(e) => setActivitySearch(e.target.value)} 
              className="flex-1"
            />
            <select 
              value={activitySort} 
              onChange={(e) => setActivitySort(e.target.value as 'asc' | 'desc')}
              className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="desc">Terbaru</option>
              <option value="asc">Terlama</option>
            </select>
          </div>

          <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2 mt-2">
            {loadingActivities ? (
              <p className="text-sm text-muted-foreground text-center py-4">Memuat aktivitas...</p>
            ) : activities.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Belum ada aktivitas di project ini.</p>
            ) : (
              (() => {
                const filtered = activities.filter(a => 
                  (a.action || '').toLowerCase().includes(activitySearch.toLowerCase()) ||
                  (a.user?.name || '').toLowerCase().includes(activitySearch.toLowerCase())
                ).sort((a, b) => {
                  const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                  return activitySort === 'desc' ? diff : -diff;
                });

                if (filtered.length === 0) {
                   return <p className="text-sm text-muted-foreground text-center py-4">Aktivitas tidak ditemukan.</p>;
                }
                
                return filtered.map(activity => (
                  <div key={activity.id} className="flex gap-3 text-sm">
                    <div className="mt-0.5 flex-none bg-primary/10 p-1.5 rounded-full h-fit">
                      <ClipboardList className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p>
                        <span className="font-semibold">{activity.user.name}</span> {activity.action}
                      </p>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                ));
              })()
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Kick Confirm Modal */}
      <Dialog open={!!kickConfirmData} onOpenChange={(open) => !open && setKickConfirmData(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Konfirmasi</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Apakah Anda yakin ingin mengeluarkan <strong>{kickConfirmData?.email}</strong> dari project ini?
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setKickConfirmData(null)}>Batal</Button>
            <Button variant="destructive" onClick={executeKickMember}>Keluarkan</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unregistered Email Confirm Modal */}
      <Dialog open={!!unregisteredEmail} onOpenChange={(open) => !open && setUnregisteredEmail(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Akun Belum Terdaftar</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-muted-foreground">
              Email <strong>{unregisteredEmail}</strong> belum terdaftar di sistem. Apakah Anda ingin membuatkan akun secara otomatis dan mengirimkan undangan?
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setUnregisteredEmail(null)} disabled={inviting}>Batal</Button>
            <Button onClick={handleForceInvite} disabled={inviting}>
              {inviting ? 'Memproses...' : 'Buat Akun & Undang'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Generated Password Modal */}
      <Dialog open={!!generatedPassword} onOpenChange={(open) => !open && setGeneratedPassword(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Akun Berhasil Dibuat!</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <p className="text-sm text-muted-foreground">
              Akun untuk <strong>{generatedPassword?.email}</strong> telah berhasil dibuat dan diundang ke project ini.
            </p>
            <div className="bg-muted p-3 rounded-md flex items-center justify-between border">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Password Sementara:</p>
                <code className="text-lg font-mono font-bold text-foreground">{generatedPassword?.password}</code>
              </div>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => {
                  navigator.clipboard.writeText(generatedPassword?.password || '');
                  toast.add({ title: 'Tersalin', description: 'Password disalin ke clipboard' });
                }}
              >
                Copy
              </Button>
            </div>
            <p className="text-xs text-muted-foreground italic">
              Harap berikan password ini kepada pengguna terkait. Mereka dapat mengubahnya nanti di menu Profil.
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setGeneratedPassword(null)}>Tutup</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

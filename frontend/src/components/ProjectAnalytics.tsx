'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Task {
  id: number;
  title: string;
  status: string;
  assignee?: { name: string } | null;
  dueDate?: string | null;
  due_date?: string | null;
  updatedAt?: string;
  updated_at?: string;
}

interface ProjectAnalyticsProps {
  tasks: Task[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function ProjectAnalytics({ tasks }: ProjectAnalyticsProps) {
  // 1. Persentase Penyelesaian (Done vs Total)
  const completionData = useMemo(() => {
    const done = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    return [
      { name: 'Done', value: done },
      { name: 'In Progress', value: inProgress },
      { name: 'To Do', value: todo },
    ].filter(d => d.value > 0);
  }, [tasks]);

  const completionPercent = tasks.length === 0 ? 0 : Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100);

  // 2. Beban Kerja Anggota Tim (Tasks Assigned)
  const workloadData = useMemo(() => {
    const map: Record<string, number> = {};
    tasks.forEach(t => {
      const name = t.assignee?.name || 'Unassigned';
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, Tasks: count }));
  }, [tasks]);

  // 3. Chart Jumlah Task Diselesaikan Minggu Ini
  const completedThisWeekData = useMemo(() => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const map: Record<string, number> = {
      Minggu: 0, Senin: 0, Selasa: 0, Rabu: 0, Kamis: 0, Jumat: 0, Sabtu: 0
    };
    
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);

    tasks.forEach(t => {
      if (t.status === 'done') {
        const updateStr = t.updatedAt || t.updated_at;
        if (updateStr) {
          const updated = new Date(updateStr);
          if (updated >= oneWeekAgo) {
            const dayName = days[updated.getDay()];
            map[dayName] += 1;
          }
        }
      }
    });

    return days.map(day => ({ name: day, Selesai: map[day] }));
  }, [tasks]);

  if (tasks.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">Belum ada data task untuk dianalisis.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Progres Project ({completionPercent}% Selesai)</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={completionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {completionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Beban Kerja Anggota Tim</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workloadData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="Tasks" fill="#8884d8" radius={[0, 4, 4, 0]}>
                {workloadData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Task Selesai (7 Hari Terakhir)</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={completedThisWeekData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Selesai" fill="#00C49F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}


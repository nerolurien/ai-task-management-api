'use client';

import { useState } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import apiClient from '@/lib/axios';

interface AiCommandBarProps {
  onSuccess?: () => void;
  projectId?: string;
}

export function AiCommandBar({ onSuccess, projectId }: AiCommandBarProps) {
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setLoading(true);
    try {
      const response = await apiClient.post('/ai/command', { 
        prompt: command,
        project_id: projectId 
      });
      
      toast.add({
        title: 'Sukses',
        description: response.data?.message || 'Task berhasil dibuat oleh AI.',
      });
      
      setCommand('');
      if (onSuccess) onSuccess(); 
    } catch (error: any) {
      toast.add({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Gagal mengeksekusi instruksi AI.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative flex w-full items-center">
        <div className="absolute left-3 flex items-center text-primary">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Sparkles className="h-5 w-5" />
          )}
        </div>
        <Input
          type="text"
          placeholder={loading ? '' : "Ketik instruksi AI di sini..."}
          className="pl-10 pr-12 py-6 text-base rounded-full shadow-sm border-primary/20 focus-visible:ring-primary"
          value={loading ? '' : command}
          onChange={(e) => setCommand(e.target.value)}
          disabled={loading}
        />
        {loading && (
          <div className="absolute inset-0 flex items-center pl-10 pointer-events-none">
            <span className="text-sm text-muted-foreground animate-pulse">
              ✨ AI sedang memproses instruksi Anda...
            </span>
          </div>
        )}
        <Button 
          type="submit" 
          size="icon" 
          disabled={loading || !command.trim()}
          className="absolute right-2 rounded-full h-8 w-8"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}


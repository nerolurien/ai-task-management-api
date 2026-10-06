import Link from 'next/link';
import { ArrowRight, Sparkles, LayoutDashboard, ListTodo, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background Gradient Mesh */}
      <div className="absolute top-0 -translate-y-12 inset-x-0 h-[500px] bg-gradient-to-b from-primary/15 via-transparent to-transparent blur-3xl -z-10" />

      {/* Navbar */}
      <header className="container mx-auto px-6 h-16 flex items-center justify-between border-b border-border/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">Taskly</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" className="text-sm font-medium">Log in</Button>
          </Link>
          <Link href="/register">
            <Button className="text-sm font-medium rounded-full px-6">Sign up</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 md:py-32">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border text-sm text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>AI-Powered Task Management v2.0 is here</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60 mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
          Manage Your Team with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">AI-Powered Intelligence</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          Tinggalkan cara lama. Kelola proyek, atur Papan Kanban, dan delegasikan tugas secara instan hanya dengan perintah teks melalui asisten AI cerdas kami.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
          <Link href="/register">
            <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold shadow-lg shadow-primary/20">
              Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <a href="https://github.com/nerolurien/ai-task-management-api" target="_blank" rel="noreferrer">
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base font-semibold gap-2">
              View on GitHub
            </Button>
          </a>
        </div>

      </main>

      {/* Feature Grid */}
      <section className="container mx-auto px-6 py-24 border-t border-border/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Generative AI Assistant</h3>
            <p className="text-muted-foreground">Buat tugas kompleks, atur prioritas, dan tentukan deadline hanya dengan mengetik perintah layaknya mengobrol.</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Interactive Kanban Board</h3>
            <p className="text-muted-foreground">Visualisasikan progres kerja tim Anda dengan papan Kanban interaktif yang mendukung fitur Drag & Drop yang sangat mulus.</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Enterprise Security</h3>
            <p className="text-muted-foreground">Dilengkapi dengan Role-Based Access Control (Admin/User) dan alur pengundangan member baru yang sangat aman.</p>
          </div>
        </div>
      </section>
    </div>
  );
}


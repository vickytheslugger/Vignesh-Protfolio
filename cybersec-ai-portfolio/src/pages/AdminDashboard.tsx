import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, FolderKanban, Code2, Briefcase, FileText, LogOut, MessageSquare, Menu, X, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectsManager } from './admin/ProjectsManager';
import { SkillsManager } from './admin/SkillsManager';
import { ExperienceManager } from './admin/ExperienceManager';
import { ContentManager } from './admin/ContentManager';
import { MessagesManager } from './admin/MessagesManager';

export function AdminDashboard() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    const TIMEOUT_SECONDS = 300; // 5 minutes
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
      
      setTimeLeft(TIMEOUT_SECONDS);
      
      timeoutId = setTimeout(() => {
        logout();
      }, TIMEOUT_SECONDS * 1000);

      intervalId = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    };

    // Initial timer
    resetTimer();

    // Reset on activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const handleActivity = () => resetTimer();
    
    events.forEach(event => document.addEventListener(event, handleActivity));

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
      events.forEach(event => document.removeEventListener(event, handleActivity));
    };
  }, [logout]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const tabs = [
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'skills', label: 'Skills & Tools', icon: Code2 },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row relative">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={cn(
        "fixed md:sticky top-0 left-0 z-40 h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300 ease-in-out",
        "w-64 md:w-64",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center">
            <LayoutDashboard className="w-6 h-6 text-emerald-400 mr-2" />
            <span className="font-mono font-bold text-slate-100">Admin Panel</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto hide-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
                className={cn(
                  "flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                )}
              >
                <Icon className="w-5 h-5 mr-3 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3 shrink-0" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto w-full">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sticky top-0 z-20">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-400 hover:text-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center">
            <LayoutDashboard className="w-5 h-5 text-emerald-400 mr-2" />
            <span className="font-mono font-bold text-slate-100 text-sm">Admin Panel</span>
          </div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <div className="p-4 md:p-8">
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-bold text-slate-100 capitalize">{activeTab} Management</h1>
              <div className="flex items-center text-xs text-slate-500 mt-1 font-mono">
                <Clock className="w-3 h-3 mr-1 text-emerald-500/50" />
                Session expires in: <span className={cn("ml-1", timeLeft < 60 ? "text-red-400 animate-pulse" : "text-emerald-400/70")}>{formatTime(timeLeft)}</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="hidden md:flex items-center px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors border border-red-500/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 overflow-x-auto">
            {activeTab === 'projects' && <ProjectsManager />}
            {activeTab === 'skills' && <SkillsManager />}
            {activeTab === 'experience' && <ExperienceManager />}
            {activeTab === 'content' && <ContentManager />}
            {activeTab === 'messages' && <MessagesManager />}
          </div>
        </div>
      </div>
    </div>
  );
}

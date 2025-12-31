'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface DashboardShellProps {
  children: React.ReactNode;
  lastUpdated: string | null;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  onRefresh: () => void;
}

export function DashboardShell({ 
  children, 
  lastUpdated, 
  syncStatus,
  onRefresh 
}: DashboardShellProps) {
  const { theme, setTheme } = useTheme();

  const getTimeSinceUpdate = (): string => {
    if (!lastUpdated) return '';
    const date = new Date(lastUpdated);
    const mins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (mins < 1) return 'just now';
    return `${mins}m ago`;
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Top Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm z-10">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight">KR Gold Token Monitor</h1>
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                syncStatus === 'syncing' && "bg-yellow-500 animate-pulse",
                syncStatus === 'synced' && "bg-green-500",
                syncStatus === 'error' && "bg-red-500",
                syncStatus === 'idle' && "bg-muted-foreground"
              )} />
              <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
                {syncStatus === 'syncing' ? 'Syncing Intelligence...' : 'Live Market Data'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
              Last Updated
            </span>
            <span className="text-sm font-light">
              {lastUpdated ? getTimeSinceUpdate() : '---'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="p-2 rounded-full hover:bg-secondary/50 transition-colors group"
              aria-label="Refresh data"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn("group-hover:rotate-180 transition-transform duration-500", syncStatus === 'syncing' && "animate-spin")}
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
            </button>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-secondary/50 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <nav className="w-16 border-r border-border bg-card/30 flex flex-col items-center py-6 gap-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <div className="w-10 h-10 rounded-lg hover:bg-secondary/50 flex items-center justify-center text-muted-foreground transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
          </div>
          <div className="mt-auto w-10 h-10 rounded-lg hover:bg-secondary/50 flex items-center justify-center text-muted-foreground transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </div>
        </nav>

        {/* Children (Main Area) */}
        <main className="flex-1 flex overflow-hidden">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="px-6 py-2 border-t border-border bg-card/30 flex justify-between items-center">
        <span className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
          Institutional Grade Data Authority: CoinGecko
        </span>
        <div className="flex gap-4">
          <span className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
            Auto-Refresh: 60s
          </span>
          <span className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
            Network: L1 Canonical
          </span>
        </div>
      </footer>
    </div>
  );
}

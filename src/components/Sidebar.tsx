import React from 'react';
import { MessageSquare, CloudSun, Calendar, CloudLightning, Globe, ArrowRightLeft, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = [
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
    { id: 'overview', label: 'Weather & Overview', icon: CloudSun },
    { id: 'forecast', label: '7-Day & Hourly', icon: Calendar },
    { id: 'alerts', label: 'Severe Alerts & Radar', icon: CloudLightning },
    { id: 'climate', label: 'Climate & Trends', icon: Globe },
    { id: 'compare', label: 'Weather Comparison', icon: ArrowRightLeft },
    { id: 'settings', label: 'Settings & API Config', icon: Settings },
  ];

  return (
    <nav className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-6 z-50">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
          <CloudSun className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">WeatherAI</span>
      </div>

      <div className="space-y-2 flex-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 p-3 transition-colors rounded-lg text-left w-full",
                isActive 
                  ? "bg-sky-500/10 text-sky-400 font-medium"
                  : "text-slate-400 hover:bg-slate-800"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-auto p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
        <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">System Status</p>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-400">Open-Meteo</span>
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">GPT-4o</span>
          <div className="w-1.5 h-1.5 bg-sky-500 rounded-full"></div>
        </div>
      </div>
    </nav>
  );
}

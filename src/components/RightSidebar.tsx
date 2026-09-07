import React from 'react';
import { Code, Zap, History, Umbrella, Calendar, Flame, CloudSun, CloudRain, Cloud } from 'lucide-react';

interface RightSidebarProps {
  telemetry: any;
}

export function RightSidebar({ telemetry }: RightSidebarProps) {
  return (
    <div className="col-span-12 xl:col-span-4 flex flex-col space-y-6 h-[calc(100vh-140px)] overflow-y-auto pr-2">
      {/* Telemetry Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col space-y-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-400">
            <Code className="w-5 h-5" />
            <span className="font-bold text-sm tracking-widest uppercase">Telemetry</span>
          </div>
          <span className="px-2 py-1 rounded-md bg-sky-500/10 text-sky-400 text-[10px] font-bold uppercase tracking-widest">Live JSON</span>
        </div>
        <p className="text-xs text-slate-400">
          Parsed intent payload extracted from natural language prompt:
        </p>
        <div className="bg-slate-950 rounded-xl p-4 font-mono text-[10px] sm:text-xs overflow-x-auto text-sky-200/70 border border-slate-800">
          <pre>
            <code>
              {telemetry ? JSON.stringify(telemetry, null, 2) : "Waiting for query..."}
            </code>
          </pre>
        </div>
      </div>

      {/* 1-Click Scenarios */}
      <div className="bg-gradient-to-br from-sky-600 to-indigo-700 rounded-3xl p-6 relative overflow-hidden flex flex-col space-y-4 flex-shrink-0 text-white shadow-xl shadow-indigo-900/20">
        <div className="z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-100">
            <Zap className="w-5 h-5" />
            <span className="font-bold text-sm tracking-widest uppercase">Scenarios</span>
          </div>
        </div>
        
        <div className="z-10 flex flex-col gap-3">
          {[
            { icon: History, title: 'Compare today vs yesterday', subtitle: 'Delta analysis' },
            { icon: Umbrella, title: 'Will it rain this weekend?', subtitle: 'Probability models' },
            { icon: Calendar, title: 'Temperature in 2010?', subtitle: 'Historical archive' },
          ].map((preset, i) => (
            <button key={i} className="w-full text-left p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/5 flex items-center gap-3 group backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-sky-200">
                <preset.icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white leading-tight">{preset.title}</span>
                <span className="text-[10px] text-sky-200 uppercase tracking-wider">{preset.subtitle}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Monitored Stations / Alerts */}
      <div className="bg-amber-950/20 border border-amber-900/40 rounded-3xl p-6 flex flex-col flex-shrink-0">
        <div className="flex items-center gap-2 text-amber-500 mb-4">
          <Flame className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-tighter">Monitored / Alerts</span>
        </div>
        
        <div className="space-y-3">
          <div className="bg-slate-900/50 border border-amber-900/20 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <CloudSun className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-amber-100">Delhi, India</span>
                <span className="text-[10px] uppercase tracking-wider text-amber-500/70">AQI 184 (Poor)</span>
              </div>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-2xl font-light text-amber-100">32°</span>
              <span className="text-[10px] text-amber-500">H: 36° L: 24°</span>
            </div>
          </div>
          
          <div className="bg-slate-900/50 border border-amber-900/20 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <CloudRain className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-amber-100">Mumbai, India</span>
                <span className="text-[10px] uppercase tracking-wider text-amber-500/70">Humid</span>
              </div>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-2xl font-light text-amber-100">29°</span>
              <span className="text-[10px] text-amber-500">Precip 82%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

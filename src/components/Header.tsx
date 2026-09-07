import React from 'react';
import { MapPin, ChevronDown, Bell } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-between h-20 px-8">
      <div className="relative w-96">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          <MapPin className="w-4 h-4" />
        </span>
        <input 
          type="text" 
          placeholder="Search locations..." 
          defaultValue="Delhi, India · 28.61°N, 77.21°E"
          className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-sky-500 transition-colors text-slate-200 placeholder-slate-500"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <button type="button" className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold border border-slate-600 text-white">
          U
        </div>
      </div>
    </header>
  );
}

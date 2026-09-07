/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ChatView } from './components/ChatView';
import { RightSidebar } from './components/RightSidebar';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [telemetry, setTelemetry] = useState(null);

  return (
    <div className="flex h-screen w-full bg-slate-950 font-sans text-slate-200 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        
        <main className="flex-1 p-8 flex flex-col overflow-y-auto">
          <div className="flex-1 grid grid-cols-12 grid-rows-6 gap-6 w-full max-w-[1920px] mx-auto">
            {activeTab === 'chat' && (
              <>
                <ChatView onTelemetryUpdate={setTelemetry} />
                <RightSidebar telemetry={telemetry} />
              </>
            )}
            {activeTab !== 'chat' && (
              <div className="col-span-12 row-span-6 flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                    <span className="material-symbols-outlined text-3xl">construction</span>
                  </div>
                  <h2 className="font-bold text-xl text-slate-200">Module Under Construction</h2>
                  <p className="text-slate-400">The {activeTab} view is being developed.</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

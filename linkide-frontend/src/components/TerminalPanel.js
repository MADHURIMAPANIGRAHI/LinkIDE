// components/TerminalPanel.js
'use client';

import { Terminal, Trash2 } from 'lucide-react';

export default function TerminalPanel({ output, setOutput, isRunning }) {
  return (
    <div className="h-1/2 border-b border-zinc-800 flex flex-col bg-zinc-950">
      {/* Terminal Utility Strip */}
      <div className="h-9 bg-zinc-900/20 border-b border-zinc-900 flex items-center justify-between px-4 select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Container Output Sandbox</span>
        </div>
        
        <button 
          onClick={() => setOutput('Console buffer cleared.')}
          className="text-zinc-600 hover:text-rose-400 p-1 rounded-md transition-colors"
          title="Clear Console Shell Logs"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Code Runner Execution Terminal Display Screen */}
      <div className="flex-1 p-4 font-mono text-xs text-zinc-300 overflow-y-auto whitespace-pre-wrap selection:bg-zinc-800 leading-relaxed relative">
        {isRunning ? (
          <div className="flex items-center gap-2 text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            Spawning Docker container lifecycle instance, running compilation tree tasks...
          </div>
        ) : (
          output
        )}
      </div>
    </div>
  );
}
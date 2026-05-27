// app/room/[roomId]/page.js
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { io } from 'socket.io-client';
import { Play, Mic, MicOff, Copy, Check, LogOut } from 'lucide-react';

import EditorContainer from '@/components/EditorContainer';
import TerminalPanel from '@/components/TerminalPanel';
import ChatPanel from '@/components/ChatPanel';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const roomId = params.roomId;
  const [socket, setSocket] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('Terminal ready. Click "Run Code" to deploy your code sandbox container...');
  const [isRunning, setIsRunning] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [copied, setCopied] = useState(false);

  const boilerplates = {
    javascript: `// DevSync Node Sandbox\nconsole.log("Hello from JavaScript engine!");\n`,
    python: `# DevSync Python Sandbox\nprint("Hello from Python container!")\n`,
    cpp: `// DevSync C++ Sandbox\n#include <iostream>\n\nint main() {\n    std::cout << "Hello from compiled binary!\\n";\n    return 0;\n}\n`
  };

  const [code, setCode] = useState(boilerplates.javascript);

  // Handle Socket Server Lifecycle Connection Initialization
  useEffect(() => {
    if (status !== "authenticated") return;

    // Connect to your separate Node.js state execution cluster backend port
    const socketInstance = io('http://localhost:5000');
    setSocket(socketInstance);

    const username = session?.user?.name || session?.user?.email || "Anonymous Dev";

    socketInstance.emit('join-room', { roomId, username });

    // Synchronization callback from backend when entering active existing workspaces
    socketInstance.on('sync-initial-state', (roomState) => {
      if (roomState?.code) setCode(roomState.code);
      if (roomState?.language) setLanguage(roomState.language);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [status, roomId, session]);

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    const newCode = boilerplates[selectedLang] || '// Write code here...\n';
    setCode(newCode);
    
    if (socket) {
      socket.emit('code-change', { roomId, code: newCode });
    }
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock Execute trigger - We will link this directly to the Express + Docker backend runtimes next!
  const triggerSandboxRun = async () => {
    setIsRunning(true);
    setTimeout(() => {
      setOutput(`[Docker Engine Status Logs]: Compiled Successfully.\nHello from inside your execution container environment!\nExit status: 0 (Clean Execution)`);
      setIsRunning(false);
    }, 1500);
  };

  if (status === "loading") return <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-500 font-mono text-xs">Connecting to secure space cluster...</div>;
// Redirect Effect
useEffect(() => {
  if (status === "unauthenticated") {
    router.replace('/');
  }
}, [status, router]);

// Loading UI
if (status === "loading") return <Loading />;

// Prevent render before redirect completes
if (status === "unauthenticated") return null;

  return (
    <div className="h-screen w-screen bg-[#09090b] flex flex-col text-zinc-200 overflow-hidden font-sans">
      
      {/* Upper Global Navigation Toolbar */}
      <header className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-6 z-10 select-none">
        <div className="flex items-center gap-4">
          <span className="font-bold tracking-tight text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            DevSync Workspace
          </span>
          <div className="h-4 w-[1px] bg-zinc-800" />
          <button 
            onClick={handleCopyRoomId}
            className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs px-2.5 py-1.5 rounded-lg transition-all active:scale-95 font-mono"
          >
            {roomId}
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={language} 
            onChange={handleLanguageChange}
            className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs rounded-lg text-zinc-300 outline-none focus:border-indigo-500 transition-all cursor-pointer font-medium"
          >
            <option value="javascript">JavaScript (Node)</option>
            <option value="python">Python 3</option>
            <option value="cpp">C++ (GCC)</option>
          </select>

          <button 
            onClick={() => setIsMicActive(!isMicActive)}
            className={`p-2 rounded-lg border transition-all ${isMicActive ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
          >
            {isMicActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          <button
            onClick={triggerSandboxRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Run Sandbox
          </button>
        </div>
      </header>

      {/* Main Multi-Pane Modular Layout Area Grid Split */}
      <div className="flex-1 flex w-full overflow-hidden">
        
        {/* Left Modular Section Container */}
        <EditorContainer 
          socket={socket} 
          roomId={roomId} 
          language={language} 
          code={code} 
          setCode={setCode} 
        />

        {/* Right Stacked Sidebar Sections Container */}
        <div className="w-1/3 h-full flex flex-col bg-zinc-950">
          <TerminalPanel 
            output={output} 
            setOutput={setOutput} 
            isRunning={isRunning} 
          />
          <ChatPanel 
            socket={socket} 
            roomId={roomId} 
            username={session?.user?.name || session?.user?.email} 
          />
        </div>

      </div>
    </div>
  );
}
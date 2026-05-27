// app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

import { 
  Code2, Plus, ArrowRight, LogOut, Terminal, 
  Clock, FolderHeart, Copy, Check 
} from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Mock Data - We will link this to MongoDB aggregation pipelines later!
  const recentRooms = [
    { id: 'x7y2z9w1b', language: 'python', lastActive: '2 hours ago', users: 3 },
    { id: 'a1b2c3d4e', language: 'javascript', lastActive: 'Yesterday', users: 2 },
  ];

  const savedSnippets = [
    { id: '1', title: 'Binary Search Optimization', lang: 'cpp', lines: 24 },
    { id: '2', title: 'Next.js Streaming Chunk Handler', lang: 'javascript', lines: 42 },
  ];

  const handleCreateRoom = () => {
    const uniqueId = Math.random().toString(36).substring(2, 11);
    router.push(`/room/${uniqueId}`);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (!roomId.trim()) return alert('Please enter a valid Room ID!');
    router.push(`/room/${roomId.trim()}`);
  };

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
  if (status === "unauthenticated") {
    router.replace("/");
  }
}, [status, router]);

if (status === "loading") {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-400 font-mono text-xs">
      Loading workspace metrics...
    </div>
  );
}

if (status === "unauthenticated") {
  return null;
}

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 font-sans flex flex-col">
      {/* Premium Dashboard Navbar Top Bar */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <Code2 className="w-6 h-6 text-indigo-500" />
          <span className="font-bold tracking-tight text-lg text-white">DevSync Terminal</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
            <img src={session?.user?.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${session?.user?.email}`} alt="Avatar" className="w-5 h-5 rounded-md bg-zinc-800"/>
            <span className="text-xs font-medium text-zinc-300 max-w-[120px] truncate">{session?.user?.name || session?.user?.email}</span>
          </div>
          <button onClick={() => signOut()} className="p-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-rose-400 rounded-xl transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Dashboard Workspace Body View */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        
        {/* Welcome Section Banner Component */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-br from-zinc-950 to-zinc-900/40 p-6 rounded-2xl border border-zinc-800">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back, Developer</h2>
            <p className="text-xs text-zinc-400 mt-1">Deploy ephemeral code engines or sync live runtime scripts instantly.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleJoinRoom} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Paste Peer Room ID Token..." 
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="bg-zinc-900/60 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-zinc-200 outline-none focus:border-indigo-500 w-44 transition-all"
              />
              <button type="submit" className="px-3 bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-all">
                Join
                <ArrowRight className="w-3 h-3" />
              </button>
            </form>
            <button onClick={handleCreateRoom} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 transition-all active:scale-95">
              <Plus className="w-4 h-4" />
              New Coding Room
            </button>
          </div>
        </div>

        {/* Dashboard Analytics Two-Column Split Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Recent Rooms Active Synced List Box (Takes 2 Columns) */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Clock className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Recent Collab Sessions</h3>
            </div>
            
            <div className="bg-zinc-950/40 border border-zinc-850 rounded-2xl overflow-hidden">
              <div className="divide-y divide-zinc-900">
                {recentRooms.map((room) => (
                  <div key={room.id} className="p-4 flex items-center justify-between hover:bg-zinc-900/20 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 group-hover:text-indigo-400 transition-colors">
                        <Terminal className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono font-bold text-zinc-200">{room.id}</span>
                          <button onClick={() => handleCopy(room.id)} className="text-zinc-600 hover:text-zinc-400 p-1 rounded transition-colors">
                            {copiedId === room.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] bg-zinc-900 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded uppercase font-semibold tracking-wider font-mono">{room.language}</span>
                          <span className="text-xs text-zinc-500">{room.users} peers active</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => router.push(`/room/${room.id}`)} className="p-2 bg-zinc-900 hover:bg-indigo-600 border border-zinc-800 hover:border-indigo-500 text-zinc-400 hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Saved Snippets Library Box Component (Takes 1 Column) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <FolderHeart className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Saved Blueprints</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {savedSnippets.map((snippet) => (
                <div key={snippet.id} className="p-4 bg-zinc-950/40 border border-zinc-850 rounded-2xl hover:border-zinc-700 transition-all cursor-pointer flex flex-col justify-between h-28 group">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200 group-hover:text-indigo-400 transition-colors line-clamp-1">{snippet.title}</h4>
                    <span className="text-[9px] text-zinc-500 font-mono block mt-1">{snippet.lines} lines of functional logic</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[9px] bg-emerald-950/30 text-emerald-400 border border-emerald-900/50 px-2 py-0.5 rounded font-mono uppercase tracking-wider font-bold">{snippet.lang}</span>
                    <span className="text-[10px] text-zinc-600 group-hover:text-zinc-400 transition-colors font-medium flex items-center gap-1">Open <ArrowRight className="w-2.5 h-2.5" /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
// components/ChatPanel.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Users, Send } from 'lucide-react';

export default function ChatPanel({ socket, roomId, username }) {
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [onlineCount, setOnlineCount] = useState(1);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming peer messages
    socket.on('receive-message', (msgData) => {
      setMessages((prev) => [...prev, msgData]);
    });

    // Track user counting updates
    socket.on('room-presence-update', ({ count }) => {
      setOnlineCount(count);
    });

    return () => {
      socket.off('receive-message');
      socket.off('room-presence-update');
    };
  }, [socket]);

  // Smooth scroll to latest messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || !socket) return;

    const messageData = {
      id: Math.random().toString(36).substring(2, 9),
      sender: username || 'Anonymous User',
      text: inputMsg.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Emit event straight to backend cluster node pipeline
    socket.emit('send-message', { roomId, messageData });
    setMessages((prev) => [...prev, messageData]);
    setInputMsg('');
  };

  return (
    <div className="h-1/2 flex flex-col bg-zinc-950">
      {/* Panel Header */}
      <div className="h-9 bg-zinc-900/20 border-b border-zinc-900 flex items-center px-4 justify-between select-none">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Active Workspace Sync Logs</span>
        </div>
        <span className="text-[10px] text-zinc-500 flex items-center gap-1 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
          <Users className="w-3 h-3 text-indigo-400" /> {onlineCount} online
        </span>
      </div>
      
      {/* Message Output Thread Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col">
        {messages.length === 0 && (
          <div className="text-zinc-600 text-xs italic text-center my-auto">
            No historical message data records captured inside this session room.
          </div>
        )}
        
        {messages.map((msg) => {
          const isMe = msg.sender === username;
          return (
            <div 
              key={msg.id} 
              className={`flex flex-col gap-1 max-w-[85%] bg-zinc-900 border border-zinc-850 p-2.5 rounded-xl ${isMe ? 'self-end border-indigo-500/20 bg-indigo-950/10' : 'self-start'}`}
            >
              <div className="flex items-center gap-2 justify-between">
                <span className="text-[9px] font-bold text-indigo-400 font-mono truncate max-w-[100px]">{msg.sender}</span>
                <span className="text-[8px] text-zinc-600 font-mono">{msg.timestamp}</span>
              </div>
              <p className="text-xs text-zinc-300 break-words">{msg.text}</p>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input Action Form */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-900 bg-zinc-950/60 flex gap-2">
        <input 
          type="text" 
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Broadcast a sync alert note string..."
          className="flex-1 bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-2 text-xs text-zinc-200 outline-none focus:border-indigo-500 transition-all placeholder:text-zinc-600"
        />
        <button type="submit" className="p-2 bg-zinc-900 hover:bg-indigo-600 border border-zinc-800 hover:border-indigo-500 rounded-xl transition-all text-zinc-400 hover:text-white">
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
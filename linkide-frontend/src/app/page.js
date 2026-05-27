// src/app/page.js
'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Code, Sparkles, Terminal, Shield, 
  Cpu, Zap, ArrowRight
} from 'lucide-react';
import { FaGithub } from "react-icons/fa";
export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, bypass landing page instantly
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/daashboard'); // Matches your spelling "daashboard"
    }
  }, [status, router]);

  const handleMagicLinkSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    try {
      await signIn('email', { email, callbackUrl: '/daashboard' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-500 font-mono text-xs">
        Initializing workspace gateways...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* 1. NAVIGATION BAR */}
      <nav className="h-16 border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md fixed top-0 w-full z-50 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse" />
          <span className="font-bold tracking-tight text-white font-mono text-lg">DevSync<span className="text-indigo-400">.ide</span></span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => signIn('google', { callbackUrl: '/daashboard' })}
            className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => document.getElementById('auth-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white text-xs font-medium px-4 py-2 rounded-xl transition-all"
          >
            Deploy Console
          </button>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="pt-32 pb-20 px-6 max-w-6xl mx-auto text-center flex flex-col items-center justify-center relative">
        <div className="absolute top-20 w-72 h-72 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
        
        <span className="inline-flex items-center gap-1.5 bg-indigo-950/40 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold font-mono px-3 py-1 rounded-full uppercase tracking-wider mb-6 animate-fade-in">
          <Sparkles className="w-3 h-3" /> Next-Gen Collaborative Programming Architecture
        </span>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white max-w-4xl leading-[1.15] mb-6">
          Real-Time Remote Coding. <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Isolated In-Browser Execution.
          </span>
        </h1>

        <p className="text-zinc-400 text-sm md:text-base max-w-2xl mb-10 leading-relaxed">
          Stop just passing basic text strings over websockets. Compile code inside real-time secure sandboxes, generate inline logic with AST-guided models, and clear sync lag instantly.
        </p>

        {/* Dynamic Multi-Option Authentication Form Card */}
        <div id="auth-section" className="w-full max-w-md bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-2xl relative z-10">
          <h3 className="text-sm font-bold text-white text-left mb-1">Access Cloud Workspace</h3>
          <p className="text-xs text-zinc-500 text-left mb-4">No password required. Registration initializes seamlessly on execution setup loops.</p>
          
          {/* Email Magic Link Trigger */}
          <form onSubmit={handleMagicLinkSubmit} className="flex flex-col gap-2.5 mb-4">
            <input 
              type="email" 
              required
              placeholder="Enter your developer email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 outline-none focus:border-indigo-500 transition-all placeholder:text-zinc-600"
            />
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10 active:scale-[0.99]"
            >
              {isSubmitting ? 'Sending Magic Route Token...' : 'Get Magic Link Route'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Divider Strip */}
          <div className="flex items-center gap-3 my-4 select-none">
            <div className="h-[1px] flex-1 bg-zinc-900" />
            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">or verify via SSO</span>
            <div className="h-[1px] flex-1 bg-zinc-900" />
          </div>

          {/* Google SSO Button */}
          <button 
            onClick={() => signIn('google', { callbackUrl: '/daashboard' })}
            className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850 text-zinc-300 font-medium text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            {/* Minimalist Vector Google Emblem */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google Account
          </button>
        </div>
      </section>

      {/* 3. CORE PRODUCT ARCHITECTURE FEATURES FEATURE SECTION */}
      <section className="py-20 bg-zinc-950/40 border-t border-zinc-900 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-3">Engineered for Technical Portfolios</h2>
            <p className="text-xs md:text-sm text-zinc-500 max-w-xl mx-auto">This system abandons typical shallow clone implementations to deploy structural production-grade components.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl hover:border-zinc-800 transition-colors">
              <div className="h-8 w-8 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-4">
                <Terminal className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">Isolated Execution Sandboxes</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">Spins up ephemeral backend Docker containers to execute client code securely without exposing local system kernels.</p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl hover:border-zinc-800 transition-colors">
              <div className="h-8 w-8 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-4">
                <Code className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">AST Context Inline AI</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">Uses Gemini streams to capture preceding layout structures and pipe atomic generation loops right to the cursor array via custom Monaco binds.</p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl hover:border-zinc-800 transition-colors">
              <div className="h-8 w-8 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">No-Collision CRDT Sync</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">Ensures mathematical convergence across high-concurrency event loops to completely solve dirty line-overwrite bugs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="h-16 border-t border-zinc-900 bg-zinc-950 flex items-center justify-between px-6 md:px-12 text-xs text-zinc-600 font-mono select-none">
        <span>&copy; 2026 DevSync Space Lab. Open Source Engineering.</span>
        <a href="https://github.com" className="flex items-center gap-1 hover:text-zinc-400 transition-colors">
          <FaGithub className="w-3.5 h-3.5" /> Repository
        </a>
      </footer>

    </div>
  );
}
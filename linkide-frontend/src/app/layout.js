// app/layout.js
import { Inter } from 'next/font/google';
import AuthProvider from '@/components/AuthProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: 'DevSync IDE — Real-Time Collaborative Workspace',
  description: 'Production-grade collaborative workspace with isolated runtimes and streaming GenAI.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark selection:bg-indigo-500/30">
      <body className={`${inter.variable} font-sans bg-[#09090b] text-zinc-200 antialiased min-h-screen overflow-x-hidden`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
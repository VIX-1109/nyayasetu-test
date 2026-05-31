"use client";

import Link from 'next/link';
import { Inbox } from '@/components/Inbox';
import AccountMenu from '@/components/AccountMenu';
import MobileNav from '@/components/MobileNav';
import { Scale, MessageSquare } from 'lucide-react';

const MessagesInbox = ({ user, logout }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="ns-nav sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="ns-nav-inner">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
            <span className="serif text-2xl font-bold text-[#0F172A]">NyayaSetu</span>
          </Link>
          <div className="hidden md:flex ns-nav-links">
            <Link href="/feed" className="font-medium text-slate-600 hover:text-[#0F172A] text-sm transition-colors">Justice Feed</Link>
            <Link href="/advocates" className="font-medium text-slate-600 hover:text-[#0F172A] text-sm transition-colors">Find Advocates</Link>
            <AccountMenu user={user} logout={logout} />
          </div>
          <div className="flex md:hidden items-center gap-2">
            <AccountMenu user={user} logout={logout} />
            <MobileNav user={user} logout={logout} />
          </div>
        </div>
      </nav>

      {/* Dark hero banner */}
      <div
        className="w-full px-4 sm:px-6 md:px-12 lg:px-24 py-10 md:py-12"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}
      >
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="bg-[#B45309]/20 p-3 rounded-sm">
            <MessageSquare className="h-6 w-6 text-[#B45309]" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Inbox</p>
            <h1 className="serif text-3xl font-bold text-white">Messages</h1>
            <p className="text-slate-400 text-sm mt-0.5">Your secure NyayaSetu conversations.</p>
          </div>
        </div>
      </div>

      <main className="ns-page">
        <section className="mx-auto max-w-4xl rounded-sm border border-slate-200 bg-white shadow-sm overflow-hidden">
          <Inbox emptyHint="No conversations yet. Start from an advocate profile or consultation request." />
        </section>
      </main>
    </div>
  );
};

export default MessagesInbox;

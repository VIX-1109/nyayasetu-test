"use client";

import Link from 'next/link';
import { Inbox } from '@/components/Inbox';
import AccountMenu from '@/components/AccountMenu';
import { Scale } from 'lucide-react';

const MessagesInbox = ({ user, logout }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="ns-nav">
        <div className="ns-nav-inner">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
            <span className="serif text-2xl font-bold text-[#0F172A]">NyayaSetu</span>
          </Link>
          <div className="ns-nav-links">
            <Link href="/feed" className="font-medium text-slate-700 hover:text-[#0F172A]">Justice Feed</Link>
            <Link href="/advocates" className="font-medium text-slate-700 hover:text-[#0F172A]">Find Advocates</Link>
            <AccountMenu user={user} logout={logout} />
          </div>
        </div>
      </nav>
      <main className="ns-page">
        <section className="mx-auto max-w-4xl rounded-sm border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <h1 className="serif text-3xl font-semibold text-[#0F172A]">Messages</h1>
            <p className="mt-2 text-sm text-slate-600">Your secure NyayaSetu conversations appear here.</p>
          </div>
          <Inbox emptyHint="No conversations yet. Start from an advocate profile or consultation request." />
        </section>
      </main>
    </div>
  );
};

export default MessagesInbox;

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AnimatedLogo from '@/components/AnimatedLogo';
import { usePathname } from 'next/navigation';
import { X, Menu, Scale, Home, Users, Newspaper, BookOpen, Shield, MessageCircle, User, LogOut } from 'lucide-react';
import { getDashboardPath } from '@/components/ProtectedPage';

const MobileNav = ({ user, logout, navLinks = [] }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const defaultLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/advocates', label: 'Find Advocates', icon: Users },
    { href: '/feed', label: 'Justice Feed', icon: Newspaper },
    { href: '/ai-learning', label: 'AI Law Learning', icon: BookOpen },
  ];

  const authLinks = user ? [
    { href: getDashboardPath(user.role), label: 'Dashboard', icon: Shield },
    { href: '/messages', label: 'Messages', icon: MessageCircle },
    { href: '/profile', label: 'My Profile', icon: User },
  ] : [];

  const allLinks = navLinks.length > 0 ? navLinks : [...defaultLinks, ...authLinks];

  return (
    <>
      {/* Hamburger button — only visible on mobile */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-sm border border-slate-200 bg-white text-slate-600 hover:text-[#0F172A] transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[80vw] max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b border-slate-100"
          style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}
        >
          <div className="flex items-center gap-2">
            <AnimatedLogo size={26} navy="#ffffff" />
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-sm bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User info if logged in */}
        {user && (
          <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#B45309] flex items-center justify-center text-white font-black text-sm shrink-0">
                {user.name?.[0] || 'U'}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-[#0F172A] text-sm truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  {user.role === 'advocate' ? 'Advocate' : user.role === 'admin' ? 'Admin' : 'Client'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-3">
          {allLinks.map((link) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              className={`flex items-center gap-4 px-5 py-3.5 text-sm font-semibold transition-colors ${
                pathname === link.href
                  ? 'text-[#B45309] bg-[#B45309]/5 border-r-2 border-[#B45309]'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-[#0F172A]'
              }`}
            >
              <link.icon className={`h-5 w-5 shrink-0 ${pathname === link.href ? 'text-[#B45309]' : 'text-slate-400'}`} />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Bottom — login or logout */}
        <div className="border-t border-slate-100 p-4">
          {user ? (
            <button
              onClick={() => { setOpen(false); logout?.(); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-red-600 hover:bg-red-50 font-bold text-sm transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          ) : (
            <Link
              href="/auth"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-sm bg-[#0F172A] text-white font-bold text-sm hover:bg-[#0F172A]/90 transition-colors"
            >
              Login / Register
            </Link>
          )}
          <p className="text-center text-[10px] text-slate-300 mt-3">© 2026 NyayaSetu</p>
        </div>
      </div>
    </>
  );
};

export default MobileNav;

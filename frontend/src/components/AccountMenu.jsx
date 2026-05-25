"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getDashboardPath } from '@/components/ProtectedPage';
import { Bell, BriefcaseBusiness, CheckCircle2, FileText, LayoutDashboard, LogOut, Menu, MessageCircle, Settings, ShieldCheck, User, Users } from 'lucide-react';

const initialsFor = (user) => {
  const source = user?.name || user?.email || 'NS';
  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'NS';
};

const roleLabel = (role) => {
  if (role === 'admin') return 'Platform Admin';
  if (role === 'advocate') return 'Advocate';
  return 'Client';
};

const roleLinks = (user) => {
  if (user?.role === 'admin') {
    return [
      { href: '/admin', label: 'Admin Dashboard', icon: ShieldCheck },
      { href: '/admin', label: 'Verification Queue', icon: CheckCircle2 },
      { href: '/admin', label: 'User Management', icon: Users },
    ];
  }

  if (user?.role === 'advocate') {
    return [
      { href: '/advocate/dashboard', label: 'Advocate Dashboard', icon: BriefcaseBusiness },
      { href: '/advocate/dashboard', label: 'Verification Status', icon: CheckCircle2 },
      { href: '/messages', label: 'Client Messages', icon: MessageCircle },
    ];
  }

  return [
    { href: '/client/dashboard', label: 'Client Dashboard', icon: LayoutDashboard },
    { href: '/advocates', label: 'Saved Advocates', icon: Users },
    { href: '/ai-learning', label: 'AI History', icon: FileText },
  ];
};

const AccountMenu = ({ user, logout, compact = false }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  if (!user) {
    return (
      <Link href="/auth">
        <Button data-testid="login-btn" className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-10 px-5 rounded-sm font-medium shadow-sm">
          Login
        </Button>
      </Link>
    );
  }

  const items = [
    { href: '/profile', label: 'My Profile', icon: User },
    { href: getDashboardPath(user.role), label: 'Dashboard', icon: LayoutDashboard },
    { href: '/messages', label: 'Messages', icon: MessageCircle },
    { href: '/profile', label: 'Settings', icon: Settings },
    ...roleLinks(user),
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white pl-1 pr-3 text-left shadow-sm transition hover:border-[#B45309]/40"
        aria-haspopup="menu"
        aria-expanded={open}
        data-testid="account-menu-button"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0F172A] text-xs font-bold text-white">
          {initialsFor(user)}
        </span>
        {!compact && (
          <span className="hidden min-w-0 sm:block">
            <span className="block max-w-[130px] truncate text-sm font-semibold text-[#0F172A]">{user.name || 'Account'}</span>
            <span className="block text-[10px] uppercase tracking-wide text-slate-500">{roleLabel(user.role)}</span>
          </span>
        )}
        <Menu className="h-4 w-4 text-slate-500" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-72 overflow-hidden rounded-sm border border-slate-200 bg-white shadow-xl" role="menu">
          <div className="border-b border-slate-100 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-[#0F172A] text-sm font-bold text-white">
                {initialsFor(user)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-[#0F172A]">{user.name || 'NyayaSetu Member'}</p>
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              </div>
            </div>
            {user.role === 'advocate' && (
              <div className="mt-3 rounded-sm bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
                Verification: {user.verification_status || user.advocate_verification_status || 'pending'}
              </div>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto py-2">
            {items.map((item, index) => {
              const Icon = item.icon || Bell;
              return (
                <Link
                  key={`${item.href}-${item.label}-${index}`}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0F172A]"
                  role="menuitem"
                >
                  <Icon className="h-4 w-4 text-slate-400" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-slate-100 p-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                logout?.();
              }}
              className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
              role="menuitem"
              data-testid="logout-btn"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;

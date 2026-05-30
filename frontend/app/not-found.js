import Link from 'next/link';
import { Scale, ArrowRight, Search, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}
    >
      <div className="max-w-lg w-full text-center space-y-8">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <Scale className="h-7 w-7 text-white" strokeWidth={1.5} />
          <span className="text-xl font-bold serif text-white">NyayaSetu</span>
        </div>

        {/* 404 number */}
        <div className="relative">
          <p className="text-[140px] md:text-[180px] font-black text-white/5 leading-none select-none">404</p>
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
            <div className="bg-[#B45309]/20 border border-[#B45309]/30 rounded-full p-4">
              <Scale className="h-8 w-8 text-[#B45309]" strokeWidth={1.5} />
            </div>
            <p className="text-[#B45309] text-xs font-black uppercase tracking-widest">404 — Page Not Found</p>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="serif text-3xl md:text-4xl font-bold text-white">
            This page doesn't exist
          </h1>
          <p className="text-slate-400 leading-relaxed">
            The page you're looking for may have been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button className="bg-[#B45309] text-white hover:bg-[#B45309]/90 h-12 px-8 rounded-sm font-bold w-full sm:w-auto">
              Return Home <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/advocates">
            <Button variant="outline" className="bg-transparent border-white/20 text-white hover:bg-white/10 h-12 px-8 rounded-sm font-bold w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" /> Find Advocates
            </Button>
          </Link>
        </div>

        {/* Quick links */}
        <div className="border-t border-white/10 pt-6">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Quick Links</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'AI Law Learning', href: '/ai-learning', icon: BookOpen },
              { label: 'Justice Feed', href: '/feed', icon: Scale },
              { label: 'Login / Register', href: '/auth', icon: ArrowRight },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors border border-white/10 px-3 py-2 rounded-sm hover:border-white/30"
              >
                <link.icon className="h-3.5 w-3.5" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}

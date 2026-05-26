import Link from 'next/link';
import { Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
      <section className="max-w-xl text-center space-y-6">
        <div className="mx-auto h-16 w-16 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
          <Scale className="h-8 w-8 text-[#B45309]" strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">404</p>
          <h1 className="serif text-4xl font-bold text-[#0F172A]">Page not found</h1>
          <p className="text-slate-600">
            The page you are looking for is unavailable or may have been moved.
          </p>
        </div>
        <Link href="/">
          <Button className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90 rounded-sm h-11 px-6">
            Return home
          </Button>
        </Link>
      </section>
    </main>
  );
}

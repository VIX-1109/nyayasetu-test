'use client';
import Link from 'next/link';
import { Scale, BookOpen, Users, Shield, ArrowRight, Newspaper, BadgeCheck, MessageCircle, CheckCircle2, Search, FileText, Star, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AccountMenu from '@/components/AccountMenu';

const Landing = ({ user, logout }) => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="ns-nav sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="ns-nav-inner">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
            <span className="text-2xl font-bold serif text-[#0F172A]">NyayaSetu</span>
          </Link>
          <div className="ns-nav-links justify-end">
            <Link href="/advocates" className="text-slate-600 hover:text-[#0F172A] font-medium text-sm transition-colors">Find Advocates</Link>
            <Link href="/feed" className="text-slate-600 hover:text-[#0F172A] font-medium text-sm transition-colors">Justice Feed</Link>
            <Link href="/ai-learning" className="hidden text-slate-600 hover:text-[#0F172A] font-medium text-sm transition-colors sm:inline">AI Law Learning</Link>
            <AccountMenu user={user} logout={logout} />
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        className="relative min-h-[92vh] flex items-center overflow-hidden"
        style={{
          backgroundColor: '#0F172A',
          backgroundImage: 'url(/land_img.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
        }}
      >
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.85) 50%, rgba(15,23,42,0.4) 100%)',
            zIndex: 1,
          }}
        />

        <div className="ns-band w-full py-24 md:py-32" style={{ position: 'relative', zIndex: 2 }}>
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl space-y-8">

              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-white/90 text-sm font-medium">India's Verified Legal Platform</span>
              </div>

              {/* Headline */}
              <h1 className="ns-hero-title text-white leading-[1.1]" data-testid="hero-title">
                Your Bridge<br />
                <span className="text-[#B45309]">to Justice</span>
              </h1>

              {/* Subheading */}
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-xl">
                Connect with verified advocates across India. Understand your legal rights. Get expert consultation — free and accessible to everyone.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/advocates">
                  <Button data-testid="find-advocate-btn" className="bg-[#B45309] text-white hover:bg-[#B45309]/90 h-14 px-10 rounded-sm font-bold text-base shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
                    Find an Advocate <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/ai-learning">
                  <Button data-testid="learn-law-btn" variant="outline" className="bg-transparent border-2 border-white/60 text-white hover:bg-white hover:text-[#0F172A] h-14 px-10 rounded-sm font-bold text-base transition-all hover:-translate-y-1">
                    Learn Law with AI
                  </Button>
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex flex-wrap gap-8 pt-4 border-t border-white/10">
                {[
                  { value: '2,000+', label: 'Verified Advocates' },
                  { value: '15+', label: 'States Covered' },
                  { value: '100%', label: 'Free to Use' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50" style={{ zIndex: 2 }}>
          <div className="w-px h-12 bg-white/40" />
          <span className="text-white/60 text-xs tracking-widest uppercase">Scroll</span>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="ns-band max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#B45309] text-sm font-bold uppercase tracking-widest">Simple Process</span>
            <h2 className="ns-heading-xl mt-3">Get Legal Help in 3 Steps</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px bg-[#B45309]/30 -z-0" />

            {[
              { step: '01', icon: FileText, title: 'Create Your Account', desc: 'Register in minutes as a citizen or advocate. Email verification keeps the platform safe and trusted.' },
              { step: '02', icon: Search, title: 'Find Your Advocate', desc: 'Search by specialization, location, and language. Every advocate is verified by our admin team.' },
              { step: '03', icon: MessageCircle, title: 'Get Expert Help', desc: 'Book a consultation, send a message, and get the legal guidance you need — all in one place.' },
            ].map((item) => (
              <div key={item.step} className="relative bg-white border border-slate-200 rounded-sm p-8 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
                <div className="flex items-start gap-4 mb-6">
                  <span className="text-5xl font-black text-slate-100 leading-none group-hover:text-[#B45309]/20 transition-colors">{item.step}</span>
                  <div className="bg-[#B45309]/10 p-3 rounded-sm">
                    <item.icon className="h-6 w-6 text-[#B45309]" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold serif text-[#0F172A] mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY NYAYASETU ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="ns-band max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#B45309] text-sm font-bold uppercase tracking-widest">Why Us</span>
            <h2 className="ns-heading-xl mt-3">Built for Every Indian</h2>
            <p className="text-slate-600 mt-4 max-w-xl mx-auto leading-relaxed">
              Whether you're from Mumbai or a small town in Bihar — NyayaSetu is designed so anyone can navigate their legal rights with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Verified Advocates',
                desc: 'Two-step verification with admin approval and Bar Council registration validation. Every advocate is real and qualified.',
                tag: 'Trust & Safety'
              },
              {
                icon: BookOpen,
                title: 'AI Law Learning',
                desc: 'Ask legal questions in plain Hindi or English. Our AI explains your rights, procedures, and options in simple language.',
                tag: 'Powered by AI'
              },
              {
                icon: Users,
                title: 'Direct Connection',
                desc: 'Book appointments and message advocates directly. No middlemen, no hidden fees, no barriers.',
                tag: 'Easy Access'
              },
            ].map((feat) => (
              <div key={feat.title} className="group relative bg-slate-50 hover:bg-white border border-slate-100 hover:border-[#B45309]/30 hover:shadow-lg p-8 transition-all duration-300" data-testid={`feature-${feat.title.toLowerCase().replace(' ', '-')}`}>
                <div className="absolute top-0 left-0 w-1 h-0 bg-[#B45309] group-hover:h-full transition-all duration-300" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B45309] bg-[#B45309]/10 px-2 py-1 rounded-full">{feat.tag}</span>
                <feat.icon className="h-10 w-10 text-[#0F172A] mt-6 mb-4" strokeWidth={1.5} />
                <h3 className="text-2xl font-semibold serif text-[#0F172A] mb-3">{feat.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ── */}
      <section className="bg-[#0F172A] py-16">
        <div className="ns-band max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '2,000+', label: 'Verified Advocates' },
              { value: '15+', label: 'States Covered' },
              { value: '50+', label: 'Legal Specializations' },
              { value: '10,000+', label: 'Citizens Helped' },
            ].map((stat) => (
              <div key={stat.label} className="space-y-2">
                <p className="text-4xl font-black text-[#B45309]">{stat.value}</p>
                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JUSTICE FEED PREVIEW ── */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="ns-band max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <span className="text-[#B45309] text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Newspaper className="h-4 w-4" /> Live Community
              </span>
              <h2 className="ns-heading-xl mt-3">From the Justice Feed</h2>
              <p className="text-slate-600 mt-3 max-w-lg leading-relaxed">
                Advocates share legal awareness. Citizens ask questions. Everyone learns together.
              </p>
            </div>
            <Link href="/feed" className="hidden md:block shrink-0">
              <Button className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-12 px-8 rounded-sm font-medium">
                View All Posts <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                badge: 'Verified Advocate',
                badgeIcon: BadgeCheck,
                badgeColor: 'text-emerald-700 bg-emerald-50',
                author: 'Adv. Meera Joshi',
                location: 'Pune, Maharashtra',
                time: '2 hours ago',
                title: 'Tenant Rights: Deposit Recovery',
                content: 'Collect agreement copies, rent receipts, chats, and handover proof before sending a formal notice or consulting an advocate.',
                reactions: 28,
              },
              {
                badge: 'Legal Awareness',
                badgeIcon: BookOpen,
                badgeColor: 'text-[#B45309] bg-amber-50',
                author: 'Adv. Rajan Kapoor',
                location: 'Delhi',
                time: '5 hours ago',
                title: 'Consumer Complaint Checklist',
                content: 'Keep invoices, screenshots, delivery details, and complaint ticket IDs to make a stronger consumer grievance.',
                reactions: 41,
              },
              {
                badge: 'Help Request',
                badgeIcon: MessageCircle,
                badgeColor: 'text-[#0F766E] bg-teal-50',
                author: 'Anonymous Citizen',
                location: 'Nashik, Maharashtra',
                time: '1 day ago',
                title: 'Need Property Guidance',
                content: 'Ask general questions publicly, but keep personal names, case numbers, and documents private for your consultation.',
                reactions: 15,
              },
            ].map((post) => (
              <div key={post.title} className="bg-white border border-slate-200 rounded-sm shadow-sm hover:shadow-md transition-all hover:-translate-y-1 overflow-hidden group">
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${post.badgeColor}`}>
                      <post.badgeIcon className="h-3.5 w-3.5" />
                      {post.badge}
                    </span>
                    <span className="text-xs text-slate-400">{post.time}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold serif text-[#0F172A] mb-2 group-hover:text-[#B45309] transition-colors">{post.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">{post.content}</p>
                  </div>
                </div>
                <div className="border-t border-slate-100 px-6 py-3 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#0F172A] flex items-center justify-center text-white text-xs font-bold">
                      {post.author[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#0F172A]">{post.author}</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1"><MapPin className="h-2.5 w-2.5" />{post.location}</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {post.reactions}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/feed">
              <Button className="bg-[#0F172A] text-white h-12 px-8 rounded-sm font-medium">View All Posts</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── DUAL CTA ── */}
      <section className="py-20 md:py-28 bg-white">
        <div className="ns-band max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="ns-heading-xl">Justice for Everyone</h2>
            <p className="text-slate-600 mt-4 max-w-lg mx-auto">Whether you need legal help or want to offer it — NyayaSetu is your platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Citizen CTA */}
            <div className="relative bg-[#0F172A] rounded-sm p-10 overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 opacity-5">
                <Scale className="h-48 w-48" />
              </div>
              <span className="text-[#B45309] text-xs font-bold uppercase tracking-widest">For Citizens</span>
              <h3 className="text-3xl font-bold serif text-white mt-3 mb-4">Need Legal Help?</h3>
              <p className="text-slate-400 leading-relaxed mb-8 text-sm">
                Find a verified advocate near you, understand your rights through AI, and get the legal guidance you deserve — completely free.
              </p>
              <Link href="/auth">
                <Button className="bg-[#B45309] text-white hover:bg-[#B45309]/90 h-12 px-8 rounded-sm font-bold transition-all hover:-translate-y-0.5">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Advocate CTA */}
            <div className="relative bg-slate-50 border-2 border-slate-200 rounded-sm p-10 overflow-hidden group hover:border-[#B45309]/40 transition-colors">
              <div className="absolute -right-10 -bottom-10 opacity-5">
                <Users className="h-48 w-48 text-[#0F172A]" />
              </div>
              <span className="text-[#0F172A] text-xs font-bold uppercase tracking-widest">For Advocates</span>
              <h3 className="text-3xl font-bold serif text-[#0F172A] mt-3 mb-4">Grow Your Practice</h3>
              <p className="text-slate-600 leading-relaxed mb-8 text-sm">
                Join thousands of verified advocates. Build your digital presence, reach clients nationwide, and grow your legal practice on NyayaSetu.
              </p>
              <Link href="/auth">
                <Button className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-12 px-8 rounded-sm font-bold transition-all hover:-translate-y-0.5">
                  Join as Advocate <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0F172A] text-white">
        <div className="ns-band py-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

            {/* Brand */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <Scale className="h-7 w-7" strokeWidth={1.5} />
                <span className="text-xl font-bold serif">NyayaSetu</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-sm max-w-xs">
                Bridging the gap between citizens and justice across India. Free, verified, and accessible to all.
              </p>
              <div className="flex items-center gap-2 text-emerald-400 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>Verified Legal Platform</span>
              </div>
            </div>

            {/* Platform links */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Platform</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Find Advocates', href: '/advocates' },
                  { label: 'Justice Feed', href: '/feed' },
                  { label: 'AI Law Learning', href: '/ai-learning' },
                  { label: 'Get Started', href: '/auth' },
                ].map(link => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms of Service', href: '/terms' },
                  { label: 'Contact Us', href: '/contact' },
                ].map(item => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-slate-400 text-sm hover:text-white transition-colors">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">© 2026 NyayaSetu. All rights reserved. Bridging the gap to justice.</p>
            <p className="text-slate-600 text-xs">Built with ❤️ for India</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;

import Link from 'next/link';
import { Scale, ArrowLeft, Shield, Eye, Lock, Database, Bell, UserCheck } from 'lucide-react';

const sections = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: [
      'Account information — name, email address, phone number, and role (client or advocate) provided during registration.',
      'Advocate professional details — Bar Council number, specializations, experience, and location submitted for verification.',
      'Usage data — pages visited, features used, and interaction patterns to improve the platform.',
      'Messages and consultation data — content exchanged between clients and advocates on the platform.',
      'Device and browser information — IP address, browser type, and operating system for security purposes.',
    ]
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: [
      'To provide and operate NyayaSetu — matching clients with advocates, facilitating consultations, and managing your account.',
      'To verify advocates — cross-referencing Bar Council details for platform integrity.',
      'To communicate with you — sending account notifications, verification updates, and platform announcements.',
      'To improve the platform — analyzing usage patterns to enhance features and user experience.',
      'To ensure safety — detecting and preventing fraud, abuse, and violations of our terms.',
    ]
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: [
      'All data is stored on Supabase infrastructure with industry-standard encryption at rest and in transit.',
      'Passwords are hashed and never stored in plain text.',
      'Access to user data is restricted to authorized personnel only.',
      'We conduct regular security reviews of our platform and infrastructure.',
      'While we take strong precautions, no system is 100% secure. We encourage you to use strong, unique passwords.',
    ]
  },
  {
    icon: UserCheck,
    title: 'Data Sharing',
    content: [
      'We do not sell your personal data to third parties under any circumstances.',
      'Advocate profiles — name, specializations, location, and Bar Council number — are publicly visible in the advocate directory.',
      'Client information is only shared with advocates when a consultation is booked.',
      'We may share data with service providers (Supabase, Vercel) strictly to operate the platform.',
      'We may disclose information if required by Indian law or court order.',
    ]
  },
  {
    icon: Bell,
    title: 'Your Rights',
    content: [
      'Access — you can view all personal data we hold about you from your Profile page.',
      'Correction — you can update your name, phone, city, and other profile details at any time.',
      'Deletion — you can request deletion of your account and associated data by contacting us.',
      'Portability — you can request an export of your data in a machine-readable format.',
      'Objection — you can object to certain uses of your data by contacting our team.',
    ]
  },
  {
    icon: Shield,
    title: 'Cookies & Tracking',
    content: [
      'We use essential cookies only — for authentication sessions and security.',
      'We do not use advertising cookies or third-party tracking scripts.',
      'You can disable cookies in your browser settings, but this may affect platform functionality.',
    ]
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-7 w-7 text-[#0F172A]" strokeWidth={1.5} />
            <span className="text-xl font-bold serif text-[#0F172A]">NyayaSetu</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#0F172A] transition-colors font-medium">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </nav>

      <div
        className="w-full px-6 py-16 md:py-20"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}
      >
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span className="text-white/90 text-sm font-medium">Your Privacy Matters</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold serif text-white">Privacy Policy</h1>
          <p className="text-slate-400 max-w-xl leading-relaxed">
            NyayaSetu is committed to protecting your personal information. This policy explains what we collect, how we use it, and your rights as a user.
          </p>
          <p className="text-slate-500 text-sm">Last updated: May 2026 · Applies to all NyayaSetu users in India</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <div className="bg-white border border-slate-200 rounded-sm p-8 shadow-sm">
          <p className="text-slate-600 leading-relaxed text-base">
            NyayaSetu is a legal-tech platform connecting citizens with verified advocates across India. By using NyayaSetu, you agree to the collection and use of information as described in this policy. This policy applies to all users — clients, advocates, and administrators.
          </p>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 flex items-center gap-3" style={{ background: 'linear-gradient(to right, #F8FAFC, #fff)' }}>
              <div className="bg-[#B45309]/10 p-2 rounded-sm">
                <section.icon className="h-5 w-5 text-[#B45309]" />
              </div>
              <h2 className="text-xl font-bold serif text-[#0F172A]">{section.title}</h2>
            </div>
            <div className="px-8 py-6">
              <ul className="space-y-3">
                {section.content.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#B45309] shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        <div className="bg-[#0F172A] rounded-sm p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold serif text-white">Questions about your privacy?</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            If you have any questions about this Privacy Policy or how we handle your data, please reach out to us.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-[#B45309] text-white px-6 py-3 rounded-sm font-bold text-sm hover:bg-[#B45309]/90 transition-colors">
            Contact Us
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-200 py-8 text-center text-xs text-slate-400 space-x-4">
        <Link href="/terms" className="hover:text-[#0F172A] transition-colors">Terms of Service</Link>
        <span>·</span>
        <Link href="/privacy" className="hover:text-[#0F172A] transition-colors font-semibold text-slate-600">Privacy Policy</Link>
        <span>·</span>
        <Link href="/contact" className="hover:text-[#0F172A] transition-colors">Contact Us</Link>
      </div>
    </div>
  );
}

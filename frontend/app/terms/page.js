import Link from 'next/link';
import { Scale, ArrowLeft, FileText, Users, ShieldAlert, AlertTriangle, CheckCircle2, Gavel } from 'lucide-react';

const sections = [
  {
    icon: Users,
    title: 'Eligibility & Registration',
    content: [
      'NyayaSetu is available to individuals aged 18 and above residing in India.',
      'You must provide accurate and truthful information during registration.',
      'Each person may maintain only one account. Duplicate accounts may be removed.',
      'Advocates must hold a valid Bar Council registration to register as a legal professional on the platform.',
      'NyayaSetu reserves the right to suspend or terminate accounts that provide false information.',
    ]
  },
  {
    icon: CheckCircle2,
    title: 'Platform Usage',
    content: [
      'NyayaSetu provides a platform to connect citizens with advocates. We are not a law firm and do not provide legal advice directly.',
      'Consultations booked through NyayaSetu are between the client and the advocate. NyayaSetu is not a party to that relationship.',
      'You are responsible for the accuracy and completeness of information you provide in consultations and messages.',
      'You may not use the platform to harass, threaten, or intimidate other users.',
      'You may not use the platform for any unlawful purpose or in violation of any applicable Indian law.',
    ]
  },
  {
    icon: ShieldAlert,
    title: 'Advocate Verification',
    content: [
      'All advocate profiles undergo admin review before receiving verified status on NyayaSetu.',
      'Verification is based on information provided by the advocate. NyayaSetu does not guarantee the accuracy of advocate credentials.',
      'A "Verified" badge indicates that our admin team reviewed the submitted details — it does not constitute a professional endorsement.',
      'Advocates found to have provided false credentials will be permanently removed from the platform.',
      'NyayaSetu is not liable for any outcomes arising from consultations with advocates on the platform.',
    ]
  },
  {
    icon: AlertTriangle,
    title: 'Prohibited Conduct',
    content: [
      'Posting content that is defamatory, obscene, hateful, or incites violence.',
      'Impersonating any person, advocate, or legal entity.',
      'Sharing another user\'s private information without consent.',
      'Attempting to gain unauthorized access to accounts or platform infrastructure.',
      'Using automated tools, bots, or scrapers to extract data from the platform.',
      'Soliciting fees or payments outside the platform in ways that violate applicable law.',
    ]
  },
  {
    icon: FileText,
    title: 'Content & Intellectual Property',
    content: [
      'Content you post on JusticeFeed remains your intellectual property. By posting, you grant NyayaSetu a license to display it on the platform.',
      'NyayaSetu\'s logo, name, design, and software are owned by NyayaSetu and may not be used without permission.',
      'Reported content that violates these terms may be hidden or removed by our moderation team.',
      'We respect intellectual property rights. If you believe content infringes your rights, please contact us.',
    ]
  },
  {
    icon: Gavel,
    title: 'Limitation of Liability',
    content: [
      'NyayaSetu provides the platform "as is" without warranties of any kind.',
      'We are not liable for outcomes of legal consultations conducted through the platform.',
      'We are not responsible for any loss or damage arising from your use of the platform.',
      'Our maximum liability to you in any circumstance shall not exceed INR 1,000.',
      'These terms are governed by the laws of India. Disputes shall be subject to the jurisdiction of courts in Nashik, Maharashtra.',
    ]
  },
];

export default function TermsOfService() {
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
            <FileText className="h-4 w-4 text-[#B45309]" />
            <span className="text-white/90 text-sm font-medium">Platform Rules & Agreement</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold serif text-white">Terms of Service</h1>
          <p className="text-slate-400 max-w-xl leading-relaxed">
            By using NyayaSetu, you agree to these terms. Please read them carefully before using the platform.
          </p>
          <p className="text-slate-500 text-sm">Last updated: May 2026 · Governed by the laws of India</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <div className="bg-amber-50 border border-amber-200 rounded-sm p-6 flex gap-4">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-900 text-sm mb-1">Important Disclaimer</p>
            <p className="text-amber-800 text-sm leading-relaxed">
              NyayaSetu is a technology platform, not a law firm. We do not provide legal advice. Information on this platform is for general awareness only. For legal advice specific to your situation, always consult a qualified advocate.
            </p>
          </div>
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
          <h3 className="text-2xl font-bold serif text-white">Have questions about these terms?</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            We're happy to clarify anything. Reach out and our team will respond within 2 business days.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-[#B45309] text-white px-6 py-3 rounded-sm font-bold text-sm hover:bg-[#B45309]/90 transition-colors">
            Contact Us
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-200 py-8 text-center text-xs text-slate-400 space-x-4">
        <Link href="/terms" className="hover:text-[#0F172A] transition-colors font-semibold text-slate-600">Terms of Service</Link>
        <span>·</span>
        <Link href="/privacy" className="hover:text-[#0F172A] transition-colors">Privacy Policy</Link>
        <span>·</span>
        <Link href="/contact" className="hover:text-[#0F172A] transition-colors">Contact Us</Link>
      </div>
    </div>
  );
}

"use client";

import { useState } from 'react';
import Link from 'next/link';
import AnimatedLogo from '@/components/AnimatedLogo';
import { Scale, ArrowLeft, Mail, MapPin, Clock, Send, MessageSquare, Shield, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const topics = [
  'General Inquiry',
  'Account Issue',
  'Advocate Verification',
  'Report a User',
  'Privacy Concern',
  'Technical Support',
  'Partnership',
  'Other',
];

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.topic || !form.message) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
    toast.success('Message sent! We will respond within 2 business days.');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <AnimatedLogo size={28} />
          </Link>
          <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#0F172A] transition-colors font-medium">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div
        className="w-full px-6 py-16 md:py-20"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}
      >
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2">
            <MessageSquare className="h-4 w-4 text-[#B45309]" />
            <span className="text-white/90 text-sm font-medium">We're here to help</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold serif text-white">Contact Us</h1>
          <p className="text-slate-400 max-w-xl leading-relaxed">
            Have a question, concern, or feedback? We respond to every message within 2 business days.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left — info cards */}
          <div className="lg:col-span-4 space-y-5">
            {[
              {
                icon: Mail,
                title: 'Email Us',
                desc: 'For general inquiries and support',
                value: 'support@nyayasetu.in',
                color: 'text-[#B45309] bg-[#B45309]/10',
              },
              {
                icon: MapPin,
                title: 'Based In',
                desc: 'Our team is located in',
                value: 'Nashik, Maharashtra, India',
                color: 'text-emerald-600 bg-emerald-50',
              },
              {
                icon: Clock,
                title: 'Response Time',
                desc: 'We aim to reply within',
                value: '2 business days',
                color: 'text-blue-600 bg-blue-50',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm flex items-start gap-4">
                <div className={`p-2.5 rounded-sm ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-[#0F172A] text-sm">{item.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">{item.value}</p>
                </div>
              </div>
            ))}

            {/* Quick links */}
            <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-sm space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Quick Links</p>
              <Link href="/privacy" className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-sm transition-colors group">
                <Shield className="h-4 w-4 text-slate-400 group-hover:text-[#B45309]" />
                <span className="text-sm font-medium text-slate-600 group-hover:text-[#0F172A]">Privacy Policy</span>
              </Link>
              <Link href="/terms" className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-sm transition-colors group">
                <FileText className="h-4 w-4 text-slate-400 group-hover:text-[#B45309]" />
                <span className="text-sm font-medium text-slate-600 group-hover:text-[#0F172A]">Terms of Service</span>
              </Link>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
              <div
                className="px-8 py-6 border-b border-slate-100"
                style={{ background: 'linear-gradient(to right, #F8FAFC, #fff)' }}
              >
                <h2 className="text-2xl font-bold serif text-[#0F172A]">Send a Message</h2>
                <p className="text-slate-500 text-sm mt-1">Fill in the form and we'll get back to you shortly.</p>
              </div>

              {submitted ? (
                <div className="px-8 py-16 text-center space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-full p-4 inline-block">
                    <Send className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold serif text-[#0F172A]">Message Sent!</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    Thank you for reaching out. Our team will respond to <span className="font-semibold text-[#0F172A]">{form.email}</span> within 2 business days.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', topic: '', message: '' }); }}
                    className="text-sm text-[#B45309] font-semibold hover:underline mt-2"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Your full name"
                        required
                        className="h-11 bg-slate-50 border-slate-200 focus:border-[#0F172A] focus:bg-white rounded-sm transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                        required
                        className="h-11 bg-slate-50 border-slate-200 focus:border-[#0F172A] focus:bg-white rounded-sm transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="topic" className="text-xs font-bold uppercase tracking-wider text-slate-500">Topic</Label>
                    <select
                      id="topic"
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      required
                      className="w-full h-11 bg-slate-50 border border-slate-200 rounded-sm px-3 text-sm text-slate-700 focus:outline-none focus:border-[#0F172A] focus:bg-white transition-colors"
                    >
                      <option value="">Select a topic</option>
                      {topics.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-slate-500">Message</Label>
                    <Textarea
                      id="message"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Describe your question or concern in detail..."
                      required
                      rows={5}
                      className="bg-slate-50 border-slate-200 focus:border-[#0F172A] focus:bg-white rounded-sm transition-colors resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-12 rounded-sm font-bold shadow-lg transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    {loading ? 'Sending...' : (
                      <>
                        Send Message <Send className="h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-slate-400 text-center">
                    By submitting this form you agree to our{' '}
                    <Link href="/privacy" className="text-[#B45309] hover:underline">Privacy Policy</Link>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 py-8 text-center text-xs text-slate-400 space-x-4">
        <Link href="/terms" className="hover:text-[#0F172A] transition-colors">Terms of Service</Link>
        <span>·</span>
        <Link href="/privacy" className="hover:text-[#0F172A] transition-colors">Privacy Policy</Link>
        <span>·</span>
        <Link href="/contact" className="hover:text-[#0F172A] transition-colors font-semibold text-slate-600">Contact Us</Link>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Scale, MapPin, Briefcase, CheckCircle2, Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
import AccountMenu from '@/components/AccountMenu';
import { useAdvocates } from '@/hooks/useAdvocates';

const SkeletonCard = () => (
  <div className="bg-white border border-slate-100 rounded-sm p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="space-y-2">
        <div className="h-5 w-36 bg-slate-200 rounded" />
        <div className="h-3 w-24 bg-slate-100 rounded" />
      </div>
      <div className="h-5 w-16 bg-slate-100 rounded" />
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 w-32 bg-slate-100 rounded" />
      <div className="h-3 w-28 bg-slate-100 rounded" />
    </div>
    <div className="flex gap-2">
      <div className="h-6 w-20 bg-slate-100 rounded" />
      <div className="h-6 w-24 bg-slate-100 rounded" />
    </div>
  </div>
);

const AdvocateDirectory = ({ user, logout }) => {
  const { advocates, loading, specialization, setSpecialization, location, setLocation, handleFilter } = useAdvocates();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="ns-nav sticky top-0 z-50 bg-white/95 backdrop-blur-sm">
        <div className="ns-nav-inner">
          <Link href="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
            <span className="text-2xl font-bold serif text-[#0F172A]">NyayaSetu</span>
          </Link>
          <div className="ns-nav-links">
            <Link href="/ai-learning" className="text-slate-600 hover:text-[#0F172A] font-medium text-sm transition-colors">AI Law Learning</Link>
            <AccountMenu user={user} logout={logout} />
          </div>
        </div>
      </nav>

      {/* Page Hero */}
      <div
        className="w-full px-4 sm:px-6 md:px-12 lg:px-24 py-12 md:py-16"
        style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' }}
      >
        <div className="max-w-7xl mx-auto space-y-3">
          <p className="text-[#B45309] text-xs font-bold uppercase tracking-widest">Advocate Directory</p>
          <h1 className="text-3xl md:text-4xl font-bold serif text-white" data-testid="directory-title">
            Find Verified Advocates
          </h1>
          <p className="text-slate-400 text-sm max-w-lg">
            Every advocate on NyayaSetu is verified by our admin team. Search by specialization or location to find the right legal expert for your needs.
          </p>

          {/* Filter bar inside hero */}
          <div className="pt-4">
            <div
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-sm p-4"
              data-testid="filter-section"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Specialization</label>
                  <Select value={specialization} onValueChange={setSpecialization}>
                    <SelectTrigger data-testid="specialization-select" className="h-11 bg-white/10 border-white/20 text-white rounded-sm">
                      <SelectValue placeholder="All Specializations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specializations</SelectItem>
                      <SelectItem value="Civil Litigation">Civil Litigation</SelectItem>
                      <SelectItem value="Criminal Law">Criminal Law</SelectItem>
                      <SelectItem value="Family Law">Family Law</SelectItem>
                      <SelectItem value="Corporate Law">Corporate Law</SelectItem>
                      <SelectItem value="Property Law">Property Law</SelectItem>
                      <SelectItem value="Tax Law">Tax Law</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      data-testid="location-input"
                      placeholder="City or state"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                      className="h-11 bg-white/10 border-white/20 text-white placeholder:text-slate-400 rounded-sm pl-9"
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleFilter}
                    data-testid="filter-btn"
                    className="w-full bg-[#B45309] text-white hover:bg-[#B45309]/90 h-11 rounded-sm font-bold flex items-center gap-2"
                  >
                    <Search className="h-4 w-4" /> Search Advocates
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="ns-page">
        <div className="max-w-7xl mx-auto">

          {/* Results header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-slate-500 font-medium">
              {loading ? 'Searching...' : `${advocates.length} verified advocate${advocates.length !== 1 ? 's' : ''} found`}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Sorted by verification
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : advocates.length === 0 ? (
            <div className="text-center py-20 space-y-4" data-testid="no-advocates">
              <div className="bg-white border border-dashed border-slate-300 rounded-sm p-16 inline-block">
                <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">No verified advocates found.</p>
                <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search a different location.</p>
                <Button onClick={() => { setSpecialization('all'); setLocation(''); }} variant="outline" className="mt-4 rounded-sm border-[#B45309] text-[#B45309]">
                  Clear Filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="advocates-grid">
              {advocates.map((advocate) =>
                advocate.id && (
                  <Link key={advocate.id} href={`/advocates/${advocate.id}`}>
                    <div
                      className="bg-white border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group rounded-sm"
                      data-testid={`advocate-card-${advocate.id}`}
                    >
                      {/* Card top accent */}
                      <div className="h-1 w-full bg-gradient-to-r from-[#0F172A] to-[#B45309] opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            {/* Avatar initial */}
                            <div className="w-10 h-10 rounded-full bg-[#0F172A] flex items-center justify-center text-white font-black text-sm shrink-0">
                              {advocate.name?.[0] || 'A'}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold serif text-[#0F172A] group-hover:text-[#B45309] transition-colors">{advocate.name}</h3>
                              <p className="text-xs text-slate-400 font-mono">{advocate.bar_council_number}</p>
                            </div>
                          </div>
                          <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 rounded-full shrink-0" data-testid="verified-badge">
                            <CheckCircle2 className="h-3 w-3" /> Verified
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Briefcase className="h-3.5 w-3.5 text-[#B45309]" strokeWidth={1.5} />
                            <span>{advocate.experience_years} years experience</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin className="h-3.5 w-3.5 text-[#B45309]" strokeWidth={1.5} />
                            <span>{advocate.location}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {advocate.specializations.slice(0, 3).map((spec, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-600 px-2.5 py-1 text-[11px] font-semibold rounded-full">{spec}</span>
                          ))}
                          {advocate.specializations.length > 3 && (
                            <span className="bg-[#B45309]/10 text-[#B45309] px-2.5 py-1 text-[11px] font-semibold rounded-full">+{advocate.specializations.length - 3} more</span>
                          )}
                        </div>
                      </div>

                      <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-medium">View full profile</span>
                        <ArrowRight className="h-4 w-4 text-[#B45309] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvocateDirectory;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Scale, MapPin, Briefcase, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const AdvocateDirectory = ({ user, logout }) => {
    const [advocates, setAdvocates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [specialization, setSpecialization] = useState('all');
    const [location, setLocation] = useState('');

    useEffect(() => {
        fetchAdvocates();
    }, []);

    const fetchAdvocates = async () => {
        try {
            let query = supabase
                .from('advocates')
                .select('*, profiles!inner(name)')
                .eq('verification_status', 'verified');
                
            if (specialization && specialization !== 'all') {
                query = query.contains('specializations', [specialization]);
            }
            if (location) {
                query = query.ilike('location', `%${location}%`);
            }

            const { data, error } = await query;
            if (error) throw error;
            
            const formatted = data.map(adv => ({
                ...adv,
                name: adv.profiles.name
            }));
            
            setAdvocates(formatted);
        } catch (error) {
            toast.error('Failed to load advocates');
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = () => {
        setLoading(true);
        fetchAdvocates();
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <nav className="bg-white border-b border-slate-200 px-6 md:px-12 lg:px-24 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
                        <span className="text-2xl font-bold serif text-[#0F172A]">NyayaSetu</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link to="/ai-learning" className="text-slate-700 hover:text-[#0F172A] font-medium">
                            AI Law Learning
                        </Link>
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to={user.role === 'admin' ? '/admin' : user.role === 'advocate' ? '/advocate/dashboard' : '/client/dashboard'}>
                                    <Button data-testid="dashboard-nav-btn" className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-10 px-6 rounded-sm font-medium">
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button data-testid="logout-nav-btn" onClick={logout} variant="ghost" className="text-slate-700">
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <Link to="/auth">
                                <Button data-testid="login-nav-btn" className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-10 px-6 rounded-sm font-medium">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            <div className="px-6 md:px-12 lg:px-24 py-12">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight serif text-[#0F172A] mb-8" data-testid="directory-title">
                        Find Verified Advocates
                    </h1>

                    <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-6 mb-8" data-testid="filter-section">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-2 block">Specialization</label>
                                <Select value={specialization} onValueChange={setSpecialization}>
                                    <SelectTrigger data-testid="specialization-select" className="h-12 bg-white border-slate-200 rounded-sm">
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
                            <div>
                                <label className="text-sm font-medium text-slate-700 mb-2 block">Location</label>
                                <Input
                                    data-testid="location-input"
                                    placeholder="Enter city or state"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="h-12 bg-white border-slate-200 rounded-sm"
                                />
                            </div>
                            <div className="flex items-end">
                                <Button
                                    onClick={handleFilter}
                                    data-testid="filter-btn"
                                    className="w-full bg-[#B45309] text-white hover:bg-[#B45309]/90 h-12 rounded-sm font-medium"
                                >
                                    Apply Filters
                                </Button>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">Loading advocates...</div>
                    ) : advocates.length === 0 ? (
                        <div className="text-center py-12 text-slate-600" data-testid="no-advocates">
                            No verified advocates found. Try adjusting your filters.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="advocates-grid">
                            {advocates.map((advocate) => (
                                <Link key={advocate.id} to={`/advocates/${advocate.id}`}>
                                    <div className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all p-0 overflow-hidden group rounded-sm" data-testid={`advocate-card-${advocate.id}`}>
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-xl font-semibold serif text-[#0F172A] mb-1">
                                                        {advocate.name}
                                                    </h3>
                                                    <p className="text-sm text-slate-600 mono">
                                                        {advocate.bar_council_number}
                                                    </p>
                                                </div>
                                                <div className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1 rounded-sm" data-testid="verified-badge">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Verified
                                                </div>
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                                    <Briefcase className="h-4 w-4 text-[#B45309]" strokeWidth={1.5} />
                                                    <span>{advocate.experience_years} years experience</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                                    <MapPin className="h-4 w-4 text-[#B45309]" strokeWidth={1.5} />
                                                    <span>{advocate.location}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                {advocate.specializations.slice(0, 3).map((spec, idx) => (
                                                    <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1 text-xs font-medium rounded-sm">
                                                        {spec}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100">
                                            <span className="text-sm font-medium text-[#B45309] group-hover:underline">
                                                View Profile →
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdvocateDirectory;



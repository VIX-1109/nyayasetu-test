import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Scale, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = ({ user, logout }) => {
  const [pendingAdvocates, setPendingAdvocates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingAdvocates();
  }, []);

  const fetchPendingAdvocates = async () => {
    try {
      const { data, error } = await supabase
        .from('advocates')
        .select('*, profiles!inner(name)')
        .eq('verification_status', 'pending');
      if (error) throw error;
      
      const formatted = data.map(adv => ({
        ...adv,
        name: adv.profiles.name,
        email: adv.email || 'Email in Auth System'
      }));
      setPendingAdvocates(formatted);
    } catch (error) {
      toast.error('Failed to load pending advocates');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (advocateId, adminVerified, barVerified) => {
    try {
      const { error } = await supabase
        .from('advocates')
        .update({ admin_verified: adminVerified, bar_verified: barVerified })
        .eq('id', advocateId);
      if (error) throw error;
      
      toast.success('Verification updated successfully');
      fetchPendingAdvocates();
    } catch (error) {
      toast.error('Failed to update verification');
    }
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
            <span className="text-slate-700 font-medium">Admin Panel</span>
            <Button onClick={logout} variant="ghost" className="text-slate-700">
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="px-6 md:px-12 lg:px-24 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight serif text-[#0F172A] mb-2" data-testid="admin-dashboard-title">
              Admin Dashboard
            </h1>
            <p className="text-lg text-slate-600">Manage advocate verification</p>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-8">
            <h2 className="text-2xl font-semibold serif text-[#0F172A] mb-6">Pending Verifications</h2>
            {loading ? (
              <div className="text-center py-8">Loading advocates...</div>
            ) : pendingAdvocates.length === 0 ? (
              <div className="text-center py-8 text-slate-600" data-testid="no-pending-advocates">
                No pending verifications
              </div>
            ) : (
              <div className="space-y-6" data-testid="pending-advocates-list">
                {pendingAdvocates.map((advocate) => (
                  <div key={advocate.id} className="border border-slate-200 rounded-sm p-6" data-testid={`advocate-verification-${advocate.id}`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-xl font-semibold serif text-[#0F172A] mb-3">
                          {advocate.name}
                        </h3>
                        <div className="space-y-2 text-sm">
                          <p className="text-slate-700">
                            <span className="font-medium">Email:</span> {advocate.email}
                          </p>
                          <p className="text-slate-700">
                            <span className="font-medium">Bar Council Number:</span> <span className="mono">{advocate.bar_council_number}</span>
                          </p>
                          <p className="text-slate-700">
                            <span className="font-medium">Experience:</span> {advocate.experience_years} years
                          </p>
                          <p className="text-slate-700">
                            <span className="font-medium">Location:</span> {advocate.location}
                          </p>
                          <p className="text-slate-700">
                            <span className="font-medium">Phone:</span> {advocate.phone}
                          </p>
                          <div>
                            <span className="font-medium text-slate-700">Specializations:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {advocate.specializations.map((spec, idx) => (
                                <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-1 text-xs rounded-sm">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-slate-900 mb-3">Verification Status</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {advocate.admin_verified ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                              ) : (
                                <XCircle className="h-5 w-5 text-slate-400" />
                              )}
                              <span className="text-sm text-slate-700">Admin Verified</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {advocate.bar_verified ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                              ) : (
                                <XCircle className="h-5 w-5 text-slate-400" />
                              )}
                              <span className="text-sm text-slate-700">Bar Council Verified</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4">
                          <p className="text-sm font-medium text-slate-900 mb-3">Verify Advocate:</p>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleVerification(advocate.id, true, false)}
                              data-testid={`admin-verify-btn-${advocate.id}`}
                              className="bg-[#0F766E] text-white hover:bg-[#0F766E]/90 h-10 px-6 rounded-sm"
                            >
                              Admin Verify
                            </Button>
                            <Button
                              onClick={() => handleVerification(advocate.id, false, true)}
                              data-testid={`bar-verify-btn-${advocate.id}`}
                              className="bg-[#B45309] text-white hover:bg-[#B45309]/90 h-10 px-6 rounded-sm"
                            >
                              Bar Verify
                            </Button>
                            <Button
                              onClick={() => handleVerification(advocate.id, true, true)}
                              data-testid={`full-verify-btn-${advocate.id}`}
                              className="bg-[#0F172A] text-white hover:bg-[#0F172A]/90 h-10 px-6 rounded-sm"
                            >
                              Full Verify
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;



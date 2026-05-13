import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Scale, CheckCircle2, XCircle, Search, AlertTriangle, Edit } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = ({ user, logout }) => {
  const [pendingAdvocates, setPendingAdvocates] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Dialog state
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [warningMessage, setWarningMessage] = useState('');
  const [editData, setEditData] = useState({ name: '', role: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchPendingAdvocates(), fetchAllUsers()]);
    setLoading(false);
  };

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
    }
  };

  const fetchAllUsers = async () => {
    try {
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (profilesError) throw profilesError;

      const { data: advocatesData, error: advError } = await supabase
        .from('advocates')
        .select('*');
        
      if (advError) throw advError;

      const mergedUsers = profilesData.map(p => {
        const advData = advocatesData.find(a => a.id === p.id);
        return {
          ...p,
          advocate_details: advData || null
        };
      });

      setAllUsers(mergedUsers);
    } catch (error) {
      toast.error('Failed to load users');
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
      fetchData(); // Refresh lists
    } catch (error) {
      toast.error('Failed to update verification');
    }
  };

  const handleSendWarning = async (e) => {
    e.preventDefault();
    if (!warningMessage.trim()) return;
    
    try {
      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: selectedUser.id,
        content: `⚠️ ADMIN WARNING: ${warningMessage}`
      });
      
      if (error) throw error;
      
      toast.success('Warning sent successfully');
      setShowWarningDialog(false);
      setWarningMessage('');
    } catch (error) {
      toast.error('Failed to send warning');
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: editData.name, role: editData.role })
        .eq('id', selectedUser.id);
        
      if (error) throw error;
      
      toast.success('User profile updated successfully');
      setShowEditDialog(false);
      fetchAllUsers();
    } catch (error) {
      toast.error('Failed to update user profile');
    }
  };

  const openWarningDialog = (u) => {
    setSelectedUser(u);
    setWarningMessage('');
    setShowWarningDialog(true);
  };

  const openEditDialog = (u) => {
    setSelectedUser(u);
    setEditData({ name: u.name, role: u.role });
    setShowEditDialog(true);
  };

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="ns-nav">
        <div className="ns-nav-inner">
          <Link to="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-[#0F172A]" strokeWidth={1.5} />
            <span className="text-2xl font-bold serif text-[#0F172A]">NyayaSetu</span>
          </Link>
          <div className="ns-nav-links">
            <span className="text-slate-700 font-medium">Admin Panel</span>
            <Button onClick={logout} variant="ghost" className="text-slate-700">
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="ns-page">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="ns-heading-xl mb-2">
              Admin Dashboard
            </h1>
            <p className="text-lg text-slate-600">Manage platform users and verifications</p>
          </div>

          <Tabs defaultValue="verifications" className="w-full">
            <TabsList className="mb-8 grid w-full grid-cols-1 sm:grid-cols-2 sm:max-w-[400px] h-auto">
              <TabsTrigger value="verifications" className="rounded-sm">Pending Verifications</TabsTrigger>
              <TabsTrigger value="users" className="rounded-sm">User Management</TabsTrigger>
            </TabsList>

            <TabsContent value="verifications">
              <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-5 sm:p-8">
                <h2 className="text-2xl font-semibold serif text-[#0F172A] mb-6">Pending Verifications</h2>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : pendingAdvocates.length === 0 ? (
                  <div className="text-center py-8 text-slate-600">
                    No pending verifications
                  </div>
                ) : (
                  <div className="space-y-6">
                    {pendingAdvocates.map((advocate) => (
                      <div key={advocate.id} className="border border-slate-200 rounded-sm p-5 sm:p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-xl font-semibold serif text-[#0F172A] mb-3">
                              {advocate.name}
                            </h3>
                            <div className="space-y-2 text-sm">
                              <p className="text-slate-700"><span className="font-medium">Email:</span> {advocate.email}</p>
                              <p className="text-slate-700"><span className="font-medium">Bar Council:</span> {advocate.bar_council_number}</p>
                              <p className="text-slate-700"><span className="font-medium">Experience:</span> {advocate.experience_years} years</p>
                              <p className="text-slate-700"><span className="font-medium">Location:</span> {advocate.location}</p>
                              <p className="text-slate-700"><span className="font-medium">Phone:</span> {advocate.phone}</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-slate-900 mb-3">Verification Status</h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  {advocate.admin_verified ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-slate-400" />}
                                  <span className="text-sm text-slate-700">Admin Verified</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {advocate.bar_verified ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-slate-400" />}
                                  <span className="text-sm text-slate-700">Bar Council Verified</span>
                                </div>
                              </div>
                            </div>
                            <div className="pt-4">
                              <p className="text-sm font-medium text-slate-900 mb-3">Verify Advocate:</p>
                              <div className="flex flex-col sm:flex-row gap-2">
                                <Button
                                  onClick={() => handleVerification(advocate.id, true, false)}
                                  title="Marks the profile as checked by the platform admin for basic legitimacy and completeness."
                                  className="bg-[#0F766E] text-white hover:bg-[#0F766E]/90 h-10 px-6 rounded-sm"
                                >
                                  Admin Verify
                                </Button>
                                <Button
                                  onClick={() => handleVerification(advocate.id, false, true)}
                                  title="Marks the advocate's Bar Council Number as officially verified against state records."
                                  className="bg-[#B45309] text-white hover:bg-[#B45309]/90 h-10 px-6 rounded-sm"
                                >
                                  Bar Verify
                                </Button>
                                <Button
                                  onClick={() => handleVerification(advocate.id, true, true)}
                                  title="Shortcut to mark both Admin and Bar verification as complete simultaneously."
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
            </TabsContent>

            <TabsContent value="users">
              <div className="bg-white border border-slate-200 shadow-sm rounded-sm p-5 sm:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <h2 className="text-2xl font-semibold serif text-[#0F172A]">All Users</h2>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="Search users..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 w-full sm:w-[250px] bg-white rounded-sm border-slate-200"
                      />
                    </div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-full sm:w-[150px] bg-white rounded-sm border-slate-200">
                        <SelectValue placeholder="Filter by role" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="client">Clients</SelectItem>
                        <SelectItem value="advocate">Advocates</SelectItem>
                        <SelectItem value="admin">Admins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-sm text-slate-500">
                        <th className="pb-3 font-medium">Name</th>
                        <th className="pb-3 font-medium">Role</th>
                        <th className="pb-3 font-medium">Advocate Status</th>
                        <th className="pb-3 font-medium">Joined</th>
                        <th className="pb-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 font-medium text-slate-900">{u.name}</td>
                          <td className="py-4 capitalize text-slate-600">{u.role}</td>
                          <td className="py-4">
                            {u.role === 'advocate' && u.advocate_details ? (
                              <span className={`inline-flex items-center px-2 py-1 rounded-sm text-xs font-medium uppercase tracking-wider ${
                                u.advocate_details.verification_status === 'verified' 
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                  : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                              }`}>
                                {u.advocate_details.verification_status}
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="py-4 text-slate-500">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => openEditDialog(u)}
                                className="h-8 rounded-sm"
                              >
                                <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                              </Button>
                              {u.id !== user.id && (
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => openWarningDialog(u)}
                                  className="h-8 rounded-sm bg-red-600 hover:bg-red-700 text-white"
                                >
                                  <AlertTriangle className="h-3.5 w-3.5 mr-1" /> Warn
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.length === 0 && !loading && (
                        <tr>
                          <td colSpan="5" className="py-8 text-center text-slate-500">
                            No users found matching your filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Warning Dialog */}
      <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="serif text-2xl flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-6 w-6" />
              Send Warning
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSendWarning} className="space-y-4 pt-4">
            <p className="text-sm text-slate-600">
              Sending a warning message to <span className="font-bold text-slate-900">{selectedUser?.name}</span>. This will appear in their direct inbox.
            </p>
            <div>
              <Label htmlFor="warning-message">Warning Message</Label>
              <Textarea
                id="warning-message"
                value={warningMessage}
                onChange={(e) => setWarningMessage(e.target.value)}
                placeholder="Type your warning message here..."
                required
                rows={4}
                className="mt-2 rounded-sm border-slate-200"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowWarningDialog(false)} className="rounded-sm">
                Cancel
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white rounded-sm">
                Send Warning
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="serif text-2xl">Edit User Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditUser} className="space-y-4 pt-4">
            <div>
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                required
                className="mt-2 rounded-sm border-slate-200"
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Role</Label>
              <Select value={editData.role} onValueChange={(val) => setEditData({...editData, role: val})}>
                <SelectTrigger className="mt-2 rounded-sm border-slate-200 w-full">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="advocate">Advocate</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)} className="rounded-sm">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#0F172A] hover:bg-[#0F172A]/90 text-white rounded-sm">
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;

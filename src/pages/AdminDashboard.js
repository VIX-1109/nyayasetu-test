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
import { Scale, CheckCircle2, XCircle, Search, AlertTriangle, Edit, BarChart3, Users, Newspaper, ShieldAlert, MoreHorizontal, Trash2, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = ({ user, logout }) => {
  const [pendingAdvocates, setPendingAdvocates] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [posts, setPosts] = useState([]);
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
    await Promise.all([
      fetchPendingAdvocates(), 
      fetchAllUsers(),
      fetchReportedPosts()
    ]);
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
        email: adv.email || 'Verified auth email'
      }));
      setPendingAdvocates(formatted);
    } catch (error) {
      console.error('Failed to load pending advocates');
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
      console.error('Failed to load users');
    }
  };

  const fetchReportedPosts = async () => {
    try {
      // Mocking reported posts for prototype
      setPosts([
        { id: 1, title: 'Unverified Legal Advice', author: 'User X', reports: 5, status: 'visible' },
        { id: 2, title: 'Inappropriate Content', author: 'User Y', reports: 3, status: 'visible' }
      ]);
    } catch (error) {
      console.error('Failed to load reported posts');
    }
  };

  const handleVerification = async (advocateId, status) => {
    try {
      const { error } = await supabase
        .from('advocates')
        .update({ verification_status: status })
        .eq('id', advocateId);
      if (error) throw error;
      
      toast.success(`Advocate ${status} successfully`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update verification');
    }
  };

  const handleSendWarning = async (e) => {
    e.preventDefault();
    if (!warningMessage.trim()) return;
    
    try {
      await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: selectedUser.id,
        content: `⚠️ ADMIN NOTICE: ${warningMessage}`
      });
      
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
      
      toast.success('User updated successfully');
      setShowEditDialog(false);
      fetchAllUsers();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handlePostAction = (postId, action) => {
    toast.success(`Post ${action === 'hide' ? 'hidden' : 'removed'} successfully`);
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, status: action === 'hide' ? 'hidden' : 'removed' } : p));
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
            <span className="text-slate-500 font-mono text-sm px-3 py-1 bg-slate-100 rounded-sm">ADMIN CONSOLE</span>
            <Button onClick={logout} variant="ghost" className="text-slate-700">Logout</Button>
          </div>
        </div>
      </nav>

      <main className="ns-page">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold serif text-[#0F172A]">Platform Administration</h1>
              <p className="text-slate-600">Oversee users, verify advocates, and moderate content.</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-slate-200 px-4 py-2 rounded-sm text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Total Users</p>
                <p className="text-xl font-bold text-[#0F172A]">{allUsers.length}</p>
              </div>
              <div className="bg-white border border-slate-200 px-4 py-2 rounded-sm text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Advocates</p>
                <p className="text-xl font-bold text-[#B45309]">{allUsers.filter(u => u.role === 'advocate').length}</p>
              </div>
              <div className="bg-white border border-slate-200 px-4 py-2 rounded-sm text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Pending</p>
                <p className="text-xl font-bold text-amber-600">{pendingAdvocates.length}</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="users" className="w-full">
            <TabsList className="bg-slate-100 p-1 rounded-sm mb-8 w-fit">
              <TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-sm px-6">User Directory</TabsTrigger>
              <TabsTrigger value="verifications" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-sm px-6">Verification Queue</TabsTrigger>
              <TabsTrigger value="moderation" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-sm px-6">Moderation</TabsTrigger>
            </TabsList>

            {/* User Management Tab */}
            <TabsContent value="users">
              <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-xl font-semibold serif text-[#0F172A] flex items-center gap-2">
                    <Users className="h-5 w-5 text-slate-400" /> User Management
                  </h2>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="Search by name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-10 rounded-sm border-slate-200"
                      />
                    </div>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-32 h-10 rounded-sm border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="client">Citizens</SelectItem>
                        <SelectItem value="advocate">Advocates</SelectItem>
                        <SelectItem value="admin">Admins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Verification</th>
                        <th className="px-6 py-4">Joined</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-[#0F172A]">{u.name}</div>
                            <div className="text-xs text-slate-400 truncate max-w-[150px]">{u.id}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${
                              u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                              u.role === 'advocate' ? 'bg-[#B45309]/10 text-[#B45309] border-[#B45309]/20' :
                              'bg-slate-50 text-slate-600 border-slate-200'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {u.role === 'advocate' ? (
                              <span className={`text-xs font-medium ${u.advocate_details?.verification_status === 'verified' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {u.advocate_details?.verification_status || 'not-found'}
                              </span>
                            ) : '-'}
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-500">
                            {new Date(u.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => { setSelectedUser(u); setEditData({ name: u.name, role: u.role }); setShowEditDialog(true); }}>
                                <Edit className="h-4 w-4 text-slate-400" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600" onClick={() => { setSelectedUser(u); setShowWarningDialog(true); }}>
                                <ShieldAlert className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            {/* Verification Queue Tab */}
            <TabsContent value="verifications">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingAdvocates.length === 0 ? (
                  <div className="col-span-full py-20 bg-white border border-dashed border-slate-300 rounded-sm text-center">
                    <CheckCircle2 className="h-12 w-12 text-emerald-100 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No pending advocate verifications.</p>
                  </div>
                ) : (
                  pendingAdvocates.map(adv => (
                    <div key={adv.id} className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden flex flex-col">
                      <div className="p-6 border-b border-slate-50">
                        <h3 className="text-xl font-bold serif text-[#0F172A]">{adv.name}</h3>
                        <p className="text-xs text-slate-400 mt-1">Bar ID: {adv.bar_council_number}</p>
                      </div>
                      <div className="p-6 space-y-4 flex-1 bg-slate-50/50">
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500 font-medium uppercase tracking-tighter">Experience</span>
                            <span className="text-[#0F172A] font-bold">{adv.experience_years} Years</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500 font-medium uppercase tracking-tighter">Location</span>
                            <span className="text-[#0F172A] font-bold">{adv.location}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500 font-medium uppercase tracking-tighter">Specializations</span>
                            <span className="text-[#0F172A] font-bold truncate ml-4">{adv.specializations?.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-white border-t border-slate-100 grid grid-cols-2 gap-2">
                        <Button 
                          onClick={() => handleVerification(adv.id, 'verified')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white h-10 rounded-sm font-bold"
                        >
                          Approve
                        </Button>
                        <Button 
                          onClick={() => handleVerification(adv.id, 'rejected')}
                          variant="outline"
                          className="text-red-600 border-red-100 hover:bg-red-50 h-10 rounded-sm font-bold"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Moderation Tab */}
            <TabsContent value="moderation">
              <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-xl font-semibold serif text-[#0F172A] flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-red-500" /> Content Moderation
                  </h2>
                </div>
                <div className="divide-y divide-slate-50">
                  {posts.map(post => (
                    <div key={post.id} className="p-6 flex items-center justify-between group">
                      <div>
                        <h4 className={`font-semibold ${post.status !== 'visible' ? 'text-slate-400 line-through' : 'text-[#0F172A]'}`}>
                          {post.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">Author: {post.author} · <span className="text-red-500 font-bold">{post.reports} Reports</span></p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handlePostAction(post.id, 'hide')}
                          className="text-slate-400 hover:text-[#0F172A]"
                        >
                          <EyeOff className="h-4 w-4 mr-2" /> Hide
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handlePostAction(post.id, 'remove')}
                          className="text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Warning Dialog */}
      <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <DialogContent className="rounded-sm">
          <DialogHeader>
            <DialogTitle className="serif text-2xl text-red-600">Issue Formal Warning</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-slate-600">Recipient: <span className="font-bold">{selectedUser?.name}</span></p>
            <Textarea 
              placeholder="State the reason for warning and required action..." 
              value={warningMessage}
              onChange={(e) => setWarningMessage(e.target.value)}
              rows={4}
              className="rounded-sm"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowWarningDialog(false)}>Cancel</Button>
              <Button onClick={handleSendWarning} className="bg-red-600 hover:bg-red-700 text-white rounded-sm">Send Notice</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="rounded-sm">
          <DialogHeader>
            <DialogTitle className="serif text-2xl">Modify User Account</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditUser} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input 
                value={editData.name} 
                onChange={(e) => setEditData({...editData, name: e.target.value})} 
                className="h-11 rounded-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={editData.role} onValueChange={(val) => setEditData({...editData, role: val})}>
                <SelectTrigger className="h-11 rounded-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Citizen</SelectItem>
                  <SelectItem value="advocate">Advocate</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="ghost" onClick={() => setShowEditDialog(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#0F172A] text-white rounded-sm h-11 px-6 font-bold">Save Updates</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default AdminDashboard;

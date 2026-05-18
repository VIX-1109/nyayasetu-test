import { useState, useEffect } from 'react';
import { getAllUsers, updateUserProfile } from '@/services/adminService';
import { getPendingAdvocates, updateVerificationStatus } from '@/services/advocateService';
import { sendAdminWarning } from '@/services/messageService';
import { toast } from 'sonner';

export const useAdminDashboard = (user) => {
  const [pendingAdvocates, setPendingAdvocates] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [posts, setPosts] = useState([
    { id: 1, title: 'Unverified Legal Advice', author: 'User X', reports: 5, status: 'visible' },
    { id: 2, title: 'Inappropriate Content', author: 'User Y', reports: 3, status: 'visible' }
  ]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [warningMessage, setWarningMessage] = useState('');
  const [editData, setEditData] = useState({ name: '', role: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [advocates, users] = await Promise.all([
        getPendingAdvocates(),
        getAllUsers()
      ]);
      setPendingAdvocates(advocates.map(adv => ({ ...adv, email: adv.email || 'Verified auth email' })));
      setAllUsers(users);
    } catch (error) {
      console.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (advocateId, status) => {
    try {
      await updateVerificationStatus(advocateId, status);
      toast.success(`Advocate ${status} successfully`);
      fetchData();
    } catch (error) {
      toast.error(`Failed to update: ${error.message || 'Unknown error'}`);
    }
  };

  const handleSendWarning = async (e) => {
    e.preventDefault();
    if (!warningMessage.trim()) return;
    try {
      await sendAdminWarning(user.id, selectedUser.id, warningMessage);
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
      await updateUserProfile(selectedUser.id, { name: editData.name, role: editData.role });
      toast.success('User updated successfully');
      setShowEditDialog(false);
      fetchData();
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

  useEffect(() => { fetchData(); }, []);

  return {
    pendingAdvocates, allUsers, posts, loading, filteredUsers,
    searchQuery, setSearchQuery,
    roleFilter, setRoleFilter,
    showWarningDialog, setShowWarningDialog,
    showEditDialog, setShowEditDialog,
    selectedUser, setSelectedUser,
    warningMessage, setWarningMessage,
    editData, setEditData,
    handleVerification, handleSendWarning, handleEditUser, handlePostAction
  };
};

import { useState, useEffect } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Toaster } from 'sonner';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import AdvocateDirectory from './pages/AdvocateDirectory';
import AdvocateProfile from './pages/AdvocateProfile';
import CitizenDashboard from './pages/ClientDashboard';
import AdvocateDashboard from './pages/AdvocateDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AILawLearning from './pages/AILawLearning';
import Messages from './pages/Messages';
import JusticeFeed from './pages/JusticeFeed';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (authUser) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();
      
    if (data) {
      setUser({ ...authUser, ...data });
    }
    setLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing user={user} logout={logout} />} />
          <Route path="/auth" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : user.role === 'advocate' ? '/advocate/dashboard' : '/client/dashboard'} /> : <Auth setUser={setUser} />} />
          <Route path="/advocates" element={<AdvocateDirectory user={user} logout={logout} />} />
          <Route path="/feed" element={<JusticeFeed user={user} logout={logout} />} />
          <Route path="/advocates/:id" element={<AdvocateProfile user={user} logout={logout} />} />
          <Route path="/ai-learning" element={<AILawLearning user={user} logout={logout} />} />
          <Route path="/messages/:userId" element={user ? <Messages user={user} logout={logout} /> : <Navigate to="/auth" />} />
          <Route path="/client/dashboard" element={user && user.role === 'client' ? <CitizenDashboard user={user} logout={logout} /> : <Navigate to="/auth" />} />
          <Route path="/advocate/dashboard" element={user && user.role === 'advocate' ? <AdvocateDashboard user={user} logout={logout} /> : <Navigate to="/auth" />} />
          <Route path="/admin" element={user && user.role === 'admin' ? <AdminDashboard user={user} logout={logout} /> : <Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;

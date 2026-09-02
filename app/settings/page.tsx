"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updateProfile } from 'firebase/auth';
import { 
  ArrowLeft, User, Shield, Music, Monitor, 
  LogOut, Trash2, Camera, ChevronRight, Save,
  CheckCircle2, AlertCircle
} from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [displayName, setDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Redirect if not logged in
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (user === null) {
        router.push('/');
      } else if (user) {
        setDisplayName(user.displayName || '');
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0C0414] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          <p className="text-white/40 text-sm font-mono tracking-widest uppercase">Verifying Session</p>
        </div>
      </div>
    );
  }

  const avatarUrl = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'User')}&background=random`;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateProfile(user, { displayName });
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setSaveMessage('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Monitor },
    { id: 'audio', label: 'Audio Quality', icon: Music },
    { id: 'account', label: 'Account Security', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#0C0414] text-white font-mono selection:bg-purple-500/30">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0C0414]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/player" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10">
            <ArrowLeft className="w-5 h-5 text-white/70" />
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">Settings</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0" style={{ scrollbarWidth: 'none' }}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 whitespace-nowrap outline-none ${isActive ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/5 text-white border border-purple-500/20 shadow-lg shadow-purple-500/5' : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'}`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-white/30'}`} />
                  <span className="font-medium text-sm tracking-wide">{tab.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto hidden md:block text-white/20" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 max-w-2xl transition-all duration-300">
          {activeTab === 'profile' && (
            <div className="space-y-8">
              
              <div className="bg-[#111] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
                
                <h2 className="text-xl font-bold mb-8 flex items-center gap-3 relative">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <User className="text-purple-400 w-5 h-5" />
                  </div>
                  Public Profile
                </h2>
                
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 mb-8 relative">
                  <div className="relative group cursor-pointer shrink-0">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#111] ring-4 ring-white/5 group-hover:ring-purple-500/30 transition-all duration-300">
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Camera className="w-6 h-6 text-white/80" />
                    </div>
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <h3 className="text-2xl font-bold tracking-tight">{user.displayName || 'RhythmX User'}</h3>
                    <p className="text-white/40 mt-1 text-sm">{user.email}</p>
                    <div className="mt-4 flex items-center justify-center sm:justify-start gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-xs font-semibold border border-purple-500/20">
                        <Shield className="w-3 h-3" />
                        Verified Member
                      </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6 border-t border-white/5 pt-8 relative">
                  <div>
                    <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-2 ml-1">
                      Display Name
                    </label>
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors focus:ring-1 focus:ring-purple-500/50"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                    <button 
                      type="submit"
                      disabled={isSaving || displayName === user.displayName}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-black font-bold text-sm rounded-xl hover:bg-white/90 disabled:opacity-50 transition-all shadow-lg shadow-white/5"
                    >
                      {isSaving ? <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Changes
                    </button>
                    {saveMessage && (
                      <span className={`text-sm font-medium flex items-center gap-2 ${saveMessage.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
                        {saveMessage.includes('Failed') ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        {saveMessage}
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
             <div className="space-y-6">
               <div className="bg-[#111] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
                 
                 <h2 className="text-xl font-bold mb-8 flex items-center gap-3 relative">
                   <div className="p-2 bg-blue-500/10 rounded-lg">
                     <Monitor className="text-blue-400 w-5 h-5" />
                   </div>
                   App Preferences
                 </h2>
                 
                 <div className="space-y-4 relative">
                   <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                     <div>
                       <h3 className="font-semibold text-sm">Hardware Acceleration</h3>
                       <p className="text-xs text-white/40 mt-1">Smoother 3D visualizer animations</p>
                     </div>
                     <div className="w-12 h-6 bg-purple-500 rounded-full relative cursor-pointer shadow-inner">
                       <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                     </div>
                   </div>
                   <div className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                     <div>
                       <h3 className="font-semibold text-sm">Show Lyrics by Default</h3>
                       <p className="text-xs text-white/40 mt-1">Auto-open lyrics panel when available</p>
                     </div>
                     <div className="w-12 h-6 bg-black/50 border border-white/10 rounded-full relative cursor-pointer">
                       <div className="absolute left-1 top-1 w-4 h-4 bg-white/30 rounded-full" />
                     </div>
                   </div>
                 </div>
               </div>
             </div>
          )}

          {activeTab === 'audio' && (
             <div className="space-y-6">
               <div className="bg-[#111] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 blur-[100px] rounded-full pointer-events-none" />
                 
                 <h2 className="text-xl font-bold mb-8 flex items-center gap-3 relative">
                   <div className="p-2 bg-pink-500/10 rounded-lg">
                     <Music className="text-pink-400 w-5 h-5" />
                   </div>
                   Audio Settings
                 </h2>
                 
                 <div className="space-y-8 relative">
                   <div>
                     <label className="block text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-4 ml-1">
                       Streaming Quality
                     </label>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                       {['Data Saver', 'High Quality', 'Lossless'].map(quality => (
                         <button key={quality} className={`py-3.5 px-4 rounded-xl border text-sm font-medium transition-all ${quality === 'High Quality' ? 'bg-gradient-to-b from-purple-500/20 to-purple-500/5 border-purple-500/30 text-white shadow-lg shadow-purple-500/10' : 'bg-white/[0.03] border-white/5 text-white/50 hover:bg-white/[0.06] hover:text-white/80'}`}>
                           {quality}
                         </button>
                       ))}
                     </div>
                   </div>
                   
                   <div className="pt-6 border-t border-white/5">
                     <div className="flex items-center justify-between mb-2">
                       <h3 className="font-semibold text-sm">Audio Crossfade</h3>
                       <span className="text-purple-400 text-sm font-mono bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">3s</span>
                     </div>
                     <p className="text-xs text-white/40 mb-5">Smooth transition between tracks</p>
                     <input type="range" min="0" max="10" defaultValue="3" className="w-full accent-purple-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer" />
                   </div>
                 </div>
               </div>
             </div>
          )}

          {activeTab === 'account' && (
             <div className="space-y-6">
               <div className="bg-[#111] border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />
                 
                 <h2 className="text-xl font-bold mb-8 flex items-center gap-3 relative">
                   <div className="p-2 bg-orange-500/10 rounded-lg">
                     <Shield className="text-orange-400 w-5 h-5" />
                   </div>
                   Security & Access
                 </h2>
                 
                 <div className="space-y-4 relative">
                   <button 
                     onClick={handleLogout}
                     className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all group shadow-sm"
                   >
                     <div className="flex items-center gap-4">
                       <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                         <LogOut className="w-4 h-4 text-white/60 group-hover:text-white" />
                       </div>
                       <span className="font-medium text-sm text-white/80 group-hover:text-white">Sign Out on this device</span>
                     </div>
                     <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
                   </button>
                   
                   <div className="pt-8 mt-8 border-t border-red-500/10">
                     <h3 className="text-red-400 font-semibold mb-2 text-sm">Danger Zone</h3>
                     <p className="text-white/40 text-xs mb-5 leading-relaxed">
                       Permanently delete your account and remove all your data from our servers. This action cannot be undone.
                     </p>
                     <button className="flex items-center gap-2 px-5 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-medium rounded-xl transition-colors border border-red-500/20 shadow-sm">
                       <Trash2 className="w-4 h-4" />
                       Delete Account
                     </button>
                   </div>
                 </div>
               </div>
             </div>
          )}

        </section>
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { View } from './types';
import Dashboard from './components/Dashboard';
import StudentsArea from './components/StudentsArea';
import Scheduling from './components/Scheduling';
import Timetable from './components/Timetable';
import Finance from './components/Finance';
import Performance from './components/Performance';
import GroupClasses from './components/GroupClasses';
import { Sidebar } from './components/Sidebar';
import { ProfileModal } from './components/profile/ProfileModal';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { useAppData } from './hooks/useAppData';
import { useAutomaticScheduling } from './hooks/useAutomaticScheduling';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [useLegacyDashboard, setUseLegacyDashboard] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Auth Session Management
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Theme Management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // App Data Hook
  const {
    loading: dataLoading,
    students,
    appointments,
    transactions,
    performanceRecords,
    timetable,
    groupClasses,
    userProfile,
    setAppointments,
    setTimetable,
    handleRegisterStudent,
    handleUpdateStudent,
    handleDeleteStudent,
    handleAddAppointment,
    handleUpdateAppointmentStatus,
    handleUpdateAppointmentNotes,
    handleDeleteAppointment,
    handleAddTransaction,
    handleUpdateTransactionStatus,
    handleDeleteTransaction,
    handleAddPerformance,
    handleAddGroupClass,
    handleUpdateGroupClass,
    handleDeleteGroupClass,
    handleSaveProfile
  } = useAppData(session);

  // Automatic Scheduling Hook
  useAutomaticScheduling({
    students,
    appointments,
    loading: dataLoading,
    setAppointments,
    setTimetable
  });

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard students={students} appointments={appointments} transactions={transactions} userName={userProfile.name} onViewChange={setCurrentView} legacyMode={useLegacyDashboard} />;
      case 'students': return <StudentsArea students={students} appointments={appointments} onRegister={handleRegisterStudent} onUpdate={handleUpdateStudent} onDelete={handleDeleteStudent} />;
      case 'scheduling': return <Scheduling appointments={appointments} students={students} onAddAppointment={handleAddAppointment} onUpdateStatus={handleUpdateAppointmentStatus} onUpdateNotes={handleUpdateAppointmentNotes} onDeleteAppointment={handleDeleteAppointment} />;
      case 'timetable': return <Timetable timetable={timetable} />;
      case 'finance': return <Finance students={students} appointments={appointments} transactions={transactions} userProfile={userProfile} onAddTransaction={handleAddTransaction} onUpdateStatus={handleUpdateTransactionStatus} onDelete={handleDeleteTransaction} />;
      case 'performance': return <Performance students={students} performanceRecords={performanceRecords} onAddPerformance={handleAddPerformance} />;
      case 'groupClasses': return <GroupClasses groupClasses={groupClasses} students={students} onAddClass={handleAddGroupClass} onUpdateClass={handleUpdateGroupClass} onDeleteClass={handleDeleteGroupClass} />;
      default: return <Dashboard students={students} appointments={appointments} transactions={transactions} userName={userProfile.name} onViewChange={setCurrentView} legacyMode={useLegacyDashboard} />;
    }
  };

  if (initialLoading || (session && dataLoading)) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-10 transition-colors">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
              <Menu className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <div onClick={() => setIsProfileModalOpen(true)} className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 py-1 transition-all rounded-r-lg group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">{userProfile.name}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{userProfile.role}</p>
              </div>
              <img src={userProfile.photo} alt="Profile" className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-50 dark:ring-indigo-900/30 group-hover:ring-indigo-200 transition-all" />
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          {renderContent()}
        </div>
      </main>
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default App;

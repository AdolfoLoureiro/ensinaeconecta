import React, { useState, useEffect } from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { View, Student, Appointment, TimetableEntry, Transaction, PerformanceRecord, GroupClass } from './types';
import Dashboard from './components/Dashboard';
import StudentsArea from './components/StudentsArea';
import Scheduling from './components/Scheduling';
import Timetable from './components/Timetable';
import Finance from './components/Finance';
import Performance from './components/Performance';
import GroupClasses from './components/GroupClasses';
import { Sidebar } from './components/Sidebar';
import { ProfileModal, UserProfile } from './components/profile/ProfileModal';
import { supabase } from './lib/supabase';
import { Auth } from './components/Auth';
import { api } from './lib/api';
import { formatDate } from './lib/utils';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [useLegacyDashboard, setUseLegacyDashboard] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    }
    return 'light';
  });

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Carregando...',
    role: '...',
    photo: 'https://picsum.photos/seed/ensinae-prof/150/150',
    pixKey: ''
  });

  // Global State for App Data
  const [students, setStudents] = useState<Student[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [groupClasses, setGroupClasses] = useState<GroupClass[]>([]);

  // Load all data from Supabase
  useEffect(() => {
    if (session) {
      setLoading(true);
      Promise.all([
        api.students.list(),
        api.appointments.list(),
        api.transactions.list(),
        api.performance.list(),
        api.groupClasses.list(),
        api.profile.get()
      ]).then(([studentsData, aptsData, txData, perfData, classesData, profileData]) => {
        setStudents(studentsData);
        setAppointments(aptsData);
        setTransactions(txData);
        setPerformanceRecords(perfData);
        setGroupClasses(classesData);
        if (profileData) {
          setUserProfile(profileData);
        } else {
          // Default profile if none exists in DB
          setUserProfile({
            name: session.user.email?.split('@')[0] || 'Usuário',
            role: 'Professor Particular',
            photo: `https://ui-avatars.com/api/?name=${session.user.email}&background=6366f1&color=fff`,
            pixKey: ''
          });
        }
        setLoading(false);
      }).catch(err => {
        console.error('Error loading data:', err);
        setLoading(false);
      });
    }
  }, [session]);

  // --- AUTOMATIC SCHEDULING LOGIC ---
  const isGeneratingRef = React.useRef(false);

  useEffect(() => {
    const checkAndExtendSchedules = async () => {
      if (loading || isGeneratingRef.current || students.length === 0) return;

      isGeneratingRef.current = true;
      try {
        const daysOfWeekMap: Record<string, number> = { 'Domingo': 0, 'Segunda': 1, 'Terça': 2, 'Quarta': 3, 'Quinta': 4, 'Sexta': 5, 'Sábado': 6 };
        const now = new Date();

        let newAppointmentsToAdd: Omit<Appointment, 'id'>[] = [];
        const colors = ['bg-indigo-100 text-indigo-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700'];

        students.forEach(student => {
          if (student.status !== 'Ativo' || !student.schedules || student.schedules.length === 0) return;

          // Process color for timetable
          const colorIndex = parseInt(student.id.replace(/\D/g, '') || '0') % colors.length;
          const baseColor = colors[colorIndex];
          const fullColor = `${baseColor.split(' ')[0]} dark:${baseColor.split(' ')[0].replace('100', '900/40')} ${baseColor.split(' ')[1]} dark:${baseColor.split(' ')[1].replace('700', '300')}`;

          // Ensure student has timetable entries (idempotent)
          setTimetable(prev => {
            const studentEntries = prev.filter(t => t.studentId === student.id);
            if (studentEntries.length === (student.schedules?.length || 0)) return prev;

            const filteredPrev = prev.filter(t => t.studentId !== student.id);
            const newEntries: TimetableEntry[] = (student.schedules || []).map(s => ({
              studentId: student.id,
              day: s.day,
              hour: s.time,
              studentName: student.name.split(' ')[0],
              color: fullColor,
              photo: student.photo
            }));
            return [...filteredPrev, ...newEntries];
          });

          // Find existing appointments to avoid duplication
          const studentApts = appointments.filter(a => a.studentId === student.id);
          const existingAptKeys = new Set(studentApts.map(a => `${a.date}-${a.time}`));
          const regularAptDates = new Set(
            studentApts
              .filter(a => a.subject === 'Aula Regular')
              .map(a => a.date)
          );

          (student.schedules || []).forEach(s => {
            const targetDay = daysOfWeekMap[s.day];
            for (let i = 0; i < 90; i++) {
              const dateObj = new Date(now);
              dateObj.setDate(now.getDate() + i);

              if (dateObj.getDay() === targetDay) {
                const dateStr = formatDate(dateObj);
                const aptKey = `${dateStr}-${s.time}`;

                // Prevenção de duplicatas exatas E de "fantasmas"
                // Se o aluno já tem uma "Aula Regular" no dia, mas em horário diferente, 
                // não criamos a nova automaticamente para evitar bagunça se o horário mudou.
                const hasAnyRegularOnDay = regularAptDates.has(dateStr);
                const isExactDuplicate = existingAptKeys.has(aptKey);

                if (!isExactDuplicate && !hasAnyRegularOnDay) {
                  newAppointmentsToAdd.push({
                    studentId: student.id,
                    studentName: student.name,
                    date: dateStr,
                    time: s.time,
                    subject: 'Aula Regular',
                    status: 'Agendado'
                  });
                  existingAptKeys.add(aptKey);
                  regularAptDates.add(dateStr);
                }
              }
            }
          });
        });

        if (newAppointmentsToAdd.length > 0) {
          try {
            console.log(`Sistema: Salvando ${newAppointmentsToAdd.length} novos agendamentos automáticos.`);
            const savedApts = await api.appointments.createMany(newAppointmentsToAdd);
            setAppointments(prev => [...prev, ...savedApts]);
          } catch (error) {
            console.error('Erro ao salvar agendamentos automáticos:', error);
          }
        }
      } finally {
        isGeneratingRef.current = false;
      }
    };

    const timer = setTimeout(checkAndExtendSchedules, 1000);
    return () => clearTimeout(timer);
  }, [students, loading]);

  const handleRegisterStudent = async (newStudent: Student) => {
    try {
      const { id, ...studentData } = newStudent;
      const createdStudent = await api.students.create(studentData);
      setStudents(prev => [...prev, createdStudent]);
    } catch (error) {
      console.error('Erro ao matricular aluno:', error);
      alert('Erro ao matricular aluno. Tente novamente.');
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    try {
      const savedStudent = await api.students.update(updatedStudent);
      setStudents(prev => prev.map(s => s.id === savedStudent.id ? savedStudent : s));
      setTimetable(prev => prev.filter(t => t.studentId !== savedStudent.id));
    } catch (error) {
      console.error('Erro ao atualizar aluno:', error);
      alert('Erro ao atualizar aluno. Tente novamente.');
    }
  };

  const handleDeleteStudent = async (id: string) => {
    const student = students.find(s => s.id === id);
    if (!student) return;
    if (confirm(`Tem certeza que deseja excluir o aluno ${student.name}?`)) {
      try {
        await api.students.remove(id);
        setStudents(prev => prev.filter(s => s.id !== id));
        setTimetable(prev => prev.filter(t => t.studentId !== id));
        setAppointments(prev => prev.filter(a => a.studentId !== id));
      } catch (error) {
        console.error('Erro ao excluir aluno:', error);
        alert('Erro ao excluir aluno. Tente novamente.');
      }
    }
  };

  const handleAddAppointment = async (apt: Appointment) => {
    try {
      const { id, ...aptData } = apt;
      const savedApt = await api.appointments.create(aptData);
      setAppointments(prev => [...prev, savedApt]);
    } catch (err) {
      console.error('Error adding appointment:', err);
    }
  };

  const handleUpdateAppointmentStatus = async (id: string, status: Appointment['status']) => {
    try {
      const apt = appointments.find(a => a.id === id);
      const student = students.find(s => s.id === apt?.studentId);

      await api.appointments.updateStatus(id, status);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));

      // Se a aula foi concluída, incrementa o contador do aluno
      if (status === 'Concluído' && student) {
        const newCount = (student.totalSessionsAttended || 0) + 1;
        await api.students.updateSessionCount(student.id, newCount);
        setStudents(prev => prev.map(s => s.id === student.id ? { ...s, totalSessionsAttended: newCount } : s));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleUpdateAppointmentNotes = async (id: string, notes: string) => {
    try {
      await api.appointments.updateNotes(id, notes);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, notes } : a));
    } catch (err) {
      console.error('Error updating notes:', err);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        await api.appointments.remove(id);
        setAppointments(prev => prev.filter(a => a.id !== id));
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Erro ao excluir agendamento.');
      }
    }
  };

  const handleAddTransaction = async (tx: Transaction) => {
    try {
      const { id, ...txData } = tx;
      const savedTx = await api.transactions.create(txData);
      setTransactions(prev => [savedTx, ...prev]);
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  const handleUpdateTransactionStatus = async (id: string, status: Transaction['status']) => {
    try {
      const tx = transactions.find(t => t.id === id);
      await api.transactions.updateStatus(id, status);
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, status } : t));

      // Se o pagamento foi recebido, reseta o contador de aulas do aluno
      if (status === 'Pago' && tx?.studentId) {
        await api.students.updateSessionCount(tx.studentId, 0);
        setStudents(prev => prev.map(s => s.id === tx.studentId ? { ...s, totalSessionsAttended: 0 } : s));
      }
    } catch (err) {
      console.error('Error updating tx status:', err);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await api.transactions.remove(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  const handleAddPerformance = async (record: PerformanceRecord) => {
    try {
      const { id, ...perfData } = record;
      const savedPerf = await api.performance.create(perfData);
      setPerformanceRecords(prev => [savedPerf, ...prev]);
    } catch (err) {
      console.error('Error adding performance:', err);
    }
  };

  const handleAddGroupClass = async (gc: GroupClass) => {
    try {
      const { id, ...gcData } = gc;
      const savedGC = await api.groupClasses.create(gcData);
      setGroupClasses(prev => [...prev, savedGC]);
    } catch (err) {
      console.error('Error adding group class:', err);
    }
  };

  const handleUpdateGroupClass = async (gc: GroupClass) => {
    try {
      await api.groupClasses.update(gc);
      setGroupClasses(prev => prev.map(c => c.id === gc.id ? gc : c));
    } catch (err) {
      console.error('Error updating group class:', err);
    }
  };

  const handleDeleteGroupClass = async (id: string) => {
    try {
      await api.groupClasses.remove(id);
      setGroupClasses(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting group class:', err);
    }
  };

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleSaveProfile = async (newProfile: UserProfile) => {
    try {
      const savedProfile = await api.profile.upsert(newProfile);
      setUserProfile(savedProfile);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Erro ao salvar perfil.');
    }
  };

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

  if (loading) {
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

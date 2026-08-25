import { useState, useEffect } from 'react';
import { Student, Appointment, Transaction, PerformanceRecord, TimetableEntry, GroupClass } from '../types';
import { api } from '../lib/api';
import { UserProfile } from '../components/profile/ProfileModal';

export const useAppData = (session: any) => {
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState<Student[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>([]);
    const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
    const [groupClasses, setGroupClasses] = useState<GroupClass[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile>({
        name: 'Carregando...',
        role: '...',
        photo: 'https://picsum.photos/seed/ensinae-prof/150/150',
        pixKey: ''
    });

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
        const previousAppointments = appointments;
        const previousStudents = students;

        const apt = appointments.find(a => a.id === id);
        if (!apt) return;

        const previousStatus = apt.status;
        const student = students.find(s => s.id === apt.studentId);

        // 1. Atualização Otimista Imediata da UI
        setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));

        let newCount = student?.totalSessionsAttended || 0;
        if (status === 'Concluído' && previousStatus !== 'Concluído' && student) {
            newCount = newCount + 1;
            setStudents(prev => prev.map(s => s.id === student.id ? { ...s, totalSessionsAttended: newCount } : s));
        } else if (previousStatus === 'Concluído' && status !== 'Concluído' && student && newCount > 0) {
            newCount = Math.max(0, newCount - 1);
            setStudents(prev => prev.map(s => s.id === student.id ? { ...s, totalSessionsAttended: newCount } : s));
        }

        // 2. Persistência no Banco Supabase em segundo plano
        try {
            await api.appointments.updateStatus(id, status);
            if (student && (status === 'Concluído' || previousStatus === 'Concluído')) {
                await api.students.updateSessionCount(student.id, newCount);
            }
        } catch (err) {
            console.error('Erro ao atualizar status de presença no Supabase:', err);
            // Rollback para o estado anterior se houver falha
            setAppointments(previousAppointments);
            setStudents(previousStudents);
            alert('Não foi possível salvar a alteração de presença no banco de dados. A alteração foi revertida.');
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
        const previousGroupClasses = groupClasses;
        setGroupClasses(prev => prev.map(c => c.id === gc.id ? gc : c));
        try {
            await api.groupClasses.update(gc);
        } catch (err) {
            console.error('Error updating group class:', err);
            setGroupClasses(previousGroupClasses);
            alert('Erro ao salvar alterações no aulão. Alteração revertida.');
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

    const handleSaveProfile = async (newProfile: UserProfile) => {
        try {
            const savedProfile = await api.profile.upsert(newProfile);
            setUserProfile(savedProfile);
        } catch (err) {
            console.error('Error saving profile:', err);
            alert('Erro ao salvar perfil.');
        }
    };

    return {
        loading,
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
    };
};

import React, { useEffect, useRef } from 'react';
import { Student, Appointment, TimetableEntry } from '../types';
import { api } from '../lib/api';
import { formatDate, parseFormattedDate } from '../lib/utils';

interface UseAutomaticSchedulingProps {
    students: Student[];
    appointments: Appointment[];
    loading: boolean;
    setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
    setTimetable: React.Dispatch<React.SetStateAction<TimetableEntry[]>>;
}

export const useAutomaticScheduling = ({
    students,
    appointments,
    loading,
    setAppointments,
    setTimetable
}: UseAutomaticSchedulingProps) => {
    const isGeneratingRef = useRef(false);

    useEffect(() => {
        const checkAndExtendSchedules = async () => {
            if (loading || isGeneratingRef.current || students.length === 0) return;

            isGeneratingRef.current = true;
            try {
                const daysOfWeekMap: Record<string, number> = { 
                    'Domingo': 0, 'Segunda': 1, 'Terça': 2, 'Quarta': 3, 'Quinta': 4, 'Sexta': 5, 'Sábado': 6 
                };
                const now = new Date();

                let newAppointmentsToAdd: Omit<Appointment, 'id'>[] = [];
                let allAppointmentsToDelete: string[] = [];
                let currentAppointmentsState = [...appointments];
                const todayStr = formatDate(now);
                const todayDate = parseFormattedDate(todayStr).getTime();

                const colors = [
                    'bg-indigo-100 text-indigo-700', 
                    'bg-emerald-100 text-emerald-700', 
                    'bg-amber-100 text-amber-700', 
                    'bg-rose-100 text-rose-700'
                ];

                // Passo 1: Limpar agendamentos futuros que não batem mais com o horário atual
                students.forEach(student => {
                    if (student.status !== 'Ativo') return;

                    const studentApts = currentAppointmentsState.filter(a => a.studentId === student.id);
                    
                    const outdated = studentApts.filter(a => {
                        if (a.subject !== 'Aula Regular' || a.status !== 'Agendado') return false;
                        const aptDate = parseFormattedDate(a.date);
                        if (aptDate.getTime() <= todayDate) return false;

                        const dayName = Object.keys(daysOfWeekMap).find(key => daysOfWeekMap[key] === aptDate.getDay());
                        return !(student.schedules || []).some(s => s.day === dayName && s.time === a.time);
                    });

                    if (outdated.length > 0) {
                        const ids = outdated.map(a => a.id);
                        allAppointmentsToDelete.push(...ids);
                        currentAppointmentsState = currentAppointmentsState.filter(a => !ids.includes(a.id));
                    }
                });

                // Passo 2: Adicionar novos agendamentos conforme o horário atual
                students.forEach(student => {
                    if (student.status !== 'Ativo' || !student.schedules || student.schedules.length === 0) return;

                    const colorIndex = parseInt(student.id.replace(/\D/g, '') || '0') % colors.length;
                    const baseColor = colors[colorIndex];
                    const fullColor = `${baseColor.split(' ')[0]} dark:${baseColor.split(' ')[0].replace('100', '900/40')} ${baseColor.split(' ')[1]} dark:${baseColor.split(' ')[1].replace('700', '300')}`;

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

                    const studentApts = currentAppointmentsState.filter(a => a.studentId === student.id);
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

                // Executar operações no banco (se necessário)
                if (allAppointmentsToDelete.length > 0 || newAppointmentsToAdd.length > 0) {
                    try {
                        let updatedList = [...appointments];

                        if (allAppointmentsToDelete.length > 0) {
                            console.log(`Sistema: Removendo ${allAppointmentsToDelete.length} agendamentos desatualizados.`);
                            await api.appointments.removeMany(allAppointmentsToDelete);
                            updatedList = updatedList.filter(a => !allAppointmentsToDelete.includes(a.id));
                        }

                        if (newAppointmentsToAdd.length > 0) {
                            console.log(`Sistema: Salvando ${newAppointmentsToAdd.length} novos agendamentos automáticos.`);
                            const savedApts = await api.appointments.createMany(newAppointmentsToAdd);
                            updatedList = [...updatedList, ...savedApts];
                        }

                        setAppointments(updatedList);
                    } catch (error) {
                        console.error('Erro na sincronização automática de agendamentos:', error);
                    }
                }
            } finally {
                isGeneratingRef.current = false;
            }
        };

        const timer = setTimeout(checkAndExtendSchedules, 1000);
        return () => clearTimeout(timer);
    }, [students, loading, appointments, setAppointments, setTimetable]);
};

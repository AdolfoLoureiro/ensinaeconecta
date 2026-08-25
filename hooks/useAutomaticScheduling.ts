import React, { useEffect, useRef } from 'react';
import { Student, Appointment, TimetableEntry } from '../types';
import { api } from '../lib/api';
import { formatDate, parseFormattedDate, toBRDateStr } from '../lib/utils';

interface UseAutomaticSchedulingProps {
    students: Student[];
    appointments: Appointment[];
    loading: boolean;
    setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
    setTimetable: React.Dispatch<React.SetStateAction<TimetableEntry[]>>;
}

const getNormalizedDayIndex = (dayStr: string): number | undefined => {
    if (!dayStr) return undefined;
    const clean = dayStr
        .trim()
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[\s_-]*feira/g, '')
        .trim();

    const map: Record<string, number> = {
        'domingo': 0, 'dom': 0,
        'segunda': 1, 'seg': 1,
        'terca': 2, 'ter': 2,
        'quarta': 3, 'qua': 3,
        'quinta': 4, 'qui': 4,
        'sexta': 5, 'sex': 5,
        'sabado': 6, 'sab': 6
    };
    return map[clean];
};

const isSameStudent = (apt: Appointment, s: Student) => {
    if (apt.studentId && s.id && String(apt.studentId).trim().toLowerCase() === String(s.id).trim().toLowerCase()) {
        return true;
    }
    if (apt.studentName && s.name && apt.studentName.trim().toLowerCase() === s.name.trim().toLowerCase()) {
        return true;
    }
    return false;
};

export const useAutomaticScheduling = ({
    students,
    appointments,
    loading,
    setAppointments,
    setTimetable
}: UseAutomaticSchedulingProps) => {
    const isGeneratingRef = useRef(false);
    const needsRetryRef = useRef(false);
    
    // Manter referências atualizadas para evitar race conditions em closures assíncronos
    const appointmentsRef = useRef(appointments);
    appointmentsRef.current = appointments;

    const studentsRef = useRef(students);
    studentsRef.current = students;

    useEffect(() => {
        const checkAndExtendSchedules = async () => {
            const currentStudents = studentsRef.current;
            const currentAppointments = appointmentsRef.current;

            if (loading || currentStudents.length === 0) return;

            if (isGeneratingRef.current) {
                needsRetryRef.current = true;
                return;
            }

            isGeneratingRef.current = true;
            needsRetryRef.current = false;
            try {
                const now = new Date();
                let newAppointmentsToAdd: Omit<Appointment, 'id'>[] = [];
                let allAppointmentsToDelete: string[] = [];
                let currentAppointmentsState = [...currentAppointments];
                const todayStr = formatDate(now);
                const todayDate = parseFormattedDate(todayStr).getTime();

                const colors = [
                    'bg-indigo-100 text-indigo-700', 
                    'bg-emerald-100 text-emerald-700', 
                    'bg-amber-100 text-amber-700', 
                    'bg-rose-100 text-rose-700'
                ];

                console.log(`[Agendamento Automático] Iniciando verificação para ${currentStudents.length} alunos...`);

                // Passo 1: Limpar agendamentos futuros que não batem mais com os horários atuais do aluno
                currentStudents.forEach(student => {
                    const isActive = (student.status || '').trim().toLowerCase() === 'ativo';
                    if (!isActive) return;

                    const studentSchedules: any[] = Array.isArray(student.schedules)
                        ? student.schedules
                        : typeof student.schedules === 'string'
                            ? (() => { try { return JSON.parse(student.schedules); } catch { return []; } })()
                            : [];

                    const studentApts = currentAppointmentsState.filter(a => isSameStudent(a, student));
                    
                    const outdated = studentApts.filter(a => {
                        if (a.subject !== 'Aula Regular' || a.status !== 'Agendado') return false;
                        const aptDate = parseFormattedDate(a.date);
                        if (aptDate.getTime() <= todayDate) return false;

                        const dayOfWeek = aptDate.getDay();
                        return !studentSchedules.some(s => {
                            const sDayIdx = getNormalizedDayIndex(s.day);
                            return sDayIdx === dayOfWeek && s.time === a.time;
                        });
                    });

                    if (outdated.length > 0) {
                        const ids = outdated.map(a => a.id);
                        allAppointmentsToDelete.push(...ids);
                        currentAppointmentsState = currentAppointmentsState.filter(a => !ids.includes(a.id));
                    }
                });

                // Passo 2: Adicionar novos agendamentos conforme o horário atual dos alunos ativos
                currentStudents.forEach(student => {
                    const isActive = (student.status || '').trim().toLowerCase() === 'ativo';
                    const studentSchedules: any[] = Array.isArray(student.schedules)
                        ? student.schedules
                        : typeof student.schedules === 'string'
                            ? (() => { try { return JSON.parse(student.schedules); } catch { return []; } })()
                            : [];

                    if (!isActive || studentSchedules.length === 0) {
                        console.log(`[Agendamento Automático] Aluno "${student.name}": inativo ou sem horários configurados (status=${student.status}, horários=${studentSchedules.length})`);
                        return;
                    }

                    console.log(`[Agendamento Automático] Processando aluno "${student.name}" com ${studentSchedules.length} horário(s):`, studentSchedules);

                    const colorIndex = parseInt(student.id.replace(/\D/g, '') || '0') % colors.length;
                    const baseColor = colors[colorIndex];
                    const fullColor = `${baseColor.split(' ')[0]} dark:${baseColor.split(' ')[0].replace('100', '900/40')} ${baseColor.split(' ')[1]} dark:${baseColor.split(' ')[1].replace('700', '300')}`;

                    setTimetable(prev => {
                        const studentEntries = prev.filter(t => t.studentId === student.id);
                        if (studentEntries.length === studentSchedules.length) return prev;

                        const filteredPrev = prev.filter(t => t.studentId !== student.id);
                        const newEntries: TimetableEntry[] = studentSchedules.map(s => ({
                            studentId: student.id,
                            day: s.day,
                            hour: s.time,
                            studentName: student.name.split(' ')[0],
                            color: fullColor,
                            photo: student.photo
                        }));
                        return [...filteredPrev, ...newEntries];
                    });

                    const studentApts = currentAppointmentsState.filter(a => isSameStudent(a, student));
                    const existingAptKeys = new Set(studentApts.map(a => `${toBRDateStr(a.date)}-${a.time}`));

                    studentSchedules.forEach(s => {
                        const targetDay = getNormalizedDayIndex(s.day);
                        if (targetDay === undefined) {
                            console.warn(`[Agendamento Automático] Dia "${s.day}" não reconhecido para o aluno "${student.name}"!`);
                            return;
                        }

                        for (let i = 0; i < 90; i++) {
                            const dateObj = new Date(now);
                            dateObj.setDate(now.getDate() + i);

                            if (dateObj.getDay() === targetDay) {
                                const dateStr = formatDate(dateObj);
                                const aptKey = `${dateStr}-${s.time}`;

                                if (!existingAptKeys.has(aptKey)) {
                                    newAppointmentsToAdd.push({
                                        studentId: student.id,
                                        studentName: student.name,
                                        date: dateStr,
                                        time: s.time,
                                        subject: 'Aula Regular',
                                        status: 'Agendado'
                                    });
                                    existingAptKeys.add(aptKey);
                                }
                            }
                        }
                    });
                });

                console.log(`[Agendamento Automático] Total a criar: ${newAppointmentsToAdd.length}, a deletar: ${allAppointmentsToDelete.length}`);

                // Executar operações no banco apenas se houver alterações reais
                if (allAppointmentsToDelete.length > 0 || newAppointmentsToAdd.length > 0) {
                    try {
                        let updatedList = [...currentAppointmentsState];

                        if (allAppointmentsToDelete.length > 0) {
                            await api.appointments.removeMany(allAppointmentsToDelete);
                        }

                        if (newAppointmentsToAdd.length > 0) {
                            console.log(`[Agendamento Automático] Salvando ${newAppointmentsToAdd.length} novos agendamentos no Supabase...`);
                            const savedApts = await api.appointments.createMany(newAppointmentsToAdd);
                            console.log(`[Agendamento Automático] ${savedApts.length} agendamentos salvos com sucesso no Supabase!`);
                            updatedList = [...updatedList, ...savedApts];
                        }

                        setAppointments(updatedList);
                    } catch (error) {
                        console.error('[Agendamento Automático] ERRO ao salvar agendamentos:', error);
                    }
                }
            } finally {
                isGeneratingRef.current = false;
                if (needsRetryRef.current) {
                    needsRetryRef.current = false;
                    setTimeout(checkAndExtendSchedules, 500);
                }
            }
        };

        const timer = setTimeout(checkAndExtendSchedules, 1000);
        return () => clearTimeout(timer);
    }, [students, appointments, loading, setAppointments, setTimetable]);
};


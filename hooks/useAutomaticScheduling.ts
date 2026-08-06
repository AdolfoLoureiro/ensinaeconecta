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
    // FIX: flag para re-executar caso um novo aluno tenha chegado enquanto geração estava em andamento
    const needsRetryRef = useRef(false);

    useEffect(() => {
        const checkAndExtendSchedules = async () => {
            if (loading || students.length === 0) return;

            // FIX: se já está gerando, sinaliza que precisa de uma nova rodada ao terminar
            if (isGeneratingRef.current) {
                needsRetryRef.current = true;
                return;
            }

            isGeneratingRef.current = true;
            needsRetryRef.current = false;
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

                // [DIAGNÓSTICO] Resumo dos alunos ativos e seus schedules
                console.log('[Agendamento] === INÍCIO DA GERAÇÃO ===');
                console.log(`[Agendamento] Total de alunos: ${students.length}`);
                students.forEach(s => {
                    console.log(`[Agendamento] Aluno: "${s.name}" | status="${s.status}" | schedules=`, JSON.stringify(s.schedules));
                });

                // Passo 2: Adicionar novos agendamentos conforme o horário atual
                students.forEach(student => {
                    if (student.status !== 'Ativo' || !student.schedules || student.schedules.length === 0) {
                        console.log(`[Agendamento] Pulando "${student.name}": status=${student.status}, schedules=`, student.schedules);
                        return;
                    }

                    console.log(`[Agendamento] Processando "${student.name}" com ${student.schedules.length} horário(s):`, student.schedules);

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
                    // FIX: usar apenas chaves exatas (data+hora) para evitar duplicatas,
                    // sem bloquear múltiplos horários no mesmo dia
                    const existingAptKeys = new Set(studentApts.map(a => `${a.date}-${a.time}`));

                    console.log(`[Agendamento] "${student.name}" já tem ${studentApts.length} agendamento(s) existente(s).`);

                    (student.schedules || []).forEach(s => {
                        const targetDay = daysOfWeekMap[s.day];
                        if (targetDay === undefined) {
                            console.warn(`[Agendamento] Dia "${s.day}" não reconhecido para aluno "${student.name}"!`);
                            return;
                        }
                        let countForThisSchedule = 0;
                        for (let i = 0; i < 90; i++) {
                            const dateObj = new Date(now);
                            dateObj.setDate(now.getDate() + i);

                            if (dateObj.getDay() === targetDay) {
                                const dateStr = formatDate(dateObj);
                                const aptKey = `${dateStr}-${s.time}`;

                                // FIX: verificar apenas duplicata exata (mesma data E mesmo horário),
                                // permitindo múltiplos horários de um aluno no mesmo dia
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
                                    countForThisSchedule++;
                                }
                            }
                        }
                        console.log(`[Agendamento] "${student.name}" - ${s.day} ${s.time}: ${countForThisSchedule} novo(s) agendamento(s) a criar.`);
                    });
                });

                console.log(`[Agendamento] Total: ${newAppointmentsToAdd.length} a criar, ${allAppointmentsToDelete.length} a deletar.`);

                // Executar operações no banco (se necessário)
                if (allAppointmentsToDelete.length > 0 || newAppointmentsToAdd.length > 0) {
                    try {
                        // FIX: usar currentAppointmentsState (com exclusões já aplicadas) em vez
                        // do closure antigo de appointments
                        let updatedList = [...currentAppointmentsState];

                        if (allAppointmentsToDelete.length > 0) {
                            console.log(`Sistema: Removendo ${allAppointmentsToDelete.length} agendamentos desatualizados.`);
                            await api.appointments.removeMany(allAppointmentsToDelete);
                        }

                        if (newAppointmentsToAdd.length > 0) {
                            console.log(`Sistema: Salvando ${newAppointmentsToAdd.length} novos agendamentos automáticos.`);
                            const savedApts = await api.appointments.createMany(newAppointmentsToAdd);
                            console.log(`[Agendamento] Salvos com sucesso: ${savedApts.length} agendamentos.`);
                            updatedList = [...updatedList, ...savedApts];
                        }

                        setAppointments(updatedList);
                    } catch (error) {
                        console.error('[Agendamento] ERRO na sincronização automática:', error);
                    }
                }
            } finally {
                isGeneratingRef.current = false;
                // FIX: se um novo aluno chegou durante a geração, aguarda e re-executa
                if (needsRetryRef.current) {
                    needsRetryRef.current = false;
                    setTimeout(checkAndExtendSchedules, 500);
                }
            }
        };

        const timer = setTimeout(checkAndExtendSchedules, 1000);
        return () => clearTimeout(timer);
    }, [students, loading, appointments, setAppointments, setTimetable]);
};

import React, { useState } from 'react';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { Student, Appointment } from '../../types';
import { FormInput, FormSelect } from '../shared';

interface AppointmentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    students: Student[];
    onSave: (apt: Partial<Appointment>) => void; // Partial because ID and status are handled by parent/logic
    selectedDateFormatted: string;
}

export const AppointmentFormModal: React.FC<AppointmentFormModalProps> = ({ isOpen, onClose, students, onSave, selectedDateFormatted }) => {
    const [newApt, setNewApt] = useState({
        studentId: '',
        time: '08:00',
        subject: 'Aula Regular'
    });

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({
            studentId: newApt.studentId,
            time: newApt.time,
            subject: newApt.subject,
            date: selectedDateFormatted
        });
        setNewApt({ studentId: '', time: '08:00', subject: 'Aula Regular' });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                            <CalendarIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Novo Agendamento</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Data Selecionada</label>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300">
                            {selectedDateFormatted}
                        </div>
                    </div>

                    <FormSelect
                        label="Selecionar Aluno"
                        value={newApt.studentId}
                        onChange={value => setNewApt({ ...newApt, studentId: value })}
                        placeholder="Escolha um aluno..."
                        options={students.map(s => ({ value: s.id, label: s.name }))}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            type="time"
                            label="Horário"
                            value={newApt.time}
                            onChange={value => setNewApt({ ...newApt, time: value })}
                        />
                        <FormInput
                            label="Assunto"
                            placeholder="Ex: Reforço"
                            value={newApt.subject}
                            onChange={value => setNewApt({ ...newApt, subject: value })}
                        />
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!newApt.studentId}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-lg ${newApt.studentId ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-400 cursor-not-allowed'
                            }`}
                    >
                        Agendar Aula
                    </button>
                </div>
            </div>
        </div>
    );
};

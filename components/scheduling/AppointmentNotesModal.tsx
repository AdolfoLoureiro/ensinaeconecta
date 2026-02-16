import React, { useState, useEffect } from 'react';
import { X, StickyNote } from 'lucide-react';
import { Appointment } from '../../types';

interface AppointmentNotesModalProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: Appointment | null;
    onSave: (id: string, notes: string) => void;
}

export const AppointmentNotesModal: React.FC<AppointmentNotesModalProps> = ({ isOpen, onClose, appointment, onSave }) => {
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (appointment) {
            setNotes(appointment.notes || '');
        } else {
            setNotes('');
        }
    }, [appointment]);

    if (!isOpen || !appointment) return null;

    const handleSave = () => {
        onSave(appointment.id, notes);
        setNotes('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                            <StickyNote className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Observações da Aula</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="p-8 space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-300">
                            {appointment.studentName.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-white">{appointment.studentName}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{appointment.time} • {appointment.subject}</p>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Notas Pedagógicas / Comportamento</label>
                        <textarea
                            rows={6}
                            placeholder="Descreva o que aconteceu durante a aula, dificuldades encontradas ou pontos positivos do aluno..."
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white transition-all resize-none"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        ></textarea>
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
                        className="px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg"
                    >
                        Salvar Observação
                    </button>
                </div>
            </div>
        </div>
    );
};

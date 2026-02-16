import React, { useState } from 'react';
import { X, GraduationCap, FileText } from 'lucide-react';
import { Student, PerformanceRecord } from '../../types';

interface PerformanceFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    students: Student[];
    onSave: (record: PerformanceRecord) => void;
}

export const PerformanceFormModal: React.FC<PerformanceFormModalProps> = ({ isOpen, onClose, students, onSave }) => {
    const [formData, setFormData] = useState({
        studentId: '',
        title: '',
        type: 'Atividade' as PerformanceRecord['type'],
        score: '',
        maxScore: '10',
        date: new Date().toLocaleDateString('pt-BR')
    });

    if (!isOpen) return null;

    const handleSave = () => {
        const student = students.find(s => s.id === formData.studentId);
        if (!student) return;

        const newRecord: PerformanceRecord = {
            id: Math.random().toString(36).substr(2, 9),
            studentId: student.id,
            studentName: student.name,
            date: formData.date,
            type: formData.type,
            title: formData.title.trim() || undefined,
            score: Number(formData.score),
            maxScore: Number(formData.maxScore)
        };

        onSave(newRecord);

        // Reset basic fields but keep date/type for easier consecutive entry
        setFormData({ ...formData, studentId: '', title: '', score: '' });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                            <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Lançar Resultado</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Selecionar Aluno</label>
                        <select
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white"
                            value={formData.studentId}
                            onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                        >
                            <option value="">Escolha um aluno...</option>
                            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nome / Descrição da Avaliação</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Ex: Simulado ENEM, Prova Bimestral..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white transition-all"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                            >
                                <option value="Atividade">Atividade</option>
                                <option value="Simulado">Simulado</option>
                                <option value="Prova">Prova</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Data</label>
                            <input
                                type="text"
                                placeholder="DD/MM/AAAA"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nota Obtida</label>
                            <input
                                type="number"
                                placeholder="Ex: 8.5"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white"
                                value={formData.score}
                                onChange={e => setFormData({ ...formData, score: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nota Máxima</label>
                            <input
                                type="number"
                                placeholder="Ex: 10"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white"
                                value={formData.maxScore}
                                onChange={e => setFormData({ ...formData, maxScore: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 transition-all">Cancelar</button>
                    <button
                        onClick={handleSave}
                        disabled={!formData.studentId || !formData.score}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-lg ${formData.studentId && formData.score ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-400 cursor-not-allowed'}`}
                    >
                        Salvar Resultado
                    </button>
                </div>
            </div>
        </div>
    );
};

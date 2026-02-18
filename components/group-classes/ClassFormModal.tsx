import React, { useState } from 'react';
import { X } from 'lucide-react';
import { GroupClass } from '../../types';
import { FormInput, FormTextArea } from '../shared';

interface ClassFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (groupClass: GroupClass) => void;
    initialData?: GroupClass;
}

export const ClassFormModal: React.FC<ClassFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        subject: '',
        content: '',
        teacher: '',
        grade: '',
        maxStudents: '20',
        date: new Date().toLocaleDateString('pt-BR'),
        time: '14:00',
        costPerStudent: '',
        teacherPayment: ''
    });

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                subject: initialData.subject,
                content: initialData.content,
                teacher: initialData.teacher,
                grade: initialData.grade,
                maxStudents: initialData.maxStudents.toString(),
                date: initialData.date,
                time: initialData.time,
                costPerStudent: initialData.costPerStudent ? initialData.costPerStudent.toString() : '',
                teacherPayment: initialData.teacherPayment ? initialData.teacherPayment.toString() : ''
            });
        } else {
            setFormData({
                subject: '',
                content: '',
                teacher: '',
                grade: '',
                maxStudents: '20',
                date: new Date().toLocaleDateString('pt-BR'),
                time: '14:00',
                costPerStudent: '',
                teacherPayment: ''
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        const newClass: GroupClass = {
            id: initialData?.id || Math.random().toString(36).substr(2, 9),
            subject: formData.subject,
            content: formData.content,
            teacher: formData.teacher,
            grade: formData.grade,
            maxStudents: Number(formData.maxStudents),
            date: formData.date,
            time: formData.time,
            students: initialData?.students || [],
            costPerStudent: formData.costPerStudent ? parseFloat(formData.costPerStudent) : 0,
            teacherPayment: formData.teacherPayment ? parseFloat(formData.teacherPayment) : 0
        };

        onSave(newClass);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Cadastrar Aulão</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="p-8 space-y-4">
                    <FormInput
                        placeholder="Disciplina (Ex: Matemática, Redação)"
                        value={formData.subject}
                        onChange={value => setFormData({ ...formData, subject: value })}
                    />
                    <FormTextArea
                        placeholder="Conteúdos abordados"
                        value={formData.content}
                        onChange={value => setFormData({ ...formData, content: value })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            placeholder="Professor"
                            value={formData.teacher}
                            onChange={value => setFormData({ ...formData, teacher: value })}
                        />
                        <FormInput
                            placeholder="Série / Público"
                            value={formData.grade}
                            onChange={value => setFormData({ ...formData, grade: value })}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <FormInput
                                type="number"
                                label="Vagas"
                                value={formData.maxStudents}
                                onChange={value => setFormData({ ...formData, maxStudents: value })}
                            />
                        </div>
                        <div className="col-span-2 flex flex-col justify-end">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Data e Hora</label>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <FormInput
                                        placeholder="DD/MM/AAAA"
                                        value={formData.date}
                                        onChange={value => setFormData({ ...formData, date: value })}
                                    />
                                </div>
                                <div className="w-24">
                                    <FormInput
                                        type="time"
                                        value={formData.time}
                                        onChange={value => setFormData({ ...formData, time: value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Campos Financeiros */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Financeiro</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-indigo-500 uppercase ml-1 mb-1 block">Valor por Aluno (R$)</label>
                                <FormInput
                                    type="number"
                                    placeholder="0,00"
                                    value={formData.costPerStudent}
                                    onChange={value => setFormData({ ...formData, costPerStudent: value })}
                                    className="text-emerald-600 dark:text-emerald-400 font-semibold"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-rose-500 uppercase ml-1 mb-1 block">Pagamento Professor (R$)</label>
                                <FormInput
                                    type="number"
                                    placeholder="0,00"
                                    value={formData.teacherPayment}
                                    onChange={value => setFormData({ ...formData, teacherPayment: value })}
                                    className="text-rose-600 dark:text-rose-400 font-semibold"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3 sticky bottom-0 z-10">
                    <button onClick={handleSave} disabled={!formData.subject || !formData.date} className="px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg disabled:opacity-50">Criar Aulão</button>
                </div>
            </div>
        </div>
    );
};

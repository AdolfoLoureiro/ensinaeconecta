import React, { useState, useRef } from 'react';
import { Camera, Calendar, GraduationCap, School, DollarSign, Plus, Trash2, X } from 'lucide-react';
import { Student, ClassSchedule } from '../../types';
import { FormInput, FormSelect } from '../shared';

interface StudentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    isEditing: boolean;
    formData: any;
    setFormData: (data: any) => void;
    photoPreview: string | null;
    setPhotoPreview: (photo: string | null) => void;
    tempSchedules: ClassSchedule[];
    setTempSchedules: (schedules: ClassSchedule[]) => void;
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
    isOpen,
    onClose,
    onSave,
    isEditing,
    formData,
    setFormData,
    photoPreview,
    setPhotoPreview,
    tempSchedules,
    setTempSchedules
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newScheduleDay, setNewScheduleDay] = useState('Segunda');
    const [newScheduleTime, setNewScheduleTime] = useState('14:00');

    if (!isOpen) return null;

    const handlePhotoClick = () => fileInputRef.current?.click();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const addSchedule = () => {
        setTempSchedules([...tempSchedules, { day: newScheduleDay, time: newScheduleTime }]);
    };

    const removeSchedule = (idx: number) => {
        setTempSchedules(tempSchedules.filter((_, i) => i !== idx));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                        {isEditing ? 'Editar Dados do Aluno' : 'Matricular Novo Aluno'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
                <div className="p-8 overflow-y-auto space-y-8">
                    <div className="flex flex-col items-center gap-4">
                        <div onClick={handlePhotoClick} className="w-28 h-28 rounded-3xl border-4 border-slate-50 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shadow-inner flex items-center justify-center cursor-pointer overflow-hidden group relative transition-all">
                            {photoPreview ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 text-slate-400" />}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><span className="text-white text-[10px] font-bold">Alterar Foto</span></div>
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>

                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest border-l-4 border-indigo-600 pl-3">Dados Pessoais e Escolares</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                                placeholder="Nome Completo"
                                value={formData.name}
                                onChange={value => setFormData({ ...formData, name: value })}
                            />
                            <FormInput
                                type="email"
                                placeholder="E-mail"
                                value={formData.email}
                                onChange={value => setFormData({ ...formData, email: value })}
                            />
                            <FormInput
                                placeholder="Telefone"
                                value={formData.phone}
                                onChange={value => setFormData({ ...formData, phone: value })}
                            />

                            <FormInput
                                placeholder="Data de Matrícula (DD/MM/AAAA)"
                                value={formData.registrationDate}
                                onChange={value => setFormData({ ...formData, registrationDate: value })}
                                icon={<Calendar className="w-4 h-4 text-slate-400" />}
                            />

                            <FormInput
                                placeholder="Série Escolar"
                                value={formData.schoolGrade || ''}
                                onChange={value => setFormData({ ...formData, schoolGrade: value })}
                                icon={<GraduationCap className="w-4 h-4 text-slate-400" />}
                            />

                            <div className="md:col-span-1">
                                <FormInput
                                    placeholder="Nome da Escola"
                                    value={formData.schoolName || ''}
                                    onChange={value => setFormData({ ...formData, schoolName: value })}
                                    icon={<School className="w-4 h-4 text-slate-400" />}
                                />
                            </div>

                            <FormInput
                                type="number"
                                placeholder="Valor Mensalidade (R$)"
                                value={formData.monthlyFee || ''}
                                onChange={value => setFormData({ ...formData, monthlyFee: value })}
                                icon={<DollarSign className="w-4 h-4 text-slate-400" />}
                            />

                            <FormSelect
                                value={formData.status}
                                onChange={value => setFormData({ ...formData, status: value as any })}
                                options={[
                                    { value: 'Ativo', label: 'Ativo' },
                                    { value: 'Inativo', label: 'Inativo' }
                                ]}
                            />
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest border-l-4 border-indigo-600 pl-3">Cronograma de Aulas</h3>
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl space-y-4">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="sm:w-1/2">
                                    <FormSelect
                                        value={newScheduleDay}
                                        onChange={value => setNewScheduleDay(value)}
                                        options={['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map(d => ({ value: d, label: d }))}
                                    />
                                </div>
                                <div className="sm:w-1/3">
                                    <FormInput
                                        type="time"
                                        value={newScheduleTime}
                                        onChange={value => setNewScheduleTime(value)}
                                    />
                                </div>
                                <button onClick={addSchedule} className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center self-start mt-1"><Plus className="w-5 h-5" /></button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {tempSchedules.map((s, i) => (
                                    <div key={i} className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded-lg flex items-center gap-3 shadow-sm animate-in zoom-in-95">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{s.day} às {s.time}</span>
                                        <button onClick={() => removeSchedule(i)} className="text-rose-500 hover:bg-rose-50 p-1 rounded-md transition-all"><Trash2 className="w-3 h-3" /></button>
                                    </div>
                                ))}
                                {tempSchedules.length === 0 && <p className="text-xs text-slate-400 italic">Nenhum horário selecionado</p>}
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest border-l-4 border-indigo-600 pl-3">Responsável Financeiro</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <FormInput
                                    placeholder="Nome do Responsável"
                                    value={formData.guardianName || ''}
                                    onChange={value => setFormData({ ...formData, guardianName: value })}
                                />
                            </div>
                            <FormInput
                                placeholder="CPF"
                                value={formData.guardianCpf || ''}
                                onChange={value => setFormData({ ...formData, guardianCpf: value })}
                            />
                            <FormInput
                                placeholder="Telefone do Responsável"
                                value={formData.guardianPhone || ''}
                                onChange={value => setFormData({ ...formData, guardianPhone: value })}
                            />
                            <div className="md:col-span-2">
                                <FormInput
                                    placeholder="Endereço Completo"
                                    value={formData.guardianAddress || ''}
                                    onChange={value => setFormData({ ...formData, guardianAddress: value })}
                                />
                            </div>
                        </div>
                    </section>
                </div>
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100">Cancelar</button>
                    <button onClick={onSave} className="px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg">
                        {isEditing ? 'Salvar Alterações' : 'Salvar Matrícula'}
                    </button>
                </div>
            </div>
        </div>
    );
};

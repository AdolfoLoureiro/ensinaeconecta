import React, { useState } from 'react';
import {
    X,
    Wallet,
    BookOpen,
    Plus,
    UserPlus,
    Check,
    UserX,
    Trash2
} from 'lucide-react';
import { GroupClass, Student, GroupClassStudent } from '../../types';

interface StudentEnrollmentModalProps {
    classData: GroupClass;
    students: Student[];
    onClose: () => void;
    onUpdateClass: (groupClass: GroupClass) => void;
    onDeleteClass: (id: string) => void;
}

export const StudentEnrollmentModal: React.FC<StudentEnrollmentModalProps> = ({
    classData,
    students,
    onClose,
    onUpdateClass,
    onDeleteClass
}) => {
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [externalStudentName, setExternalStudentName] = useState('');

    const handleAddEnrolledStudent = () => {
        if (!selectedStudentId) return;

        const student = students.find(s => s.id === selectedStudentId);
        if (!student) return;

        // Verificar se já está na lista
        if (classData.students.some(s => s.id === student.id)) {
            alert("Aluno já adicionado a este aulão.");
            return;
        }

        // Verificar limite de vagas
        if (classData.students.length >= classData.maxStudents) {
            alert("Turma lotada!");
            return;
        }

        const updatedClass = {
            ...classData,
            students: [...classData.students, { id: student.id, name: student.name, isExternal: false }]
        };

        onUpdateClass(updatedClass);
        setSelectedStudentId('');
    };

    const handleAddExternalStudent = () => {
        if (!externalStudentName.trim()) return;

        // Verificar limite de vagas
        if (classData.students.length >= classData.maxStudents) {
            alert("Turma lotada!");
            return;
        }

        const newExternal: GroupClassStudent = {
            id: Math.random().toString(36).substr(2, 9),
            name: externalStudentName.trim() + " (Externo)",
            isExternal: true
        };

        const updatedClass = {
            ...classData,
            students: [...classData.students, newExternal]
        };

        onUpdateClass(updatedClass);
        setExternalStudentName('');
    };

    const handleUpdateAttendance = (studentId: string, status: 'present' | 'absent') => {
        const updatedStudents = classData.students.map(s =>
            s.id === studentId ? { ...s, attendance: status } : s
        );

        const updatedClass = { ...classData, students: updatedStudents };
        onUpdateClass(updatedClass);
    };

    const handleRemoveStudent = (studentId: string) => {
        const updatedClass = {
            ...classData,
            students: classData.students.filter(s => s.id !== studentId)
        };
        onUpdateClass(updatedClass);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white">{classData.subject}</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Gestão de Participantes • {classData.students.length}/{classData.maxStudents} Vagas</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50 dark:bg-slate-950/30">
                    {/* Resumo Financeiro Rápido no Modal */}
                    <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700">
                        <div className="p-3 rounded-full bg-emerald-50 dark:bg-emerald-900/20">
                            <Wallet className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase">Total Líquido Estimado</p>
                            <p className="text-xl font-black text-slate-800 dark:text-white">
                                {((classData.students.length * (classData.costPerStudent || 0)) - (classData.teacherPayment || 0)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                        </div>
                    </div>

                    {/* Adicionar Alunos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm min-w-0">
                            <h4 className="text-xs font-black uppercase text-indigo-500 mb-3 flex items-center gap-2">
                                <BookOpen className="w-3 h-3" /> Matriculados
                            </h4>
                            <div className="flex gap-2">
                                <select
                                    className="min-w-0 flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm outline-none dark:text-white"
                                    value={selectedStudentId}
                                    onChange={e => setSelectedStudentId(e.target.value)}
                                >
                                    <option value="">Selecione...</option>
                                    {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                                <button onClick={handleAddEnrolledStudent} className="flex-shrink-0 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm min-w-0">
                            <h4 className="text-xs font-black uppercase text-amber-500 mb-3 flex items-center gap-2">
                                <UserPlus className="w-3 h-3" /> Externos
                            </h4>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Nome do aluno..."
                                    className="min-w-0 flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm outline-none dark:text-white"
                                    value={externalStudentName}
                                    onChange={e => setExternalStudentName(e.target.value)}
                                />
                                <button onClick={handleAddExternalStudent} className="flex-shrink-0 p-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all">
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Lista de Participantes */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Lista de Presença</h3>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                            {classData.students.length > 0 ? classData.students.map(student => (
                                <div key={student.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${student.isExternal ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                                            }`}>
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800 dark:text-white text-sm">{student.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">{student.isExternal ? 'Aluno Externo' : 'Matriculado'}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleUpdateAttendance(student.id, 'present')}
                                            className={`p-1.5 rounded-lg transition-all ${student.attendance === 'present'
                                                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                                                : 'text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-500'
                                                }`}
                                            title="Marcar Presença"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleUpdateAttendance(student.id, 'absent')}
                                            className={`p-1.5 rounded-lg transition-all ${student.attendance === 'absent'
                                                ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                                                : 'text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500'
                                                }`}
                                            title="Marcar Ausência"
                                        >
                                            <UserX className="w-4 h-4" />
                                        </button>
                                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                        <button onClick={() => handleRemoveStudent(student.id)} className="p-2 text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all" title="Remover da lista">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-8 text-center text-slate-400 text-sm italic">Nenhum aluno adicionado ainda.</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                    <button onClick={() => onDeleteClass(classData.id)} className="text-rose-500 font-bold text-xs uppercase hover:underline">Excluir Aulão</button>
                    <button onClick={onClose} className="px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg">Concluir</button>
                </div>
            </div>
        </div>
    );
};

import React, { useState, useRef, useEffect } from 'react';
import { Cake, Phone, MoreHorizontal, Edit2, Trash2, FileText } from 'lucide-react';
import { Student } from '../../types';

interface StudentListProps {
    students: Student[];
    onSelect: (student: Student) => void;
    onEdit: (student: Student) => void;
    onDelete: (id: string) => void;
}

export const StudentList: React.FC<StudentListProps> = ({ students, onSelect, onEdit, onDelete }) => {
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpenId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMenuToggle = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setMenuOpenId(menuOpenId === id ? null : id);
    };

    const handleDeleteClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(id);
        setMenuOpenId(null);
    };

    const handleEditClick = (student: Student, e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(student);
        setMenuOpenId(null);
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Aluno</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Contato</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Matrícula</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {students.map((student) => (
                        <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                            <td className="px-6 py-4">
                                <button onClick={() => onSelect(student)} className="flex items-center gap-3 text-left group">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-bold group-hover:ring-2 group-hover:ring-indigo-400 transition-all">
                                        {student.photo ? <img src={student.photo} alt={student.name} className="w-full h-full object-cover" /> : student.name.charAt(0)}
                                    </div>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{student.name}</span>
                                </button>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-1.5"><Cake className="w-3.5 h-3.5" />{student.birthDate || 'N/A'}</div>
                                <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{student.phone}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{student.registrationDate}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${student.status === 'Ativo' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                    {student.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right relative">
                                <button
                                    onClick={(e) => handleMenuToggle(student.id, e)}
                                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-90"
                                >
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>

                                {student.notes && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onSelect(student); }}
                                        className="p-2 text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-90"
                                        title="Ver Observações"
                                    >
                                        <FileText className="w-5 h-5" />
                                    </button>
                                )}

                                {menuOpenId === student.id && (
                                    <div
                                        ref={menuRef}
                                        className="absolute right-6 top-12 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                                    >
                                        <button
                                            onClick={(e) => handleEditClick(student, e)}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors font-medium text-left"
                                        >
                                            <Edit2 className="w-4 h-4 text-indigo-500" />
                                            Editar Dados
                                        </button>
                                        <button
                                            onClick={(e) => handleDeleteClick(student.id, e)}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors font-medium text-left"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Excluir Aluno
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

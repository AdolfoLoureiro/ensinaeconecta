import React from 'react';
import {
    X,
    GraduationCap,
    School,
    Phone,
    Calendar,
    DollarSign,
    Trash2,
    Edit2,
    CheckCircle2,
    UserX,
    FileText
} from 'lucide-react';
import { Student, Appointment } from '../../types';

interface StudentDetailsModalProps {
    selectedStudent: Student | null;
    onClose: () => void;
    onEdit: (student: Student) => void;
    onDelete: (id: string) => void;
    getStudentHistory: (studentId: string) => {
        history: Appointment[];
        stats: { attended: number; missed: number };
    };
}

export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
    selectedStudent,
    onClose,
    onEdit,
    onDelete,
    getStudentHistory
}) => {
    if (!selectedStudent) return null;

    const { history, stats } = getStudentHistory(selectedStudent.id);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col md:flex-row max-h-[90vh] overflow-hidden">
                <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-100 dark:border-slate-800 p-8 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-700 mb-6">
                        {selectedStudent.photo ? <img src={selectedStudent.photo} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">{selectedStudent.name.charAt(0)}</div>}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white text-center">{selectedStudent.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 mb-6">{selectedStudent.birthDate || 'Data de nascimento não informada'}</p>

                    <div className="w-full space-y-4">
                        <div className="detail-item"><GraduationCap className="w-4 h-4 text-indigo-500" /><div className="flex-1"><p className="label">Escolaridade</p><p className="value">{selectedStudent.schoolGrade || 'Não informado'}</p></div></div>
                        <div className="detail-item"><School className="w-4 h-4 text-indigo-500" /><div className="flex-1"><p className="label">Escola</p><p className="value text-xs">{selectedStudent.schoolName || 'Não informado'}</p></div></div>
                        <div className="detail-item"><Phone className="w-4 h-4 text-indigo-500" /><div className="flex-1"><p className="label">Telefone</p><p className="value">{selectedStudent.phone}</p></div></div>
                        <div className="detail-item"><Calendar className="w-4 h-4 text-indigo-500" /><div className="flex-1"><p className="label">Matrícula</p><p className="value">{selectedStudent.registrationDate}</p></div></div>
                        {selectedStudent.monthlyFee && (
                            <div className="detail-item"><DollarSign className="w-4 h-4 text-indigo-500" /><div className="flex-1"><p className="label">Mensalidade</p><p className="value font-bold text-emerald-600 dark:text-emerald-400">R$ {selectedStudent.monthlyFee.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div></div>
                        )}
                    </div>
                    {selectedStudent.guardian && (
                        <div className="w-full mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Responsável</h4>
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{selectedStudent.guardian.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{selectedStudent.guardian.address}</p>
                            </div>
                        </div>
                    )}

                    {selectedStudent.notes && (
                        <div className="w-full mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Observações</h4>
                            <div className="bg-white/50 dark:bg-slate-900/50 p-4 rounded-2xl text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic border border-slate-100 dark:border-slate-800">
                                {selectedStudent.notes}
                            </div>
                        </div>
                    )}

                    <div className="w-full mt-auto pt-8">
                        <button
                            onClick={() => onDelete(selectedStudent.id)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-100 dark:border-rose-900/40"
                        >
                            <Trash2 className="w-4 h-4" />
                            Excluir Aluno
                        </button>
                    </div>
                </div>
                <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-900">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div><h2 className="text-xl font-bold text-slate-800 dark:text-white">Ficha do Aluno</h2><p className="text-xs text-slate-400 font-medium">Histórico e Frequência</p></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onEdit(selectedStudent)}
                                className="p-2.5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                                title="Editar Aluno"
                            >
                                <Edit2 className="w-5 h-5" />
                            </button>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                    </div>
                    <div className="flex-1 p-8 overflow-y-auto">
                        <div className="space-y-6">
                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Presenças (Mês)</span>
                                    </div>
                                    <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.attended}</p>
                                </div>
                                <div className="bg-rose-50 dark:bg-rose-900/10 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <UserX className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                        <span className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">Faltas (Mês)</span>
                                    </div>
                                    <p className="text-3xl font-black text-slate-800 dark:text-white">{stats.missed}</p>
                                </div>
                            </div>

                            {selectedStudent.notes && (
                                <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/20 relative overflow-hidden group">
                                    <div className="flex items-center gap-3 mb-2">
                                        <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                        <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">Observações Importantes</span>
                                    </div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                        {selectedStudent.notes}
                                    </p>
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-amber-500/20 transition-all duration-500"></div>
                                </div>
                            )}

                            <h3 className="text-sm font-bold text-slate-800 dark:text-white mt-4">Histórico de Aulas</h3>
                            <div className="space-y-3">
                                {history.length > 0 ? history.map((item, idx) => (
                                    <div key={idx} className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${item.status === 'Faltou' ? 'bg-rose-50/50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/20' :
                                        item.status === 'Concluído' ? 'bg-white dark:bg-slate-800/40 border-slate-100 dark:border-slate-800' :
                                            'bg-slate-50 dark:bg-slate-800/20 border-slate-100 dark:border-slate-800 opacity-70'
                                        }`}>
                                        <div className="flex items-center gap-4">
                                            <Calendar className={`w-4 h-4 ${item.status === 'Faltou' ? 'text-rose-400' : 'text-slate-400'}`} />
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 dark:text-white">{item.date}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.time} • {item.subject}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status === 'Concluído' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                                            item.status === 'Faltou' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400' :
                                                'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                            }`}>
                                            {item.status === 'Concluído' ? 'Realizada' : item.status}
                                        </span>
                                    </div>
                                )) : (
                                    <div className="text-center py-8 text-slate-400 italic text-sm">Nenhuma aula registrada até o momento.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

import React from 'react';
import { AlertCircle, CheckCircle2, DollarSign, User } from 'lucide-react';
import { Student } from '../../types';

interface PaymentPackageAlertsProps {
    students: Student[];
}

export const PaymentPackageAlerts: React.FC<PaymentPackageAlertsProps> = ({ students }) => {
    // Lógica: 1 aula/semana = 4 aulas no pacote. 2 aulas/semana = 8 aulas.
    const getPackageLimit = (student: Student) => {
        const weeklySessions = student.schedules?.length || 0;
        return weeklySessions * 4;
    };

    const studentsWithAlerts = students
        .filter(student => student.status === 'Ativo')
        .map(student => {
            const attended = student.totalSessionsAttended || 0;
            const limit = getPackageLimit(student);
            const progress = (attended / limit) * 100;
            const isCompleted = attended >= limit;

            return {
                ...student,
                attended,
                limit,
                progress,
                isCompleted
            };
        })
        .filter(s => s.attended > 0) // Só mostra quem já teve aula
        .sort((a, b) => (b.isCompleted ? 1 : 0) - (a.isCompleted ? 1 : 0) || b.progress - a.progress);

    return (
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                        Controle de Pacotes
                        <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    </h2>
                    <p className="text-sm text-slate-400 font-medium whitespace-nowrap">Acompanhamento de renovação de mensalidades</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-800/50 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Fluxo Automático
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 max-h-[320px]">
                {studentsWithAlerts.length > 0 ? (
                    studentsWithAlerts.map((student) => (
                        <div key={student.id} className={`p-4 rounded-2xl border transition-all ${student.isCompleted
                                ? 'bg-rose-50/50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30'
                                : 'bg-slate-50/30 dark:bg-slate-800/20 border-slate-100 dark:border-slate-800/50'
                            }`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${student.isCompleted ? 'bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-400' : 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                                        }`}>
                                        {student.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-white text-sm">{student.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                            {student.schedules?.length} aula(s) por semana
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-black ${student.isCompleted ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-300'}`}>
                                        {student.attended}/{student.limit}
                                    </p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Aulas assistidas</p>
                                </div>
                            </div>

                            <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${student.isCompleted ? 'bg-rose-500' : 'bg-indigo-500'
                                        }`}
                                    style={{ width: `${Math.min(student.progress, 100)}%` }}
                                ></div>
                            </div>

                            {student.isCompleted && (
                                <div className="mt-3 flex items-center gap-2 py-2 px-3 bg-rose-100/50 dark:bg-rose-900/40 rounded-xl">
                                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                    <p className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-tight">
                                        Pacote Concluído! Favor cobrar nova mensalidade.
                                    </p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 opacity-50 space-y-2 py-10">
                        <User className="w-12 h-12" />
                        <p className="text-xs font-bold uppercase tracking-widest">Nenhum progresso de aula no momento</p>
                    </div>
                )}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(148, 163, 184, 0.2);
                    border-radius: 20px;
                }
            `}</style>
        </div>
    );
};

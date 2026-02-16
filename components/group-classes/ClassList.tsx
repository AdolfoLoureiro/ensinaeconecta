import React from 'react';
import {
    Presentation,
    Calendar,
    User,
    GraduationCap,
    DollarSign
} from 'lucide-react';
import { GroupClass } from '../../types';

interface ClassListProps {
    classes: GroupClass[];
    onSelectClass: (groupClass: GroupClass) => void;
    capitalizedMonthLabel: string;
}

export const ClassList: React.FC<ClassListProps> = ({ classes, onSelectClass, capitalizedMonthLabel }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((aula) => {
                const occupancy = (aula.students.length / aula.maxStudents) * 100;

                // Cálculos Financeiros
                const costPerStudent = aula.costPerStudent || 0;
                const teacherPayment = aula.teacherPayment || 0;
                const grossRevenue = aula.students.length * costPerStudent; // Total Arrecadado
                const netRevenue = grossRevenue - teacherPayment; // Lucro Líquido

                return (
                    <div
                        key={aula.id}
                        onClick={() => onSelectClass(aula)}
                        className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group flex flex-col h-full"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-2xl text-indigo-600 dark:text-indigo-400">
                                <Presentation className="w-6 h-6" />
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300">
                                {aula.date} • {aula.time}
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">{aula.subject}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{aula.content}</p>

                        <div className="space-y-2 mb-6 flex-1">
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <User className="w-4 h-4" />
                                Prof. {aula.teacher}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <GraduationCap className="w-4 h-4" />
                                {aula.grade}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <DollarSign className="w-4 h-4" />
                                Valor p/ aluno: {costPerStudent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </div>
                        </div>

                        {/* Resumo Financeiro */}
                        <div className="mb-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Arrecadado</span>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{grossRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Líquido (pós-prof)</span>
                                <span className={`text-xs font-black ${netRevenue >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {netRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2 mt-auto">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                                <span>Ocupação</span>
                                <span className={occupancy >= 100 ? 'text-rose-500' : 'text-emerald-500'}>
                                    {aula.students.length}/{aula.maxStudents} Vagas
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${occupancy >= 100 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                    style={{ width: `${occupancy}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {classes.length === 0 && (
                <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem]">
                    <div className="inline-flex bg-slate-50 dark:bg-slate-800 p-4 rounded-full mb-4">
                        <Calendar className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Nenhum aulão agendado para {capitalizedMonthLabel}.</p>
                </div>
            )}
        </div>
    );
};

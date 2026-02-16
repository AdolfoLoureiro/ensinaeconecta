import React from 'react';
import { ListFilter, ChevronRight, TrendingUp } from 'lucide-react';
import { PerformanceRecord } from '../../types';

interface PerformanceTableProps {
    performanceRecords: PerformanceRecord[];
    onSelectStudent: (studentId: string) => void;
}

export const PerformanceTable: React.FC<PerformanceTableProps> = ({ performanceRecords, onSelectStudent }) => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mt-8 transition-colors">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">Últimos Resultados</h2>
                <button className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <ListFilter className="w-4 h-4" />
                    Filtrar
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Aluno</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Avaliação / Tipo</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Data</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Nota / Total</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Progresso</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {performanceRecords.map((result) => (
                            <tr key={result.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => onSelectStudent(result.studentId)}
                                        className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        {result.studentName}
                                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{result.title || "---"}</p>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{result.type}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">{result.date}</td>
                                <td className="px-6 py-4 font-bold text-slate-800 dark:text-white text-sm">{result.score} / {result.maxScore}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">+1.2</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {performanceRecords.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-slate-400 italic">Nenhum resultado registrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

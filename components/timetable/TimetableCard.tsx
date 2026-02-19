import React from 'react';
import { Clock, MoreHorizontal } from 'lucide-react';
import { TimetableEntry } from '../../types';

interface TimetableCardProps {
    entry: TimetableEntry;
    getInitials: (name: string) => string;
}

export const TimetableCard: React.FC<TimetableCardProps> = ({ entry, getInitials }) => {
    return (
        <div className="group relative bg-white dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-300">
            {/* Indicador de cor lateral */}
            <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r-full ${entry.color.split(' ')[0].replace('bg-', 'bg-').replace('100', '500')}`}></div>

            <div className="pl-2 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-md text-slate-600 dark:text-slate-300">
                        <Clock className="w-3 h-3" />
                        <span className="text-[11px] font-bold">{entry.hour}</span>
                    </div>
                    <button className="text-slate-300 hover:text-indigo-500 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-inner overflow-hidden flex-shrink-0 ${entry.color}`}>
                        {entry.photo ? (
                            <img src={entry.photo} alt={entry.studentName} className="w-full h-full object-cover" />
                        ) : (
                            getInitials(entry.studentName)
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 dark:text-white text-xs line-clamp-1">{entry.studentName}</p>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">AULA Confirmada</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

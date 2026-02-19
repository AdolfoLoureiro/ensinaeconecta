import React from 'react';
import { CalendarDays } from 'lucide-react';
import { TimetableEntry } from '../../types';
import { TimetableCard } from './TimetableCard';

interface TimetableColumnProps {
    day: string;
    timetable: TimetableEntry[];
    getInitials: (name: string) => string;
}

export const TimetableColumn: React.FC<TimetableColumnProps> = ({ day, timetable, getInitials }) => {
    // Filtra e ordena as aulas do dia por horário
    const dayClasses = timetable
        .filter((entry) => entry.day === day)
        .sort((a, b) => a.hour.localeCompare(b.hour));

    const isToday = new Date().toLocaleDateString('pt-BR', { weekday: 'long' }).toLowerCase().includes(day.toLowerCase());

    return (
        <div className={`w-72 flex-shrink-0 flex flex-col rounded-3xl overflow-hidden border transition-colors ${isToday
            ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-900/50'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}>
            {/* Cabeçalho da Coluna */}
            <div className={`p-3 border-b ${isToday
                ? 'border-indigo-100 dark:border-indigo-900/30 bg-indigo-100/50 dark:bg-indigo-900/20'
                : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50'
                }`}>
                <div className="flex items-center justify-between">
                    <h3 className={`font-black text-lg ${isToday ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'
                        }`}>
                        {day}
                    </h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isToday ? 'bg-indigo-200 dark:bg-indigo-500/30 text-indigo-700 dark:text-indigo-200' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                        }`}>
                        {dayClasses.length} {dayClasses.length === 1 ? 'aula' : 'aulas'}
                    </span>
                </div>
            </div>

            {/* Lista de Aulas */}
            <div className="p-3 space-y-2 flex-1 overflow-y-auto min-h-[300px]">
                {dayClasses.length > 0 ? (
                    dayClasses.map((entry, idx) => (
                        <TimetableCard
                            key={`${entry.studentId}-${idx}`}
                            entry={entry}
                            getInitials={getInitials}
                        />
                    ))
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 opacity-60">
                        <CalendarDays className="w-8 h-8 mb-2" />
                        <p className="text-xs font-medium text-center px-4">Livre</p>
                    </div>
                )}
            </div>
        </div>
    );
};

import React from 'react';
import { Clock, ArrowRight, Calendar } from 'lucide-react';
import { Appointment, View } from '../../types';

interface RecentAppointmentsProps {
    appointmentsToday: Appointment[];
    onViewChange: (view: View) => void;
}

export const RecentAppointments: React.FC<RecentAppointmentsProps> = ({ appointmentsToday, onViewChange }) => {
    return (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-800 dark:text-white">Próximas Aulas</h2>
                <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-indigo-600" />
                </div>
            </div>
            <div className="space-y-5 flex-1 overflow-y-auto pr-1">
                {appointmentsToday.length > 0 ? appointmentsToday.slice(0, 5).map((apt, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
                        onClick={() => onViewChange('scheduling')}
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/20 flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400 text-lg">
                                    {apt.studentName.charAt(0)}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm leading-tight group-hover:text-indigo-600 transition-colors">{apt.studentName}</h4>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">{apt.subject}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-black text-slate-800 dark:text-white">{apt.time}</p>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all ml-auto mt-1" />
                        </div>
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Calendar className="w-8 h-8 text-slate-200 dark:text-slate-700 mb-2" />
                        <p className="text-slate-400 italic text-sm font-medium px-4">Tudo calmo por aqui.</p>
                    </div>
                )}
            </div>
            <button
                onClick={() => onViewChange('scheduling')}
                className="mt-8 py-4 w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-[0.15em] hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
                Ver Agenda Completa
            </button>
        </div>
    );
};

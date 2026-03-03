import React from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    CalendarCheck,
    Clock,
    User,
    BookOpen,
    MapPin,
    StickyNote,
    MessageSquareText,
    CheckCircle2,
    UserX,
    Trash2
} from 'lucide-react';
import { Appointment } from '../../types';
import { formatDate } from '../../lib/utils';

interface DailyAgendaProps {
    currentDate: Date;
    onNextDay: () => void;
    onPrevDay: () => void;
    appointments: Appointment[];
    onAddAppointment: () => void;
    onUpdateStatus: (id: string, status: Appointment['status']) => void;
    onOpenNotes: (apt: Appointment) => void;
    onDeleteAppointment: (id: string) => void;
}

export const DailyAgenda: React.FC<DailyAgendaProps> = ({
    currentDate,
    onNextDay,
    onPrevDay,
    appointments,
    onAddAppointment,
    onUpdateStatus,
    onOpenNotes,
    onDeleteAppointment
}) => {
    const formattedDate = formatDate(currentDate);

    // Filter appointments for the "current" view and sort by time
    const dailyAppointments = appointments
        .filter(a => a.date === formattedDate)
        .sort((a, b) => a.time.localeCompare(b.time));

    return (
        <div className="space-y-4">
            {/* Navigation Bar for List */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 mb-2">
                <button onClick={onPrevDay} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-indigo-500" />
                    <span className="font-bold text-slate-700 dark:text-slate-200">{formattedDate}</span>
                </div>
                <button onClick={onNextDay} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {dailyAppointments.length === 0 ? (
                    <div className="p-16 text-center bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
                        <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CalendarCheck className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Nenhuma aula agendada para este dia.</p>
                        <button
                            onClick={onAddAppointment}
                            className="mt-4 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline"
                        >
                            Adicionar agendamento
                        </button>
                    </div>
                ) : (
                    dailyAppointments.map((apt) => (
                        <div key={apt.id} className={`bg-white dark:bg-slate-900 p-6 rounded-[2rem] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in slide-in-from-bottom-2 duration-300 ${apt.status === 'Faltou'
                            ? 'border-slate-100 dark:border-slate-800 opacity-60 bg-slate-50/30'
                            : 'border-slate-100 dark:border-slate-800 shadow-sm hover:border-indigo-100 dark:hover:border-indigo-900'
                            }`}>
                            <div className="flex items-center gap-6">
                                <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl shadow-inner transition-colors ${apt.status === 'Faltou' ? 'bg-slate-100 dark:bg-slate-800' : 'bg-indigo-50 dark:bg-indigo-900/30'
                                    }`}>
                                    <Clock className={`w-5 h-5 mb-1 ${apt.status === 'Faltou' ? 'text-slate-400' : 'text-indigo-500 dark:text-indigo-400'}`} />
                                    <span className={`font-bold text-lg ${apt.status === 'Faltou' ? 'text-slate-500' : 'text-indigo-700 dark:text-indigo-300'}`}>{apt.time}</span>
                                </div>
                                <div className="space-y-1">
                                    <div className={`flex items-center gap-2 font-bold text-lg transition-colors ${apt.status === 'Faltou' ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-slate-200'
                                        }`}>
                                        <User className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                                        {apt.studentName}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-slate-500 dark:text-slate-400 text-sm">
                                        <div className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-slate-400" />{apt.subject}</div>
                                        <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" />Sala 01</div>
                                        {apt.notes && (
                                            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-medium">
                                                <StickyNote className="w-4 h-4" />
                                                Observação
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${apt.status === 'Concluído' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                    apt.status === 'Em andamento' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                                        apt.status === 'Faltou' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                                            'bg-slate-100 dark:bg-slate-800 text-slate-500'
                                    }`}>
                                    {apt.status === 'Concluído' ? 'Realizada' : apt.status}
                                </span>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onOpenNotes(apt)}
                                        className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-100 transition-all border border-slate-200 dark:border-slate-700"
                                        title="Registrar Observação"
                                    >
                                        <MessageSquareText className="w-5 h-5" />
                                    </button>

                                    {apt.status === 'Agendado' && (
                                        <>
                                            <button
                                                onClick={() => onUpdateStatus(apt.id, 'Concluído')}
                                                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-sm hover:bg-emerald-700 text-sm"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                Realizada
                                            </button>
                                            <button
                                                onClick={() => onUpdateStatus(apt.id, 'Faltou')}
                                                className="flex items-center gap-2 px-5 py-2.5 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-bold border border-rose-100 dark:border-rose-900/40 rounded-xl transition-all hover:bg-rose-100 text-sm"
                                                title="Marcar Falta"
                                            >
                                                <UserX className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onDeleteAppointment(apt.id)}
                                                className="p-2.5 bg-white dark:bg-slate-900 text-rose-500 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all border border-slate-200 dark:border-slate-800"
                                                title="Excluir Agendamento"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </>
                                    )}
                                    {apt.status === 'Faltou' && (
                                        <button
                                            onClick={() => onUpdateStatus(apt.id, 'Agendado')}
                                            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-xl transition-all text-sm"
                                        >
                                            Reativar
                                        </button>
                                    )}
                                    {apt.status === 'Concluído' && (
                                        <button
                                            onClick={() => onUpdateStatus(apt.id, 'Agendado')}
                                            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-xl transition-all text-sm"
                                        >
                                            Desfazer
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

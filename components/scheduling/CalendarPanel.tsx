import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Appointment } from '../../types';
import { formatDate } from '../../lib/utils';

interface CalendarPanelProps {
    currentDate: Date;
    onDateChange: (date: Date) => void;
    appointments: Appointment[];
}

export const CalendarPanel: React.FC<CalendarPanelProps> = ({ currentDate, onDateChange, appointments }) => {
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
        return { daysInMonth, firstDayOfMonth, year, month };
    };

    const { daysInMonth, firstDayOfMonth, year, month } = getDaysInMonth(currentDate);
    const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    const hasAppointmentOnDay = (day: number) => {
        const checkDate = formatDate(new Date(year, month, day));
        return appointments.some(a => a.date === checkDate && a.status !== 'Faltou');
    };

    const handleToday = () => {
        onDateChange(new Date());
    };

    const renderCalendarDays = () => {
        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
        }
        // Days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const isSelected = currentDate.getDate() === day && currentDate.getMonth() === month && currentDate.getFullYear() === year;
            const hasApt = hasAppointmentOnDay(day);
            const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

            days.push(
                <button
                    key={day}
                    onClick={() => {
                        const newDate = new Date(currentDate);
                        // Manter ano e mes atuais do calendário, apenas mudar o dia
                        newDate.setFullYear(year);
                        newDate.setMonth(month);
                        newDate.setDate(day);
                        onDateChange(newDate);
                    }}
                    className={`h-10 w-10 rounded-full flex flex-col items-center justify-center text-sm font-semibold transition-all relative
             ${isSelected
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }
             ${isToday && !isSelected ? 'border border-indigo-600 text-indigo-600 dark:text-indigo-400' : ''}
           `}
                >
                    {day}
                    {hasApt && !isSelected && (
                        <span className="absolute bottom-1.5 w-1 h-1 bg-indigo-500 rounded-full"></span>
                    )}
                </button>
            );
        }
        return days;
    };

    // Stats for the selected day
    const formattedDate = formatDate(currentDate);
    const dailyAppointments = appointments.filter(a => a.date === formattedDate);
    const completedCount = dailyAppointments.filter(a => a.status === 'Concluído').length;

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800 dark:text-white capitalize text-lg">{monthName}</h3>
                    <div className="flex gap-1">
                        <button onClick={() => {
                            const d = new Date(currentDate);
                            d.setMonth(d.getMonth() - 1);
                            onDateChange(d);
                        }} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                            <ChevronLeft className="w-5 h-5 text-slate-400" />
                        </button>
                        <button onClick={() => {
                            const d = new Date(currentDate);
                            d.setMonth(d.getMonth() + 1);
                            onDateChange(d);
                        }} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-y-2 place-items-center mb-4">
                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                        <span key={i} className="text-xs font-bold text-slate-300 dark:text-slate-600">{d}</span>
                    ))}
                    {renderCalendarDays()}
                </div>

                <button
                    onClick={handleToday}
                    className="w-full py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                >
                    Voltar para Hoje
                </button>
            </div>

            {/* Quick Stats Summary */}
            <div className="bg-indigo-600 p-6 rounded-[2rem] text-white shadow-xl shadow-indigo-200 dark:shadow-none hidden lg:block">
                <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Resumo do Dia</p>
                <h3 className="text-2xl font-bold mb-4">{dailyAppointments.length} {dailyAppointments.length === 1 ? 'Aula' : 'Aulas'}</h3>
                <div className="w-full bg-indigo-500/30 h-1.5 rounded-full overflow-hidden">
                    <div
                        className="bg-white h-full rounded-full transition-all duration-500"
                        style={{ width: `${(completedCount / (dailyAppointments.length || 1)) * 100}%` }}
                    />
                </div>
                <p className="text-right text-xs mt-2 font-medium opacity-80">
                    {completedCount} concluídas
                </p>
            </div>
        </div>
    );
};

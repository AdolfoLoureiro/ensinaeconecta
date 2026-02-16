import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthNavigatorProps {
    currentDate: Date;
    onDateChange: (date: Date) => void;
    icon?: React.ReactNode;
    label?: string;
}

export const MonthNavigator: React.FC<MonthNavigatorProps> = ({
    currentDate,
    onDateChange,
    icon,
    label
}) => {
    const handlePrevMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        onDateChange(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        onDateChange(newDate);
    };

    const monthLabel = label || currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    const capitalizedMonthLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

    return (
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800">
            <button
                onClick={handlePrevMonth}
                className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-all"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
                {icon}
                <span className="font-bold text-slate-700 dark:text-slate-200 capitalize">
                    {capitalizedMonthLabel}
                </span>
            </div>
            <button
                onClick={handleNextMonth}
                className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-all"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default MonthNavigator;

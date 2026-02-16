import React from 'react';
import { UserPlus, Calendar, Zap } from 'lucide-react';
import { View } from '../../types';

interface QuickActionsProps {
    onViewChange: (view: View) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onViewChange }) => {
    const quickActions = [
        { label: 'Matricular Aluno', icon: UserPlus, view: 'students' as View, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' },
        { label: 'Novo Agendamento', icon: Calendar, view: 'scheduling' as View, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
        { label: 'Lançar Nota', icon: Zap, view: 'performance' as View, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickActions.map((action, idx) => (
                <button
                    key={idx}
                    onClick={() => onViewChange(action.view)}
                    className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-indigo-500 transition-all hover:shadow-lg text-left group"
                >
                    <div className={`p-3 rounded-xl ${action.color} group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{action.label}</span>
                </button>
            ))}
        </div>
    );
};

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    trend?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-4 rounded-2xl ${color} shadow-lg shadow-indigo-200 dark:shadow-none transition-transform group-hover:scale-110`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            {trend && (
                <div className="flex flex-col items-end">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'}`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </span>
                    <span className="text-[8px] text-slate-400 mt-1 uppercase font-bold">vs mês ant.</span>
                </div>
            )}
        </div>
        <div>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</p>
            <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{value}</h3>
        </div>
    </div>
);

export default StatCard;

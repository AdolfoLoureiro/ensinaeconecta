import React from 'react';
import {
    LayoutDashboard,
    Users,
    CalendarCheck,
    CalendarDays,
    CircleDollarSign,
    TrendingUp,
    GraduationCap,
    LogOut,
    Presentation
} from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
    isSidebarOpen: boolean;
    currentView: View;
    setCurrentView: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, currentView, setCurrentView }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'students', label: 'Alunos', icon: Users },
        { id: 'scheduling', label: 'Agendamentos', icon: CalendarCheck },
        { id: 'timetable', label: 'Cronograma', icon: CalendarDays },
        { id: 'groupClasses', label: 'Aulão', icon: Presentation },
        { id: 'finance', label: 'Financeiro', icon: CircleDollarSign },
        { id: 'performance', label: 'Desempenho', icon: TrendingUp },
    ];

    return (
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out flex flex-col fixed h-full z-20 md:relative`}>
            <div className="p-6 flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-200 dark:shadow-none">
                    <GraduationCap className="text-white w-6 h-6" />
                </div>
                {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-indigo-900 dark:text-indigo-400">Ensinaê</span>}
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button key={item.id} onClick={() => setCurrentView(item.id as View)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${currentView === item.id ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-semibold shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-300'}`}>
                            <Icon className="w-5 h-5" />
                            {isSidebarOpen && <span className="text-sm">{item.label}</span>}
                        </button>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                <button className={`w-full flex items-center gap-3 px-3 py-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all`}>
                    <LogOut className="w-5 h-5" />
                    {isSidebarOpen && <span className="text-sm">Sair</span>}
                </button>
            </div>
        </aside>
    );
};

import React from 'react';
import { Appointment } from '../../types';

interface WelcomeBannerProps {
    userName?: string;
    appointmentsToday: Appointment[];
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ userName, appointmentsToday }) => {
    return (
        <div className="relative overflow-hidden bg-indigo-600 dark:bg-indigo-700 rounded-[2rem] p-6 md:p-8 text-white shadow-xl shadow-indigo-500/10 dark:shadow-none min-h-[140px] flex items-center">
            <div className="relative z-10 max-w-xl">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                    Painel do Professor
                </span>
                <h1 className="text-2xl md:text-3xl font-black mb-1 leading-tight">
                    Olá, Prof. {userName?.split(' ')[0] || 'Adolfo'}!
                </h1>
                <p className="text-indigo-100 text-sm font-medium opacity-90 leading-relaxed">
                    Sua jornada educacional hoje conta com <span className="font-bold text-white underline decoration-amber-400 decoration-2 underline-offset-4">{appointmentsToday.length} aulas agendadas</span>.
                </p>
            </div>

            {/* Elemento Decorativo Menor */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 right-8 w-20 h-20 bg-amber-400/10 rounded-full translate-y-1/2 blur-xl"></div>
        </div>
    );
};

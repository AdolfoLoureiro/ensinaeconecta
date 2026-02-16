import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const WeeklyChart: React.FC = () => {
    const chartData = [
        { name: 'Seg', aulas: 4 },
        { name: 'Ter', aulas: 7 },
        { name: 'Qua', aulas: 5 },
        { name: 'Qui', aulas: 8 },
        { name: 'Sex', aulas: 6 },
        { name: 'Sab', aulas: 3 },
    ];

    return (
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-white">Carga Horária Semanal</h2>
                    <p className="text-sm text-slate-400 font-medium">Fluxo de aulas por dia da semana</p>
                </div>
            </div>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                        <Tooltip
                            cursor={{ fill: '#f8fafc', className: 'dark:fill-slate-800/50' }}
                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', background: '#1e293b', color: '#fff', padding: '12px 20px' }}
                            itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                            labelStyle={{ color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }}
                        />
                        <Bar dataKey="aulas" radius={[10, 10, 10, 10]} barSize={28}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 3 ? '#4f46e5' : '#e2e8f0'} className="dark:fill-slate-700 transition-all hover:opacity-80" />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

import React, { useMemo } from 'react';
import {
    X,
    GraduationCap,
    TrendingUp,
    BarChart3,
    Target,
    FileText, // Added import
    Calendar
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { Student, PerformanceRecord } from '../../types';

interface StudentPerformanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentId: string | null;
    students: Student[];
    performanceRecords: PerformanceRecord[];
}

export const StudentPerformanceModal: React.FC<StudentPerformanceModalProps> = ({
    isOpen,
    onClose,
    studentId,
    students,
    performanceRecords
}) => {
    // Dados do Aluno Selecionado
    const selectedStudentData = useMemo(() => {
        if (!studentId) return null;

        const student = students.find(s => s.id === studentId);
        const records = performanceRecords
            .filter(r => r.studentId === studentId)
            // Ordenar por data
            .sort((a, b) => {
                const [da, ma, ya] = a.date.split('/').map(Number);
                const [db, mb, yb] = b.date.split('/').map(Number);
                return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime();
            });

        const average = records.length > 0
            ? records.reduce((acc, curr) => acc + curr.score, 0) / records.length
            : 0;

        const maxScore = records.length > 0
            ? Math.max(...records.map(r => r.score))
            : 0;

        const chartData = records.map(r => ({
            name: r.date.substring(0, 5), // DD/MM
            nota: r.score,
            fullDate: r.date,
            title: r.title
        }));

        return {
            student,
            records,
            average: average.toFixed(1),
            maxScore,
            totalTests: records.length,
            chartData
        };
    }, [studentId, students, performanceRecords]);

    if (!isOpen || !selectedStudentData) return null;

    // Helper para renderizar listas separadas
    const renderRecordList = (title: string, type: PerformanceRecord['type'], icon: React.ReactNode) => {
        const filteredRecords = selectedStudentData?.records.filter(r => r.type === type) || [];

        return (
            <div className="mb-8 last:mb-0">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 ml-2 flex items-center gap-2">
                    {icon}
                    {title}
                </h3>
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                    {filteredRecords.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {filteredRecords.map((record, idx) => (
                                <div key={idx} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl font-bold text-sm min-w-[3.5rem] text-center ${type === 'Simulado' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' :
                                                type === 'Prova' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' :
                                                    'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            }`}>
                                            {record.score}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 dark:text-white text-sm">{record.title || 'Sem título'}</p>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                <Calendar className="w-3 h-3" />
                                                {record.date}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <div className="w-24 bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden ml-auto">
                                            <div
                                                className={`h-full rounded-full ${type === 'Simulado' ? 'bg-indigo-500' :
                                                        type === 'Prova' ? 'bg-rose-500' :
                                                            'bg-emerald-500'
                                                    }`}
                                                style={{ width: `${(record.score / record.maxScore) * 100}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
                                            {Math.round((record.score / record.maxScore) * 100)}% Aproveitamento
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-400 italic text-sm bg-slate-50/50 dark:bg-slate-800/50">
                            Nenhum registro de {title.toLowerCase()} encontrado.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[2.5rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-3xl overflow-hidden shadow-lg border-2 border-white dark:border-slate-700">
                            {selectedStudentData.student?.photo ? (
                                <img src={selectedStudentData.student.photo} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                                    {selectedStudentData.student?.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white">{selectedStudentData.student?.name}</h2>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                                <GraduationCap className="w-4 h-4" />
                                {selectedStudentData.student?.schoolGrade || 'Série não informada'}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <div className="overflow-y-auto p-8 space-y-8 bg-slate-50/50 dark:bg-slate-950/30">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Média Geral</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{selectedStudentData.average}</span>
                                <span className="text-xs font-bold text-slate-400">/ 10</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Avaliações</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-slate-800 dark:text-white">{selectedStudentData.totalTests}</span>
                                <span className="text-xs font-bold text-slate-400">realizadas</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Melhor Nota</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-emerald-500 dark:text-emerald-400">{selectedStudentData.maxScore}</span>
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                            </div>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-indigo-500" />
                            Evolução de Notas
                        </h3>
                        <div className="h-64 w-full">
                            {selectedStudentData.chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={selectedStudentData.chartData}>
                                        <defs>
                                            <linearGradient id="studentColor" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:opacity-10" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} dy={10} />
                                        <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#1e293b', color: '#fff', padding: '12px' }}
                                            itemStyle={{ color: '#fff', fontWeight: 600 }}
                                            labelStyle={{ color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}
                                        />
                                        <Area type="monotone" dataKey="nota" stroke="#6366f1" strokeWidth={4} fill="url(#studentColor)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <p className="text-sm font-medium">Insuficiente dados para gráfico</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Categorized History Lists */}
                    <div className="space-y-8">
                        {renderRecordList('Simulados', 'Simulado', <Target className="w-5 h-5 text-indigo-500" />)}
                        {renderRecordList('Provas', 'Prova', <GraduationCap className="w-5 h-5 text-rose-500" />)}
                        {renderRecordList('Atividades', 'Atividade', <FileText className="w-5 h-5 text-emerald-500" />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

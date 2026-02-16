import React, { useState } from 'react';
import {
  Target,
  Award,
  Plus
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Student, PerformanceRecord } from '../types';
import { PerformanceFormModal } from './performance/PerformanceFormModal';
import { PerformanceTable } from './performance/PerformanceTable';
import { StudentPerformanceModal } from './performance/StudentPerformanceModal';

interface PerformanceProps {
  students: Student[];
  performanceRecords: PerformanceRecord[];
  onAddPerformance: (record: PerformanceRecord) => void;
}

const evolutionData = [
  { name: 'Jan', media: 6.5 },
  { name: 'Fev', media: 7.2 },
  { name: 'Mar', media: 7.0 },
  { name: 'Abr', media: 8.5 },
  { name: 'Mai', media: 8.8 },
  { name: 'Jun', media: 9.2 },
];

const Performance: React.FC<PerformanceProps> = ({ students, performanceRecords, onAddPerformance }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [viewingStudentId, setViewingStudentId] = useState<string | null>(null);

  const handleAddPerformance = (newRecord: PerformanceRecord) => {
    onAddPerformance(newRecord);
    setIsAdding(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Desempenho</h1>
          <p className="text-slate-500 dark:text-slate-400">Acompanhe a evolução acadêmica dos alunos.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95">
            <Plus className="w-5 h-5" />
            Lançar Notas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Evolução Média Geral</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-bold bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg">Mensal</button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={evolutionData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:opacity-10" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                <Tooltip
                  cursor={{ fill: '#f1f5f9', opacity: 0.5 }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#1e293b', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="media" fill="#4f46e5" radius={[8, 8, 8, 8]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-2xl">
                <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Meta Semestral</h4>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold">Média 8.0</p>
              </div>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full w-[85%] rounded-full shadow-lg shadow-indigo-500/20"></div>
            </div>
            <p className="text-right text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-2">85% Alcançado</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 text-sm">Destaques do Mês</h4>
            <div className="space-y-4">
              {[
                { name: 'Ana Beatriz', score: 9.8, img: 'https://i.pravatar.cc/150?u=1' },
                { name: 'Juliana Mendes', score: 9.5, img: 'https://i.pravatar.cc/150?u=2' },
                { name: 'Rodrigo Paes', score: 9.2, img: 'https://i.pravatar.cc/150?u=3' },
              ].map((student, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={student.img} className="w-10 h-10 rounded-full object-cover shadow-sm" alt="" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{student.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    <Award className="w-4 h-4" />
                    {student.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <PerformanceTable
        performanceRecords={performanceRecords}
        onSelectStudent={setViewingStudentId}
      />

      <StudentPerformanceModal
        isOpen={!!viewingStudentId}
        onClose={() => setViewingStudentId(null)}
        studentId={viewingStudentId}
        students={students}
        performanceRecords={performanceRecords}
      />

      {/* MODAL: Lançar Notas */}
      <PerformanceFormModal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        students={students}
        onSave={handleAddPerformance}
      />
    </div>
  );
};

export default Performance;

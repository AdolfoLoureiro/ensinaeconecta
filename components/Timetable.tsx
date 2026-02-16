import React from 'react';
import { TimetableEntry } from '../types';
import { TimetableColumn } from './timetable/TimetableColumn';

interface TimetableProps {
  timetable: TimetableEntry[];
}

const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

const Timetable: React.FC<TimetableProps> = ({ timetable }) => {

  // Função auxiliar para obter as iniciais
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Cronograma Semanal</h1>
          <p className="text-slate-500 dark:text-slate-400">Visualização das aulas por dia da semana.</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-6 min-w-max px-1">
          {days.map((day) => (
            <TimetableColumn
              key={day}
              day={day}
              timetable={timetable}
              getInitials={getInitials}
            />
          ))}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 12px;
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 20px;
          border: 3px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.5);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(71, 85, 105, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Timetable;

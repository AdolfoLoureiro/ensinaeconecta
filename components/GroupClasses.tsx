import React, { useState } from 'react';
import {
   Presentation,
   Plus,
   Calendar
} from 'lucide-react';
import { GroupClass, Student } from '../types';
import { MonthNavigator } from './shared';
import { ClassList } from './group-classes/ClassList';
import { ClassFormModal } from './group-classes/ClassFormModal';
import { StudentEnrollmentModal } from './group-classes/StudentEnrollmentModal';

interface GroupClassesProps {
   groupClasses: GroupClass[];
   students: Student[]; // Lista de alunos matriculados para seleção
   onAddClass: (groupClass: GroupClass) => void;
   onUpdateClass: (groupClass: GroupClass) => void;
   onDeleteClass: (id: string) => void;
}

const GroupClasses: React.FC<GroupClassesProps> = ({
   groupClasses,
   students,
   onAddClass,
   onUpdateClass,
   onDeleteClass
}) => {
   const [currentDate, setCurrentDate] = useState(new Date());
   const [isAdding, setIsAdding] = useState(false);
   const [managingClass, setManagingClass] = useState<GroupClass | null>(null);

   const monthLabel = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
   const capitalizedMonthLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

   // Filtrar aulões pelo mês selecionado
   const currentMonthClasses = groupClasses.filter(gc => {
      const [d, m, y] = gc.date.split('/').map(Number);
      return m === (currentDate.getMonth() + 1) && y === currentDate.getFullYear();
   }).sort((a, b) => {
      // Ordenar por dia
      const [da] = a.date.split('/').map(Number);
      const [db] = b.date.split('/').map(Number);
      return da - db;
   });

   const handleAddClass = (newClass: GroupClass) => {
      onAddClass(newClass);
      setIsAdding(false);
   };

   return (
      <div className="space-y-8 animate-in fade-in duration-500">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
               <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Aulões</h1>
               <p className="text-slate-500 dark:text-slate-400">Gerencie turmas especiais, revisões e aulas em grupo.</p>
            </div>
            <button
               onClick={() => setIsAdding(true)}
               className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-lg"
            >
               <Plus className="w-5 h-5" />
               Novo Aulão
            </button>
         </div>

         {/* Month Navigation */}
         <MonthNavigator
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            icon={<Presentation className="w-5 h-5 text-indigo-500" />}
         />

         {/* Grid de Aulões */}
         <ClassList
            classes={currentMonthClasses}
            onSelectClass={setManagingClass}
            capitalizedMonthLabel={capitalizedMonthLabel}
         />

         {/* MODAL: Novo Aulão */}
         <ClassFormModal
            isOpen={isAdding}
            onClose={() => setIsAdding(false)}
            onSave={handleAddClass}
         />

         {/* MODAL: Gerenciar Alunos */}
         {managingClass && (
            <StudentEnrollmentModal
               classData={managingClass}
               students={students}
               onClose={() => setManagingClass(null)}
               onUpdateClass={(updated) => {
                  onUpdateClass(updated);
                  setManagingClass(updated);
               }}
               onDeleteClass={(id) => {
                  onDeleteClass(id);
                  setManagingClass(null);
               }}
            />
         )}
      </div>
   );
};

export default GroupClasses;

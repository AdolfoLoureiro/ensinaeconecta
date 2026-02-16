import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Appointment, Student } from '../types';
import { CalendarPanel } from './scheduling/CalendarPanel';
import { DailyAgenda } from './scheduling/DailyAgenda';
import { AppointmentFormModal } from './scheduling/AppointmentFormModal';
import { AppointmentNotesModal } from './scheduling/AppointmentNotesModal';

interface SchedulingProps {
  appointments: Appointment[];
  students: Student[];
  onAddAppointment: (apt: Appointment) => void;
  onUpdateStatus: (id: string, status: Appointment['status']) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

const Scheduling: React.FC<SchedulingProps> = ({ appointments, students, onAddAppointment, onUpdateStatus, onUpdateNotes }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notingAptId, setNotingAptId] = useState<string | null>(null);

  const formattedDate = currentDate.toLocaleDateString('pt-BR');

  const handlePrevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const handleSaveAppointment = (partialApt: Partial<Appointment>) => {
    const student = students.find(s => s.id === partialApt.studentId);
    if (!student) return;

    const apt: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: student.id,
      studentName: student.name,
      date: partialApt.date || formattedDate,
      time: partialApt.time || '08:00',
      subject: partialApt.subject || 'Aula Regular',
      status: 'Agendado'
    };

    onAddAppointment(apt);
    setIsAdding(false);
  };

  const handleSaveNotes = (id: string, notes: string) => {
    onUpdateNotes(id, notes);
    setNotingAptId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Agendamentos Diários</h1>
          <p className="text-slate-500 dark:text-slate-400">Acompanhe e gerencie as aulas do dia.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-md w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          Novo Agendamento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Calendar Widget */}
        <div className="lg:col-span-4">
          <CalendarPanel
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            appointments={appointments}
          />
        </div>

        {/* Right Column: List of Appointments */}
        <div className="lg:col-span-8">
          <DailyAgenda
            currentDate={currentDate}
            onPrevDay={handlePrevDay}
            onNextDay={handleNextDay}
            appointments={appointments}
            onAddAppointment={() => setIsAdding(true)}
            onUpdateStatus={onUpdateStatus}
            onOpenNotes={(apt) => setNotingAptId(apt.id)}
          />
        </div>
      </div>

      {/* MODAL: Adicionar Observações */}
      <AppointmentNotesModal
        isOpen={!!notingAptId}
        onClose={() => setNotingAptId(null)}
        appointment={appointments.find(a => a.id === notingAptId) || null}
        onSave={handleSaveNotes}
      />

      {/* MODAL: Adicionar Agendamento */}
      <AppointmentFormModal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        students={students}
        onSave={handleSaveAppointment}
        selectedDateFormatted={formattedDate}
      />
    </div>
  );
};

export default Scheduling;


import React from 'react';
import {
  Users,
  TrendingUp,
  DollarSign,
  Clock
} from 'lucide-react';
import { Student, Appointment, Transaction, View } from '../types';
import { StatCard } from './shared';
import { WelcomeBanner } from './dashboard/WelcomeBanner';
import { QuickActions } from './dashboard/QuickActions';
import { PaymentPackageAlerts } from './dashboard/PaymentPackageAlerts';
import { RecentAppointments } from './dashboard/RecentAppointments';

interface DashboardProps {
  students: Student[];
  appointments: Appointment[];
  transactions: Transaction[];
  userName?: string;
  onViewChange: (view: View) => void;
  legacyMode?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ students, appointments, transactions, userName, onViewChange, legacyMode }) => {
  const today = new Date().toLocaleDateString('pt-BR');
  const appointmentsToday = appointments.filter(a => a.date === today);
  const totalReceived = transactions.filter(t => t.status === 'Pago').reduce((acc, t) => acc + t.amount, 0);

  // VERSÃO LEGACY (Anterior)
  if (legacyMode) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500">{today}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 font-bold uppercase">Alunos</p>
            <h3 className="text-2xl font-bold">{students.length}</h3>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 font-bold uppercase">Aulas Hoje</p>
            <h3 className="text-2xl font-bold">{appointmentsToday.length}</h3>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 font-bold uppercase">Faturamento</p>
            <h3 className="text-2xl font-bold">R$ {totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400 font-bold uppercase">Média</p>
            <h3 className="text-2xl font-bold">8.4</h3>
          </div>
        </div>
      </div>
    );
  }

  // VERSÃO MODERNA (Com banner compactado)
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <WelcomeBanner userName={userName} appointmentsToday={appointmentsToday} />

      <QuickActions onViewChange={onViewChange} />

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total de Alunos" value={students.length} icon={Users} color="bg-indigo-500" trend={12} />
        <StatCard title="Aulas Hoje" value={appointmentsToday.length} icon={Clock} color="bg-amber-500" />
        <StatCard title="Média Acadêmica" value="8.4" icon={TrendingUp} color="bg-emerald-500" trend={5} />
        <StatCard title="Faturamento Mês" value={`R$ ${totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={DollarSign} color="bg-violet-500" trend={8} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <PaymentPackageAlerts students={students} />

        <RecentAppointments appointmentsToday={appointmentsToday} onViewChange={onViewChange} />
      </div>
    </div>
  );
};


export default Dashboard;

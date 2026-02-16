
import React, { useState, useEffect } from 'react';
import {
  Wallet,
  TrendingUp,
  Receipt,
  Plus,
  FileText,
  Trash2,
  CheckCircle,
  MessageSquare,
  Calendar,
  FileCheck,
  PieChart
} from 'lucide-react';
import { Transaction, Student, Appointment } from '../types';
import { UserProfile } from './profile/ProfileModal';
import { MonthNavigator, Modal } from './shared';
import { BalanceModal } from './finance/BalanceModal';
import { NewChargeModal } from './finance/NewChargeModal';
import { MessageModal } from './finance/MessageModal';
import { ReceiptModal } from './finance/ReceiptModal';

interface FinanceProps {
  students: Student[];
  appointments: Appointment[];
  transactions: Transaction[];
  userProfile: UserProfile;
  onAddTransaction: (tx: Transaction) => void;
  onUpdateStatus: (id: string, status: Transaction['status']) => void;
  onDelete: (id: string) => void;
}

const Finance: React.FC<FinanceProps> = ({
  students,
  appointments,
  transactions,
  userProfile,
  onAddTransaction,
  onUpdateStatus,
  onDelete
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState<string | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<string | null>(null);
  const [showBalanceModal, setShowBalanceModal] = useState(false);

  // Month Navigation State
  const [currentDate, setCurrentDate] = useState(new Date());





  // Filter transactions by selected month
  const currentMonthTransactions = transactions.filter(tx => {
    const [d, m, y] = tx.date.split('/').map(Number);
    return m === (currentDate.getMonth() + 1) && y === currentDate.getFullYear();
  });





  const handlePrint = () => {
    window.print();
  };

  const totalReceived = currentMonthTransactions
    .filter(t => t.status === 'Pago')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalPending = currentMonthTransactions
    .filter(t => t.status === 'Pendente')
    .reduce((acc, t) => acc + t.amount, 0);

  const activeTransaction = transactions.find(t => t.id === showReceiptModal);

  const monthLabel = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const capitalizedMonthLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Financeiro</h1>
          <p className="text-slate-500 dark:text-slate-400">Controle suas finanças, mensalidades e cobranças.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowBalanceModal(true)}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            <PieChart className="w-5 h-5" />
            Gerar Balanço
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            <Plus className="w-5 h-5" />
            Nova Cobrança
          </button>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="print:hidden">
        <MonthNavigator
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          icon={<Calendar className="w-4 h-4 text-indigo-500" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
        <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-200 dark:shadow-none transition-transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-white/20 p-2.5 rounded-xl">
              <Wallet className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Total Mensal</span>
          </div>
          <p className="text-indigo-100 text-sm font-medium">Saldo Previsto</p>
          <h3 className="text-3xl font-bold mt-1">R$ {(totalReceived + totalPending).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-50 dark:bg-emerald-500/10 p-2.5 rounded-xl">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Recebido (Mês)</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">R$ {totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-50 dark:bg-amber-500/10 p-2.5 rounded-xl">
              <Receipt className="w-6 h-6 text-amber-500" />
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">A Receber (Mês)</p>
          <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors print:hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Transações de {capitalizedMonthLabel}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Aluno / Descrição</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">Aulas</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {currentMonthTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <FileText className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-700 dark:text-slate-200">{tx.studentName}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{tx.description} {tx.isRecurring && <span className="text-indigo-500 ml-1 font-bold">(Recorrente)</span>}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 font-bold text-center">
                    {tx.classCount || '--'}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tx.status === 'Pago' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setShowMessageModal(tx.id)}
                        className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 transition-all"
                        title="Gerar Mensagem"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>

                      {tx.status === 'Pago' && (
                        <button
                          onClick={() => setShowReceiptModal(tx.id)}
                          className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                          title="Visualizar Recibo"
                        >
                          <FileCheck className="w-4 h-4" />
                        </button>
                      )}

                      {tx.status === 'Pendente' && (
                        <button
                          onClick={() => onUpdateStatus(tx.id, 'Pago')}
                          className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 transition-all"
                          title="Marcar como Pago"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(tx.id)}
                        className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-100 transition-all"
                        title="Excluir Cobrança"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentMonthTransactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 italic">Nenhuma cobrança registrada neste mês.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Balanço Mensal */}
      <BalanceModal
        isOpen={showBalanceModal}
        onClose={() => setShowBalanceModal(false)}
        onPrint={handlePrint}
        monthLabel={monthLabel}
        totalReceived={totalReceived}
        totalPending={totalPending}
        transactions={currentMonthTransactions}
      />

      <NewChargeModal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        students={students}
        appointments={appointments}
        onAddTransaction={onAddTransaction}
      />

      <MessageModal
        isOpen={!!showMessageModal}
        onClose={() => setShowMessageModal(null)}
        transaction={transactions.find(t => t.id === showMessageModal)}
        student={students.find(s => s.id === transactions.find(t => t.id === showMessageModal)?.studentId)}
        userProfile={userProfile}
      />

      <ReceiptModal
        isOpen={!!showReceiptModal && !!activeTransaction}
        onClose={() => setShowReceiptModal(null)}
        onPrint={handlePrint}
        transaction={activeTransaction}
        students={students}
        userProfile={userProfile}
      />

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-content, #receipt-content * {
            visibility: visible;
          }
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 2cm;
          }
          #balance-content, #balance-content * {
            visibility: visible;
          }
          #balance-content {
             position: absolute;
             left: 0;
             top: 0;
             width: 100%;
             margin: 0;
             padding: 2cm;
          }
          .dark {
            background-color: white !important;
            color: black !important;
          }
          .dark #receipt-content, .dark #balance-content {
            background-color: white !important;
            color: black !important;
          }
        }
      `}</style>
    </div >
  );
};

export default Finance;

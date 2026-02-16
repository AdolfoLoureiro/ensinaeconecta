import React from 'react';
import { PieChart, Printer, Wallet, TrendingUp } from 'lucide-react';
import { Modal } from '../shared';
import { Transaction } from '../../types';

interface BalanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPrint: () => void;
    monthLabel: string;
    totalReceived: number;
    totalPending: number;
    transactions: Transaction[];
}

export const BalanceModal: React.FC<BalanceModalProps> = ({
    isOpen,
    onClose,
    onPrint,
    monthLabel,
    totalReceived,
    totalPending,
    transactions
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Balanço Mensal"
            maxWidth="2xl"
            showFooter
            footerContent={
                <div className="flex flex-wrap justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 transition-all"
                    >
                        Fechar
                    </button>
                    <button
                        onClick={onPrint}
                        className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg"
                    >
                        <Printer className="w-4 h-4" />
                        Imprimir Relatório
                    </button>
                </div>
            }
        >
            <div className="p-10 space-y-8" id="balance-content">
                {/* Header do Balanço */}
                <div className="flex justify-between items-start border-b-2 border-slate-100 dark:border-slate-800 pb-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-600 p-3 rounded-2xl">
                            <PieChart className="text-white w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-indigo-900 dark:text-indigo-400">Ensinaê Financeiro</h3>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Relatório de Desempenho</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-black text-slate-300 dark:text-slate-600 uppercase tracking-tighter">Referência</p>
                        <p className="text-lg font-bold text-slate-800 dark:text-white capitalize">{monthLabel}</p>
                    </div>
                </div>

                {/* Resumo do Balanço */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
                        <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Total Recebido</p>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white">R$ {totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/20">
                        <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-1">Pendente</p>
                        <h3 className="text-2xl font-black text-slate-800 dark:text-white">R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                    </div>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-1.5 rounded-full">
                            <Wallet className="text-white w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-widest">Saldo Previsto Total</span>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-black text-indigo-700 dark:text-indigo-400">R$ {(totalReceived + totalPending).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </div>

                <div className="pt-6">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Detalhamento do Mês</h4>
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                <th className="py-2 text-slate-400 font-bold uppercase text-[10px]">Data</th>
                                <th className="py-2 text-slate-400 font-bold uppercase text-[10px]">Aluno</th>
                                <th className="py-2 text-slate-400 font-bold uppercase text-[10px] text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {transactions.map(tx => (
                                <tr key={tx.id}>
                                    <td className="py-3 text-slate-600 dark:text-slate-300 font-medium">{tx.date.substring(0, 5)}</td>
                                    <td className="py-3 text-slate-800 dark:text-white font-bold">{tx.studentName}</td>
                                    <td className="py-3 text-right font-mono text-slate-600 dark:text-slate-300">R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="pt-8 text-center space-y-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Relatório Gerado em {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </Modal>
    );
};

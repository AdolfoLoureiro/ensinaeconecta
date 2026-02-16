import React from 'react';
import { GraduationCap, CheckCircle, Download, Share2 } from 'lucide-react';
import { Modal } from '../shared';
import { Transaction, Student } from '../../types';
import { UserProfile } from '../profile/ProfileModal';

interface ReceiptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPrint: () => void;
    transaction: Transaction | undefined;
    students: Student[];
    userProfile: UserProfile;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
    isOpen,
    onClose,
    onPrint,
    transaction,
    students,
    userProfile
}) => {
    if (!transaction) return null;

    const handleShare = () => {
        const text = `Comprovante Ensinaê: ${transaction.studentName} - ${transaction.description} - R$ ${transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. Veja seu recibo anexo.`;
        navigator.clipboard.writeText(text);
        alert("Link do recibo simulado copiado para compartilhar!");
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Recibo de Pagamento"
            maxWidth="2xl"
            showFooter
            footerContent={
                <div className="flex flex-wrap justify-end gap-3">
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <Share2 className="w-4 h-4" />
                        Compartilhar
                    </button>
                    <button
                        onClick={onPrint}
                        className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg"
                    >
                        <Download className="w-4 h-4" />
                        Gerar PDF / Imprimir
                    </button>
                </div>
            }
        >
            <div className="p-10 space-y-8" id="receipt-content">
                {/* Header do Recibo */}
                <div className="flex justify-between items-start border-b-2 border-slate-100 dark:border-slate-800 pb-8">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-600 p-3 rounded-2xl">
                            <GraduationCap className="text-white w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-indigo-900 dark:text-indigo-400">Ensinaê</h3>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">Educação & Tecnologia</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-black text-slate-300 dark:text-slate-600 uppercase tracking-tighter">Recibo Nº</p>
                        <p className="text-lg font-bold text-slate-800 dark:text-white">#{transaction.id.toUpperCase()}</p>
                    </div>
                </div>

                {/* Corpo do Recibo */}
                <div className="space-y-6">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Recebemos de</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-white">{transaction.studentName}</p>
                        {students.find(s => s.id === transaction.studentId)?.guardian && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Responsável: <span className="font-semibold">{students.find(s => s.id === transaction.studentId)?.guardian?.name}</span>
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-8 py-6 border-y border-slate-50 dark:border-slate-800">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Referente a</p>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{transaction.description}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{transaction.classCount} aulas realizadas</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Data de Emissão</p>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{transaction.date}</p>
                        </div>
                    </div>

                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-500 p-1.5 rounded-full">
                                <CheckCircle className="text-white w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Pago integralmente</span>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Valor Total</p>
                            <p className="text-3xl font-black text-indigo-700 dark:text-indigo-400">R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                </div>

                {/* Assinatura Simbolica */}
                <div className="pt-12 text-center space-y-2">
                    <div className="w-48 h-px bg-slate-200 dark:bg-slate-700 mx-auto" />
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{userProfile.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ensinaê - Gestão Pedagógica</p>
                </div>
            </div>
        </Modal>
    );
};

import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle } from 'lucide-react';
import { Modal } from '../shared';
import { Student, Appointment, Transaction } from '../../types';

interface NewChargeModalProps {
    isOpen: boolean;
    onClose: () => void;
    students: Student[];
    appointments: Appointment[];
    onAddTransaction: (tx: Transaction) => void;
}

export const NewChargeModal: React.FC<NewChargeModalProps> = ({
    isOpen,
    onClose,
    students,
    appointments,
    onAddTransaction
}) => {
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [amount, setAmount] = useState<number | string>('');
    const [isRecurring, setIsRecurring] = useState(false);
    const [calculatedClasses, setCalculatedClasses] = useState<number | string>(0);

    // Auto-calculate classes and fill amount when student is selected
    useEffect(() => {
        if (selectedStudentId) {
            const student = students.find(s => s.id === selectedStudentId);
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();

            const count = appointments.filter(apt => {
                if (apt.studentId !== selectedStudentId) return false;
                const [d, m, y] = apt.date.split('/').map(Number);
                return m === currentMonth && y === currentYear && apt.status !== 'Faltou';
            }).length;

            setCalculatedClasses(count);

            // Auto-fill amount from student's monthly fee
            if (student && student.monthlyFee) {
                setAmount(student.monthlyFee);
            } else {
                setAmount('');
            }
        } else {
            setCalculatedClasses(0);
            setAmount('');
        }
    }, [selectedStudentId, appointments, students]);

    // Reset form when closed
    useEffect(() => {
        if (!isOpen) {
            setSelectedStudentId('');
            setAmount('');
            setIsRecurring(false);
            setCalculatedClasses(0);
        }
    }, [isOpen]);

    const handleCreateCharge = () => {
        const student = students.find(s => s.id === selectedStudentId);
        if (!student) return;

        const currentMonthName = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date());
        const capitalizedMonth = currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1);

        const newTx: Transaction = {
            id: Math.random().toString(36).substr(2, 9),
            studentId: student.id,
            studentName: student.name,
            amount: Number(amount),
            date: new Date().toLocaleDateString('pt-BR'),
            status: 'Pendente',
            description: `Mensalidade ${capitalizedMonth}`,
            classCount: Number(calculatedClasses),
            isRecurring: isRecurring
        };

        onAddTransaction(newTx);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Nova Cobrança"
            maxWidth="lg"
            showFooter
            footerContent={
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleCreateCharge}
                        disabled={!selectedStudentId || !amount}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-lg flex items-center gap-2 whitespace-nowrap ${selectedStudentId && amount ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-400 cursor-not-allowed'
                            }`}
                    >
                        <CheckCircle className="w-4 h-4" />
                        Gerar Cobrança
                    </button>
                </div>
            }
        >
            <div className="p-8 space-y-6">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Selecionar Aluno</label>
                    <select
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white"
                        value={selectedStudentId}
                        onChange={e => setSelectedStudentId(e.target.value)}
                    >
                        <option value="">Escolha um aluno...</option>
                        {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>

                {selectedStudentId && (
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-2">
                        <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-sm">
                            <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1">
                            <label className="text-[10px] font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-tighter block mb-1">Aulas identificadas no mês (Editável)</label>
                            <input
                                type="number"
                                className="w-full bg-transparent border-none p-0 text-xl font-black text-indigo-600 dark:text-indigo-400 focus:ring-0"
                                value={calculatedClasses}
                                onChange={e => setCalculatedClasses(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Valor Total (R$)</label>
                    <input
                        type="number"
                        placeholder="Ex: 450.00"
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                </div>

                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${isRecurring ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-all transform ${isRecurring ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                    <input type="checkbox" className="hidden" checked={isRecurring} onChange={e => setIsRecurring(e.target.checked)} />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">Cobrança Recorrente (Salvar valor padrão)</span>
                </label>
            </div>
        </Modal>
    );
};

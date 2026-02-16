import React from 'react';
import { Send } from 'lucide-react';
import { Modal } from '../shared';
import { Transaction, Student } from '../../types';
import { UserProfile } from '../profile/ProfileModal';

interface MessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | undefined;
    student: Student | undefined;
    userProfile: UserProfile;
}

export const MessageModal: React.FC<MessageModalProps> = ({
    isOpen,
    onClose,
    transaction,
    student,
    userProfile
}) => {
    const generateMessage = () => {
        if (!transaction || !student) return '';

        const guardianName = student?.guardian?.name || "Responsável";
        const dateFormatted = transaction.date;

        let message = `Olá, ${guardianName}! Seguem os dados para o acerto das aulas de ${transaction.studentName.split(' ')[0]} referente ao período de ${transaction.description.split(' ')[1]}:

📅 Data: ${dateFormatted}
📖 Aulas realizadas: ${transaction.classCount || '---'}
💰 Valor Total: R$ ${transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        if (userProfile.pixKey) {
            message += `\n\n🔑 PIX para pagamento:\n${userProfile.pixKey}`;
        }

        message += `\n\nQualquer dúvida estou à disposição. Abraços!`;

        return message;
    };

    const handleCopyToClipboard = () => {
        const message = generateMessage();
        if (message) {
            navigator.clipboard.writeText(message);
            alert("Mensagem copiada para a área de transferência!");
            onClose();
        }
    };

    const messageContent = generateMessage();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Mensagem Automática"
            maxWidth="lg"
            showFooter
            footerContent={
                <div className="flex justify-end gap-3">
                    <button
                        onClick={handleCopyToClipboard}
                        className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg"
                    >
                        <Send className="w-4 h-4" />
                        Copiar para Enviar
                    </button>
                </div>
            }
        >
            <div className="p-8">
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 font-mono text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                    {messageContent}
                </div>
            </div>
        </Modal>
    );
};

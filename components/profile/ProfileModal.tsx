import React, { useRef, useState, useEffect } from 'react';
import { Camera, User as UserIcon, Briefcase, CreditCard } from 'lucide-react';
import { Modal, FormInput } from '../shared';

export interface UserProfile {
    name: string;
    role: string;
    photo: string;
    pixKey?: string;
}

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userProfile: UserProfile;
    onSave: (profile: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, userProfile, onSave }) => {
    const [tempProfile, setTempProfile] = useState<UserProfile>(userProfile);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTempProfile(userProfile);
    }, [userProfile, isOpen]);

    const handleSave = () => {
        onSave(tempProfile);
        onClose();
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setTempProfile(prev => ({ ...prev, photo: reader.result as string }));
            reader.readAsDataURL(file);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Editar Perfil"
            maxWidth="md"
            showFooter
            footerContent={
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-10 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.15em] text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none"
                    >
                        Salvar Perfil
                    </button>
                </div>
            }
        >
            <div className="p-8 space-y-8">
                {/* Foto e Upload */}
                <div className="flex flex-col items-center gap-4">
                    <div onClick={() => fileInputRef.current?.click()} className="relative group cursor-pointer">
                        <div className="w-28 h-28 rounded-[2rem] overflow-hidden ring-4 ring-indigo-50 dark:ring-indigo-900/30 group-hover:ring-indigo-100 transition-all shadow-lg">
                            <img src={tempProfile.photo} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-[2rem] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Toque para alterar a foto</p>
                </div>

                {/* Campos do Formulário */}
                <div className="space-y-5">
                    <FormInput
                        label="Nome Completo"
                        placeholder="Ex: Adolfo Silva"
                        value={tempProfile.name}
                        onChange={value => setTempProfile({ ...tempProfile, name: value })}
                        icon={<UserIcon className="w-4 h-4 text-indigo-400" />}
                    />

                    <FormInput
                        label="Cargo / Função"
                        placeholder="Ex: Professor de Matemática"
                        value={tempProfile.role}
                        onChange={value => setTempProfile({ ...tempProfile, role: value })}
                        icon={<Briefcase className="w-4 h-4 text-indigo-400" />}
                    />

                    <div className="space-y-1.5">
                        <FormInput
                            label="Dados Bancários / Chave PIX"
                            placeholder="CPF, E-mail, Celular ou Ag/Conta"
                            value={tempProfile.pixKey || ''}
                            onChange={value => setTempProfile({ ...tempProfile, pixKey: value })}
                            icon={<CreditCard className="w-4 h-4 text-indigo-400" />}
                            className="bg-indigo-50/30 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30"
                        />
                        <p className="text-[9px] text-indigo-500 font-bold ml-1">Estes dados serão incluídos nas mensagens de cobrança.</p>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

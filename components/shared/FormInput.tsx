import React from 'react';

interface FormInputProps {
    label?: string;
    type?: 'text' | 'number' | 'email' | 'password' | 'date' | 'time';
    placeholder?: string;
    value: string | number;
    onChange: (value: string) => void;
    icon?: React.ReactNode;
    error?: string;
    className?: string;
    disabled?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    icon,
    error,
    className = '',
    disabled = false
}) => {
    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    onWheel={(e) => e.currentTarget.blur()}
                    className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${error ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                        } text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                />
            </div>
            {error && (
                <p className="text-xs text-rose-500 ml-1">{error}</p>
            )}
        </div>
    );
};

export default FormInput;

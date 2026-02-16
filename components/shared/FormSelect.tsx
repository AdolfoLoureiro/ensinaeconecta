import React from 'react';

interface Option {
    value: string | number;
    label: string;
}

interface FormSelectProps {
    label?: string;
    value: string | number;
    onChange: (value: string) => void;
    options: Option[];
    icon?: React.ReactNode;
    error?: string;
    className?: string;
    disabled?: boolean;
    placeholder?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
    label,
    value,
    onChange,
    options,
    icon,
    error,
    className = '',
    disabled = false,
    placeholder = 'Selecione...'
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
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-10 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${error ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                        } text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none`}
                >
                    <option value="" disabled>{placeholder}</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {/* Custom arrow icon could go here if we wanted to hide default appearance completely */}
            </div>
            {error && (
                <p className="text-xs text-rose-500 ml-1">{error}</p>
            )}
        </div>
    );
};

export default FormSelect;

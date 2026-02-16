import React from 'react';

interface FormTextAreaProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    rows?: number;
    error?: string;
    className?: string;
    disabled?: boolean;
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({
    label,
    placeholder,
    value,
    onChange,
    rows = 3,
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
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                disabled={disabled}
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border ${error ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                    } text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none`}
            />
            {error && (
                <p className="text-xs text-rose-500 ml-1">{error}</p>
            )}
        </div>
    );
};

export default FormTextArea;

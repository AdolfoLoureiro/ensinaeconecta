import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { FormInput } from './shared';
import { LogIn, UserPlus, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

export const Auth: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert('Cadastro realizado! Verifique seu e-mail para confirmar.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro ao tentar autenticar.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                <div className="p-8 text-center bg-indigo-600 dark:bg-indigo-900/50">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-white mb-2">
                        {isSignUp ? 'Criar Conta' : 'Bem-vindo de volta!'}
                    </h1>
                    <p className="text-indigo-100 text-sm font-medium">
                        {isSignUp ? 'Preencha os dados para começar' : 'Faça login para acessar sua conta'}
                    </p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleAuth} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/50 rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-rose-600 dark:text-rose-300 font-medium">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <FormInput
                                type="email"
                                placeholder="Seu e-mail"
                                value={email}
                                onChange={setEmail}
                                icon={<Mail className="w-4 h-4 text-slate-400" />}
                                className="bg-slate-50 dark:bg-slate-800/50"
                            />
                            <FormInput
                                type="password"
                                placeholder="Sua senha"
                                value={password}
                                onChange={setPassword}
                                icon={<Lock className="w-4 h-4 text-slate-400" />}
                                className="bg-slate-50 dark:bg-slate-800/50"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                                    {isSignUp ? 'Cadastrar' : 'Entrar'}
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="ml-2 font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                {isSignUp ? 'Fazer Login' : 'Criar conta'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

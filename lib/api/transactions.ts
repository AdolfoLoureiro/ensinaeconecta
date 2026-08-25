import { supabase } from '../supabase';
import { Transaction } from '../../types';
import { mapTransactionFromDB, mapTransactionToDB } from './mappings';

export const transactionsApi = {
    async list(): Promise<Transaction[]> {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;
        return data.map(mapTransactionFromDB);
    },
    async create(tx: Omit<Transaction, 'id'>): Promise<Transaction> {
        const { data: { user } } = await supabase.auth.getUser();
        const dbTx = {
            ...mapTransactionToDB(tx),
            ...(user?.id ? { user_id: user.id } : {})
        };
        const { data, error } = await supabase
            .from('transactions')
            .insert(dbTx)
            .select()
            .single();

        if (error) throw error;
        return mapTransactionFromDB(data);
    },
    async updateStatus(id: string, status: Transaction['status']): Promise<void> {
        const { error } = await supabase
            .from('transactions')
            .update({ status })
            .eq('id', id);
        if (error) throw error;
    },
    async remove(id: string): Promise<void> {
        const { error } = await supabase.from('transactions').delete().eq('id', id);
        if (error) throw error;
    }
};

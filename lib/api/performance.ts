import { supabase } from '../supabase';
import { PerformanceRecord } from '../../types';
import { mapPerformanceFromDB, mapPerformanceToDB } from './mappings';

export const performanceApi = {
    async list(): Promise<PerformanceRecord[]> {
        const { data, error } = await supabase
            .from('performance_records')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;
        return data.map(mapPerformanceFromDB);
    },
    async create(record: Omit<PerformanceRecord, 'id'>): Promise<PerformanceRecord> {
        const { data: { user } } = await supabase.auth.getUser();
        const dbRecord = {
            ...mapPerformanceToDB(record),
            ...(user?.id ? { user_id: user.id } : {})
        };
        const { data, error } = await supabase
            .from('performance_records')
            .insert(dbRecord)
            .select()
            .single();

        if (error) throw error;
        return mapPerformanceFromDB(data);
    },
    async remove(id: string): Promise<void> {
        const { error } = await supabase.from('performance_records').delete().eq('id', id);
        if (error) throw error;
    }
};

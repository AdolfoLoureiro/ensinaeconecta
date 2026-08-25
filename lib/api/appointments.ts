import { supabase } from '../supabase';
import { Appointment } from '../../types';
import { mapAppointmentFromDB, mapAppointmentToDB } from './mappings';

export const appointmentsApi = {
    async list(): Promise<Appointment[]> {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .order('date', { ascending: true });

        if (error) throw error;
        return data.map(mapAppointmentFromDB);
    },
    async create(apt: Omit<Appointment, 'id'>): Promise<Appointment> {
        const { data: { user } } = await supabase.auth.getUser();
        const dbApt = {
            ...mapAppointmentToDB(apt),
            ...(user?.id ? { user_id: user.id } : {})
        };
        const { data, error } = await supabase
            .from('appointments')
            .insert(dbApt)
            .select()
            .single();

        if (error) throw error;
        return mapAppointmentFromDB(data);
    },
    async createMany(apts: Omit<Appointment, 'id'>[]): Promise<Appointment[]> {
        if (apts.length === 0) return [];
        const { data: { user } } = await supabase.auth.getUser();
        const dbApts = apts.map(apt => ({
            ...mapAppointmentToDB(apt),
            ...(user?.id ? { user_id: user.id } : {})
        }));
        
        // Usar upsert com ignoreDuplicates: true para evitar status HTTP 409 no PostgREST/Console
        const { data, error } = await supabase
            .from('appointments')
            .upsert(dbApts, { ignoreDuplicates: true })
            .select();

        if (error) {
            console.error('[API] Erro ao salvar agendamentos:', error);
            throw error;
        }

        return (data || []).map(mapAppointmentFromDB);
    },
    async update(apt: Appointment): Promise<Appointment> {
        const { data, error } = await supabase
            .from('appointments')
            .update(mapAppointmentToDB(apt))
            .eq('id', apt.id)
            .select()
            .single();

        if (error) throw error;
        return mapAppointmentFromDB(data);
    },
    async remove(id: string): Promise<void> {
        const { error } = await supabase.from('appointments').delete().eq('id', id);
        if (error) throw error;
    },
    async removeMany(ids: string[]): Promise<void> {
        const { error } = await supabase.from('appointments').delete().in('id', ids);
        if (error) throw error;
    },
    async updateStatus(id: string, status: Appointment['status']): Promise<void> {
        const { error } = await supabase
            .from('appointments')
            .update({ status })
            .eq('id', id);
        if (error) throw error;
    },
    async updateNotes(id: string, notes: string): Promise<void> {
        const { error } = await supabase
            .from('appointments')
            .update({ notes })
            .eq('id', id);
        if (error) throw error;
    }
};

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
        const { data, error } = await supabase
            .from('appointments')
            .insert(mapAppointmentToDB(apt))
            .select()
            .single();

        if (error) throw error;
        return mapAppointmentFromDB(data);
    },
    async createMany(apts: Omit<Appointment, 'id'>[]): Promise<Appointment[]> {
        if (apts.length === 0) return [];
        const dbApts = apts.map(mapAppointmentToDB);
        
        // Tenta inserir todos de uma vez (lote)
        const { data, error } = await supabase
            .from('appointments')
            .insert(dbApts)
            .select();

        if (!error && data) {
            return data.map(mapAppointmentFromDB);
        }

        // Se falhar (ex: conflito 409), insere um por um para não perder os válidos
        console.warn('[API] Falha no insert em lote (possível duplicata). Inserindo um a um...', error);
        const successfulApts: Appointment[] = [];
        
        for (const dbApt of dbApts) {
            const { data: singleData, error: singleError } = await supabase
                .from('appointments')
                .insert(dbApt)
                .select()
                .single();
                
            if (!singleError && singleData) {
                successfulApts.push(mapAppointmentFromDB(singleData));
            } else if (singleError?.code !== '23505') { 
                // Loga apenas se NÃO for erro de duplicata
                console.error(`[API] Erro ao salvar agendamento de ${dbApt.student_name} (${dbApt.date} ${dbApt.time}):`, singleError);
            }
        }
        
        return successfulApts;
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

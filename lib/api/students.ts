import { supabase } from '../supabase';
import { Student } from '../../types';
import { mapStudentFromDB, mapStudentToDB } from './mappings';

export const studentsApi = {
    async list(): Promise<Student[]> {
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .order('name');

        if (error) throw error;
        return data.map(mapStudentFromDB);
    },

    async create(student: Omit<Student, 'id'>): Promise<Student> {
        const { data: { user } } = await supabase.auth.getUser();
        const dbStudent = {
            ...mapStudentToDB(student),
            ...(user?.id ? { user_id: user.id } : {})
        };
        const { data, error } = await supabase
            .from('students')
            .insert(dbStudent)
            .select()
            .single();

        if (error) throw error;
        return mapStudentFromDB(data);
    },

    async update(student: Student): Promise<Student> {
        const dbStudent = mapStudentToDB(student);
        const { data, error } = await supabase
            .from('students')
            .update(dbStudent)
            .eq('id', student.id)
            .select()
            .single();

        if (error) throw error;
        return mapStudentFromDB(data);
    },

    async remove(id: string): Promise<void> {
        const { error } = await supabase
            .from('students')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async updateSessionCount(id: string, count: number): Promise<void> {
        const { error } = await supabase
            .from('students')
            .update({ total_sessions_attended: count })
            .eq('id', id);

        if (error) throw error;
    }
};

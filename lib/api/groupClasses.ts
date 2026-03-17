import { supabase } from '../supabase';
import { GroupClass, GroupClassStudent } from '../../types';
import { mapGroupClassFromDB, mapGroupClassToDB, mapEnrollmentFromDB } from './mappings';

export const groupClassesApi = {
    async list(): Promise<GroupClass[]> {
        const { data: classes, error: classError } = await supabase
            .from('group_classes')
            .select('*')
            .order('date', { ascending: true });

        if (classError) throw classError;

        const { data: enrollments, error: enrollError } = await supabase
            .from('group_class_enrollments')
            .select('*');

        if (enrollError) throw enrollError;

        return classes.map(gc => ({
            ...mapGroupClassFromDB(gc),
            students: enrollments
                .filter(e => e.class_id === gc.id)
                .map(mapEnrollmentFromDB)
        }));
    },
    async create(gc: Omit<GroupClass, 'id'>): Promise<GroupClass> {
        const { students, ...classData } = gc;
        const { data, error } = await supabase
            .from('group_classes')
            .insert(mapGroupClassToDB(classData))
            .select()
            .single();

        if (error) throw error;
        return { ...mapGroupClassFromDB(data), students: [] };
    },
    async update(gc: GroupClass): Promise<GroupClass> {
        const { students, ...classData } = gc;
        const { error: classError } = await supabase
            .from('group_classes')
            .update(mapGroupClassToDB(classData))
            .eq('id', gc.id);

        if (classError) throw classError;

        const { error: deleteError } = await supabase
            .from('group_class_enrollments')
            .delete()
            .eq('class_id', gc.id);

        if (deleteError) throw deleteError;

        if (students.length > 0) {
            const { error: enrollError } = await supabase
                .from('group_class_enrollments')
                .insert(students.map(s => ({
                    class_id: gc.id,
                    student_id: s.isExternal ? null : s.id,
                    student_name: s.name,
                    is_external: s.isExternal,
                    attendance: s.attendance
                })));

            if (enrollError) throw enrollError;
        }

        return gc;
    },
    async remove(id: string): Promise<void> {
        const { error } = await supabase.from('group_classes').delete().eq('id', id);
        if (error) throw error;
    },
    async enrollStudent(classId: string, enrollment: GroupClassStudent): Promise<void> {
        const { error } = await supabase
            .from('group_class_enrollments')
            .insert({
                class_id: classId,
                student_id: enrollment.id,
                student_name: enrollment.name,
                is_external: enrollment.isExternal,
                attendance: enrollment.attendance
            });
        if (error) throw error;
    },
    async unenrollStudent(classId: string, studentId: string): Promise<void> {
        const { error } = await supabase
            .from('group_class_enrollments')
            .delete()
            .eq('class_id', classId)
            .eq('student_id', studentId);
        if (error) throw error;
    }
};

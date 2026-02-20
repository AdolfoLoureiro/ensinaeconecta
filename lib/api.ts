import { supabase } from './supabase';
import { Student, Appointment, Transaction, GroupClass, PerformanceRecord, GroupClassStudent } from '../types';

export const api = {
    students: {
        async list(): Promise<Student[]> {
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .order('name');

            if (error) throw error;

            return data.map(mapStudentFromDB);
        },

        async create(student: Omit<Student, 'id'>): Promise<Student> {
            const dbStudent = mapStudentToDB(student);
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
    },

    appointments: {
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
            const dbApts = apts.map(mapAppointmentToDB);
            const { data, error } = await supabase
                .from('appointments')
                .insert(dbApts)
                .select();

            if (error) throw error;
            return data.map(mapAppointmentFromDB);
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
    },

    transactions: {
        async list(): Promise<Transaction[]> {
            const { data, error } = await supabase
                .from('transactions')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;
            return data.map(mapTransactionFromDB);
        },
        async create(tx: Omit<Transaction, 'id'>): Promise<Transaction> {
            const { data, error } = await supabase
                .from('transactions')
                .insert(mapTransactionToDB(tx))
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
    },

    groupClasses: {
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
            const { data, error } = await supabase
                .from('group_classes')
                .update(mapGroupClassToDB(classData))
                .eq('id', gc.id)
                .select()
                .single();

            if (error) throw error;
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
    },

    performance: {
        async list(): Promise<PerformanceRecord[]> {
            const { data, error } = await supabase
                .from('performance_records')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;
            return data.map(mapPerformanceFromDB);
        },
        async create(record: Omit<PerformanceRecord, 'id'>): Promise<PerformanceRecord> {
            const { data, error } = await supabase
                .from('performance_records')
                .insert(mapPerformanceToDB(record))
                .select()
                .single();

            if (error) throw error;
            return mapPerformanceFromDB(data);
        },
        async remove(id: string): Promise<void> {
            const { error } = await supabase.from('performance_records').delete().eq('id', id);
            if (error) throw error;
        }
    },

    profile: {
        async get(): Promise<UserProfile | null> {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data ? mapProfileFromDB(data) : null;
        },

        async upsert(profile: UserProfile): Promise<UserProfile> {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const dbProfile = mapProfileToDB(profile, user.id);
            const { data, error } = await supabase
                .from('profiles')
                .upsert(dbProfile)
                .select()
                .single();

            if (error) throw error;
            return mapProfileFromDB(data);
        }
    }
};

// Add UserProfile type import if needed (it's in types.ts or local)
// Based on App.tsx it's in components/profile/ProfileModal.tsx usually, but let's check types.ts


// --- MAPPING HELPERS ---

function mapStudentFromDB(db: any): Student {
    return {
        id: db.id,
        name: db.name,
        email: db.email,
        birthDate: db.birth_date,
        phone: db.phone,
        registrationDate: db.registration_date,
        status: db.status,
        photo: db.photo,
        guardian: db.guardian,
        schoolGrade: db.school_grade,
        schoolName: db.school_name,
        schedules: db.schedules,
        monthlyFee: Number(db.monthly_fee) || 0,
        totalSessionsAttended: Number(db.total_sessions_attended) || 0,
        notes: db.notes
    };
}

function mapStudentToDB(student: Omit<Student, 'id'>) {
    return {
        name: student.name,
        email: student.email,
        birth_date: student.birthDate,
        phone: student.phone,
        registration_date: student.registrationDate,
        status: student.status,
        photo: student.photo,
        guardian: student.guardian,
        school_grade: student.schoolGrade,
        school_name: student.schoolName,
        schedules: student.schedules,
        monthly_fee: student.monthlyFee,
        total_sessions_attended: student.totalSessionsAttended,
        notes: student.notes
    };
}

function mapAppointmentFromDB(db: any): Appointment {
    return {
        id: db.id,
        studentId: db.student_id,
        studentName: db.student_name,
        date: db.date,
        time: db.time,
        subject: db.subject,
        status: db.status,
        notes: db.notes
    };
}

function mapAppointmentToDB(apt: Omit<Appointment, 'id'>) {
    return {
        student_id: apt.studentId,
        student_name: apt.studentName,
        date: apt.date,
        time: apt.time,
        subject: apt.subject,
        status: apt.status,
        notes: apt.notes
    };
}

function mapTransactionFromDB(db: any): Transaction {
    return {
        id: db.id,
        studentId: db.student_id,
        studentName: db.student_name,
        amount: Number(db.amount),
        date: db.date,
        status: db.status,
        description: db.description,
        classCount: db.class_count,
        isRecurring: db.is_recurring
    };
}

function mapTransactionToDB(tx: Omit<Transaction, 'id'>) {
    return {
        student_id: tx.studentId,
        student_name: tx.studentName,
        amount: tx.amount,
        date: tx.date,
        status: tx.status,
        description: tx.description,
        class_count: tx.classCount,
        is_recurring: tx.isRecurring
    };
}

function mapGroupClassFromDB(db: any): GroupClass {
    return {
        id: db.id,
        subject: db.subject,
        content: db.content,
        teacher: db.teacher,
        grade: db.grade,
        maxStudents: db.max_students,
        date: db.date,
        time: db.time,
        students: [], // Loaded separately
        costPerStudent: db.cost_per_student ? Number(db.cost_per_student) : undefined,
        teacherPayment: db.teacher_payment ? Number(db.teacher_payment) : undefined
    };
}

function mapGroupClassToDB(gc: any) {
    return {
        subject: gc.subject,
        content: gc.content,
        teacher: gc.teacher,
        grade: gc.grade,
        max_students: gc.maxStudents,
        date: gc.date,
        time: gc.time,
        cost_per_student: gc.costPerStudent,
        teacher_payment: gc.teacherPayment
    };
}

function mapEnrollmentFromDB(db: any): GroupClassStudent {
    return {
        id: db.student_id,
        name: db.student_name,
        isExternal: db.is_external,
        attendance: db.attendance
    };
}

function mapPerformanceFromDB(db: any): PerformanceRecord {
    return {
        id: db.id,
        studentId: db.student_id,
        studentName: db.student_name,
        date: db.date,
        type: db.type,
        title: db.title,
        score: Number(db.score),
        maxScore: Number(db.max_score)
    };
}

function mapPerformanceToDB(record: Omit<PerformanceRecord, 'id'>) {
    return {
        student_id: record.studentId,
        student_name: record.studentName,
        date: record.date,
        type: record.type,
        title: record.title,
        score: record.score,
        max_score: record.maxScore
    };
}

function mapProfileFromDB(db: any): UserProfile {
    return {
        name: db.name,
        role: db.role,
        photo: db.photo,
        pixKey: db.pix_key
    };
}

function mapProfileToDB(profile: UserProfile, userId: string) {
    return {
        id: userId,
        name: profile.name,
        role: profile.role,
        photo: profile.photo,
        pix_key: profile.pixKey
    };
}

import { UserProfile } from '../components/profile/ProfileModal';


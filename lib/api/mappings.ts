import { Student, Appointment, Transaction, GroupClass, PerformanceRecord, GroupClassStudent } from '../types';
import { UserProfile } from '../components/profile/ProfileModal';

export function mapStudentFromDB(db: any): Student {
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

export function mapStudentToDB(student: Omit<Student, 'id'>) {
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

export function mapAppointmentFromDB(db: any): Appointment {
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

export function mapAppointmentToDB(apt: Omit<Appointment, 'id'>) {
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

export function mapTransactionFromDB(db: any): Transaction {
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

export function mapTransactionToDB(tx: Omit<Transaction, 'id'>) {
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

export function mapGroupClassFromDB(db: any): GroupClass {
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

export function mapGroupClassToDB(gc: any) {
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

export function mapEnrollmentFromDB(db: any): GroupClassStudent {
    return {
        id: db.student_id || db.id,
        name: db.student_name,
        isExternal: db.is_external,
        attendance: db.attendance
    };
}

export function mapPerformanceFromDB(db: any): PerformanceRecord {
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

export function mapPerformanceToDB(record: Omit<PerformanceRecord, 'id'>) {
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

export function mapProfileFromDB(db: any): UserProfile {
    return {
        name: db.name,
        role: db.role,
        photo: db.photo,
        pixKey: db.pix_key
    };
}

export function mapProfileToDB(profile: UserProfile, userId: string) {
    return {
        id: userId,
        name: profile.name,
        role: profile.role,
        photo: profile.photo,
        pix_key: profile.pixKey
    };
}

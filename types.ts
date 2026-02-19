
export interface Guardian {
  name: string;
  cpf: string;
  phone: string;
  address: string;
}

export interface ClassSchedule {
  day: string; // e.g., 'Segunda'
  time: string; // e.g., '14:00'
}

export interface Student {
  id: string;
  name: string;
  email?: string;
  birthDate?: string;
  phone: string;
  registrationDate: string;
  status: 'Ativo' | 'Inativo';
  photo?: string;
  guardian?: Guardian;
  schoolGrade?: string;
  schoolName?: string;
  schedules?: ClassSchedule[];
  monthlyFee?: number; // Valor da mensalidade acordada
  totalSessionsAttended?: number; // Total de aulas assistidas no ciclo atual
}

export interface Appointment {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  subject: string;
  status: 'Agendado' | 'Em andamento' | 'Concluído' | 'Faltou';
  notes?: string;
}

export interface TimetableEntry {
  studentId: string;
  day: string;
  hour: string;
  studentName: string;
  color: string;
  photo?: string;
}

export interface Transaction {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  status: 'Pago' | 'Pendente';
  description: string;
  classCount?: number;
  isRecurring?: boolean;
}

export interface PerformanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  type: 'Simulado' | 'Atividade' | 'Prova';
  title?: string;
  score: number;
  maxScore: number;
}

export interface GroupClassStudent {
  id: string;
  name: string;
  isExternal: boolean; // True se não for matriculado
  attendance?: 'present' | 'absent';
}

export interface GroupClass {
  id: string;
  subject: string;
  content: string;
  teacher: string;
  grade: string; // Série
  maxStudents: number;
  date: string;
  time: string;
  students: GroupClassStudent[];
  costPerStudent?: number; // Valor cobrado de cada aluno
  teacherPayment?: number; // Valor fixo pago ao professor
}

export type View = 'dashboard' | 'students' | 'scheduling' | 'timetable' | 'finance' | 'performance' | 'groupClasses';

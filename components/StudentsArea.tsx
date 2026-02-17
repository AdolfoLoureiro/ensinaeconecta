
import React, { useState, useRef, useEffect } from 'react';
import {
  UserPlus,
  Search
} from 'lucide-react';
import { Student, ClassSchedule, Appointment } from '../types';
import { StudentList } from './students/StudentList';
import { StudentFormModal } from './students/StudentFormModal';
import { StudentDetailsModal } from './students/StudentDetailsModal';

interface StudentsAreaProps {
  students: Student[];
  appointments: Appointment[];
  onRegister: (s: Student) => void;
  onUpdate: (s: Student) => void;
  onDelete: (id: string) => void;
}

const StudentsArea: React.FC<StudentsAreaProps> = ({ students, appointments, onRegister, onUpdate, onDelete }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    phone: '',
    registrationDate: new Date().toLocaleDateString('pt-BR'),
    schoolGrade: '',
    schoolName: '',
    monthlyFee: '',
    guardianName: '',
    guardianCpf: '',
    guardianPhone: '',
    guardianAddress: '',
    status: 'Ativo' as 'Ativo' | 'Inativo'
  });

  const [tempSchedules, setTempSchedules] = useState<ClassSchedule[]>([]);
  const [newScheduleDay, setNewScheduleDay] = useState('Segunda');
  const [newScheduleTime, setNewScheduleTime] = useState('14:00');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const closeModal = () => {
    setIsRegistering(false);
    setEditingStudentId(null);
    setSelectedStudent(null);
    setPhotoPreview(null);
    setTempSchedules([]);
    setFormData({
      name: '', birthDate: '', phone: '', registrationDate: new Date().toLocaleDateString('pt-BR'), schoolGrade: '', schoolName: '', monthlyFee: '',
      guardianName: '', guardianCpf: '', guardianPhone: '', guardianAddress: '',
      status: 'Ativo'
    });
  };

  const addSchedule = () => {
    setTempSchedules([...tempSchedules, { day: newScheduleDay, time: newScheduleTime }]);
  };

  const removeSchedule = (idx: number) => {
    setTempSchedules(tempSchedules.filter((_, i) => i !== idx));
  };

  const handleEdit = (student: Student) => {
    setEditingStudentId(student.id);
    setFormData({
      name: student.name,
      birthDate: student.birthDate || '',
      phone: student.phone,
      registrationDate: student.registrationDate,
      schoolGrade: student.schoolGrade || '',
      schoolName: student.schoolName || '',
      monthlyFee: student.monthlyFee ? student.monthlyFee.toString() : '',
      guardianName: student.guardian?.name || '',
      guardianCpf: student.guardian?.cpf || '',
      guardianPhone: student.guardian?.phone || '',
      guardianAddress: student.guardian?.address || '',
      status: student.status
    });
    setPhotoPreview(student.photo || null);
    setTempSchedules(student.schedules || []);
    setIsRegistering(true);
    setMenuOpenId(null);
    setSelectedStudent(null);
  };

  const handleSave = () => {
    if (editingStudentId) {
      const existingStudent = students.find(s => s.id === editingStudentId);
      const updatedStudent: Student = {
        ...existingStudent!,
        name: formData.name,
        birthDate: formData.birthDate,
        phone: formData.phone,
        registrationDate: formData.registrationDate,
        status: formData.status,
        photo: photoPreview || undefined,
        schoolGrade: formData.schoolGrade,
        schoolName: formData.schoolName,
        monthlyFee: formData.monthlyFee ? parseFloat(formData.monthlyFee) : undefined,
        schedules: tempSchedules,
        guardian: {
          name: formData.guardianName,
          cpf: formData.guardianCpf,
          phone: formData.guardianPhone,
          address: formData.guardianAddress
        }
      };
      onUpdate(updatedStudent);
    } else {
      const newStudent: Student = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        birthDate: formData.birthDate,
        phone: formData.phone,
        registrationDate: formData.registrationDate,
        status: 'Ativo',
        photo: photoPreview || undefined,
        schoolGrade: formData.schoolGrade,
        schoolName: formData.schoolName,
        monthlyFee: formData.monthlyFee ? parseFloat(formData.monthlyFee) : undefined,
        schedules: tempSchedules,
        guardian: {
          name: formData.guardianName,
          cpf: formData.guardianCpf,
          phone: formData.guardianPhone,
          address: formData.guardianAddress
        }
      };
      onRegister(newStudent);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setMenuOpenId(null);
    setSelectedStudent(null);
  };

  // Logic to calculate history stats
  const getStudentHistory = (studentId: string) => {
    const studentApts = appointments
      .filter(a => a.studentId === studentId)
      .sort((a, b) => {
        // Simple sort assuming dd/mm/yyyy format
        const [da, ma, ya] = a.date.split('/').map(Number);
        const [db, mb, yb] = b.date.split('/').map(Number);
        return new Date(yb, mb - 1, db).getTime() - new Date(ya, ma - 1, da).getTime();
      }); // Newest first

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const monthlyStats = studentApts.reduce((acc, apt) => {
      const [_, m, y] = apt.date.split('/').map(Number);
      if (m === currentMonth && y === currentYear) {
        if (apt.status === 'Concluído') acc.attended++;
        if (apt.status === 'Faltou') acc.missed++;
      }
      return acc;
    }, { attended: 0, missed: 0 });

    return { history: studentApts, stats: monthlyStats };
  };

  const sortedStudents = [...students].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Alunos</h1>
          <p className="text-slate-500 dark:text-slate-400">Gerencie as matrículas e dados dos estudantes.</p>
        </div>
        <button onClick={() => setIsRegistering(true)} className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-md">
          <UserPlus className="w-5 h-5" />
          Matricular Aluno
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Pesquisar por nome ou e-mail..." className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all dark:text-slate-200" />
          </div>
        </div>
        <StudentList
          students={sortedStudents}
          onSelect={setSelectedStudent}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* MODAL: Registration / Edit */}
      <StudentFormModal
        isOpen={isRegistering}
        onClose={closeModal}
        onSave={handleSave}
        isEditing={!!editingStudentId}
        formData={formData}
        setFormData={setFormData}
        photoPreview={photoPreview}
        setPhotoPreview={setPhotoPreview}
        tempSchedules={tempSchedules}
        setTempSchedules={setTempSchedules}
      />

      <StudentDetailsModal
        selectedStudent={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getStudentHistory={getStudentHistory}
      />
      <style>{`
        .input-field {
          width: 100%;
          border-radius: 0.75rem;
          background-color: rgb(248 250 252);
          border: 1px solid rgb(226 232 240);
          font-size: 0.875rem;
          transition: all 0.2s;
          outline: none;
        }
        .dark .input-field {
          background-color: rgb(30 41 59);
          border-color: rgb(51 65 85);
          color: white;
        }
        .input-field:focus {
          border-color: rgb(79 70 229);
          box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
        }
        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
        }
        .label {
          text-transform: uppercase;
          font-weight: 800;
          font-size: 0.625rem;
          color: rgb(148 163 184);
          letter-spacing: 0.025em;
        }
        .value {
          font-weight: 600;
          color: rgb(51 65 85);
        }
        .dark .value {
          color: rgb(203 213 225);
        }
      `}</style>
    </div>
  );
};

export default StudentsArea;

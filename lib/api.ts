import { studentsApi } from './api/students';
import { appointmentsApi } from './api/appointments';
import { transactionsApi } from './api/transactions';
import { groupClassesApi } from './api/groupClasses';
import { performanceApi } from './api/performance';
import { profileApi } from './api/profile';

export const api = {
    students: studentsApi,
    appointments: appointmentsApi,
    transactions: transactionsApi,
    groupClasses: groupClassesApi,
    performance: performanceApi,
    profile: profileApi
};

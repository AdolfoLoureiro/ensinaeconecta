/**
 * Formata uma data para o padrão DD/MM/YYYY com zeros à esquerda.
 * Garante consistência independente do navegador ou SO.
 */
export const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

/**
 * Converte qualquer string ou Date para a representação BR (DD/MM/YYYY).
 */
export const toBRDateStr = (dateInput: string | Date | undefined | null): string => {
    if (!dateInput) return '';
    if (dateInput instanceof Date) {
        return formatDate(dateInput);
    }
    const str = String(dateInput).trim();
    if (str.includes('/')) {
        return str;
    }
    if (str.includes('-')) {
        const datePart = str.split('T')[0];
        const parts = datePart.split('-');
        if (parts.length === 3) {
            const [y, m, d] = parts;
            return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
        }
    }
    return str;
};

/**
 * Converte qualquer string ou Date para o formato ISO (YYYY-MM-DD) aceito pelo Postgres/Supabase.
 */
export const toISODateStr = (dateInput: string | Date | undefined | null): string => {
    if (!dateInput) return '';
    if (dateInput instanceof Date) {
        const y = dateInput.getFullYear();
        const m = String(dateInput.getMonth() + 1).padStart(2, '0');
        const d = String(dateInput.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
    const str = String(dateInput).trim();
    if (str.includes('-')) {
        return str.split('T')[0];
    }
    if (str.includes('/')) {
        const [d, m, y] = str.split('/');
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }
    return str;
};

/**
 * Converte uma string de data formatada (DD/MM/YYYY ou YYYY-MM-DD) para um objeto Date.
 */
export const parseFormattedDate = (formattedDate: string): Date => {
    if (!formattedDate) return new Date();
    const str = String(formattedDate).trim();
    if (str.includes('-')) {
        const [year, month, day] = str.split('T')[0].split('-').map(Number);
        return new Date(year, month - 1, day);
    }
    const [day, month, year] = str.split('/').map(Number);
    return new Date(year, month - 1, day);
};

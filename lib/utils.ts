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
 * Converte uma string de data formatada (DD/MM/YYYY) para um objeto Date.
 */
export const parseFormattedDate = (formattedDate: string): Date => {
    const [day, month, year] = formattedDate.split('/').map(Number);
    return new Date(year, month - 1, day);
};

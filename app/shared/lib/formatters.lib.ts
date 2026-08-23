export function toLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function toLocalDate(value: Date | string): Date {
    if (value instanceof Date) return value;
    const parts = value.split('T')[0]?.split('-').map(Number);
    if (parts && parts.length === 3 && parts.every((n) => !isNaN(n))) {
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return new Date(value);
}

export function getformattedDate(date: string | Date) {
    if (date instanceof Date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}.${month}.${String(year).slice(-2)}`;
    }

    if (!date || typeof date !== 'string') return '';

    const parts = date.split('T')[0]?.split('-');
    if (!parts || parts.length < 3) return date;

    const [year, month, day] = parts;
    return `${day}.${month}.${year.slice(-2)}`;
}

export function toTitleCase(str: string) {
    if (!str) return str;
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

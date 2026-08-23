export function getformattedDate(date: string | Date) {
    if (date instanceof Date) {
        date = date.toISOString();
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

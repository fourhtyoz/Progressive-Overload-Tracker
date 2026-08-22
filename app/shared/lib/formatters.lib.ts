export function getformattedDate(date: string | Date) {
    if (date instanceof Date) {
        date = date.toISOString();
    }

    const [year, month, day] = date.split('T')[0].split('-');
    const formattedDate = `${day}.${month}.${year.slice(-2)}`;

    return formattedDate;
}

export function toTitleCase(str: string) {
    if (!str || str.length < 1) return str;
    return str
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

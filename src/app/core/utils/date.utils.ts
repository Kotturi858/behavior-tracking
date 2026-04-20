export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function toDateKey(value: Date | string): string {
  if (typeof value === 'string') {
    return value.slice(0, 10);
  }

  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, '0');
  const day = `${value.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function fromDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

export function addDays(dateKey: string, amount: number): string {
  const date = fromDateKey(dateKey);
  date.setDate(date.getDate() + amount);
  return toDateKey(date);
}

export function differenceInDays(startDateKey: string, endDateKey: string): number {
  const start = fromDateKey(startDateKey).getTime();
  const end = fromDateKey(endDateKey).getTime();
  return Math.round((end - start) / 86_400_000);
}

export function getLastNDates(days: number, anchorDateKey = toDateKey(new Date())): string[] {
  return Array.from({ length: days }, (_, index) => addDays(anchorDateKey, -(days - index - 1)));
}

export function chunk<T>(items: T[], chunkSize: number): T[][] {
  const result: T[][] = [];

  for (let index = 0; index < items.length; index += chunkSize) {
    result.push(items.slice(index, index + chunkSize));
  }

  return result;
}

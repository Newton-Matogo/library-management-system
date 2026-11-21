export function calculateFine(
  dueDate: Date,
  returnDate: Date,
  ratePerDay: number,
): number {
  if (ratePerDay < 0) {
    throw new Error('Fine rate cannot be negative');
  }

  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const overdueMilliseconds = returnDate.getTime() - dueDate.getTime();

  if (overdueMilliseconds <= 0) {
    return 0;
  }

  const overdueDays = Math.ceil(overdueMilliseconds / millisecondsPerDay);

  return overdueDays * ratePerDay;
}

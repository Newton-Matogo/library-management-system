import { calculateFine } from './fine-calculator';

describe('calculateFine', () => {
  const dueDate = new Date('2026-01-10T00:00:00.000Z');
  const ratePerDay = 50;

  it('should return zero when a book is returned on time', () => {
    const returnDate = new Date('2026-01-10T00:00:00.000Z');

    const fine = calculateFine(dueDate, returnDate, ratePerDay);

    expect(fine).toBe(0);
  });

  it('should calculate a fine when a book is returned late', () => {
    const returnDate = new Date('2026-01-13T00:00:00.000Z');

    const fine = calculateFine(dueDate, returnDate, ratePerDay);

    expect(fine).toBe(150);
  });
});

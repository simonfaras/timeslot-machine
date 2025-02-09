import { describe, it, expect } from 'vitest';
import { Interval, areIntervalsOverlapping } from './date-utils';

describe('areIntervalsOverlapping', () => {
  it('should return true if a ends after b starts', () => {
    const a: Interval = {
      start: new Date('2024-02-20 07:00:00:000Z'),
      end: new Date('2024-02-20 08:00:00:000Z'),
    };
    const b: Interval = {
      start: new Date('2024-02-20 07:30:00:000Z'),
      end: new Date('2024-02-20 09:00:00:000Z'),
    };

    expect(areIntervalsOverlapping(a, b)).toBe(true);
  });

  it('should return true if a starts after b starts', () => {
    const a: Interval = {
      start: new Date('2024-02-20 08:00:00:000Z'),
      end: new Date('2024-02-20 09:00:00:000Z'),
    };
    const b: Interval = {
      start: new Date('2024-02-20 07:30:00:000Z'),
      end: new Date('2024-02-20 09:00:00:000Z'),
    };

    expect(areIntervalsOverlapping(a, b)).toBe(true);
  });

  it('should return false if a ends when b starts', () => {
    const a: Interval = {
      start: new Date('2024-02-20 07:00:00:000Z'),
      end: new Date('2024-02-20 08:00:00:000Z'),
    };
    const b: Interval = {
      start: new Date('2024-02-20 08:00:00:000Z'),
      end: new Date('2024-02-20 09:00:00:000Z'),
    };

    expect(areIntervalsOverlapping(a, b)).toBe(false);
  });

  it('should return false if b ends when a starts', () => {
    const a: Interval = {
      start: new Date('2024-02-20 08:00:00:000Z'),
      end: new Date('2024-02-20 09:00:00:000Z'),
    };
    const b: Interval = {
      start: new Date('2024-02-20 07:00:00:000Z'),
      end: new Date('2024-02-20 08:00:00:000Z'),
    };

    expect(areIntervalsOverlapping(a, b)).toBe(false);
  });

  it('should return false if a ends before b starts', () => {
    const a: Interval = {
      start: new Date('2024-02-20 07:00:00:000Z'),
      end: new Date('2024-02-20 08:00:00:000Z'),
    };
    const b: Interval = {
      start: new Date('2024-02-20 08:00:01:000Z'),
      end: new Date('2024-02-20 09:00:00:000Z'),
    };

    expect(areIntervalsOverlapping(a, b)).toBe(false);
  });
});

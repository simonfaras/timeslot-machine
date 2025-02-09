export const formatDate = new Intl.DateTimeFormat('sv-SE', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format;

export type Interval = {
  start: Date;
  end: Date;
};

export const areIntervalsOverlapping = (a: Interval, b: Interval): boolean => {
  const [first, last] = [
    { start: a.start.getTime(), end: a.end.getTime() },
    { start: b.start.getTime(), end: b.end.getTime() },
  ].toSorted((x, y) => x.start - y.start);

  return first.end > last.start;
};

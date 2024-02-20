import { usePeriod } from '@/data/queries';
import { Timeslot } from '@/data/storage';
import React from 'react';

const isLunchTimeslot = (timeslot: Timeslot) =>
  timeslot.description.toLowerCase() === 'lunch';

function getMinutesDuration(timeslot: Timeslot): number {
  return (
    Math.floor(timeslot.end.getTime() - timeslot.start.getTime()) / 1000 / 60
  );
}

function summarizeTimeslots(timeslots: Timeslot[]): Record<string, number> {
  return timeslots
    .filter((timeslot) => !isLunchTimeslot(timeslot))
    .reduce<Record<string, number>>((acc, timeslot) => {
      acc[timeslot.description] =
        (acc[timeslot.description] ?? 0) + getMinutesDuration(timeslot);

      return acc;
    }, {});
}

function formatTimespan(minutes: number): string {
  return `${Math.floor(minutes / 60)} tim ${minutes % 60} min`;
}

interface PeriodSummaryRowProps {
  title: string;
  minutes: number;
}
function PeriodSummaryRow({ title, minutes }: PeriodSummaryRowProps) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="font-bold">{title}</span>
      <span className="font-bold">{formatTimespan(minutes)}</span>
    </div>
  );
}

interface PeriodSummaryProps {
  periodId: string;
}
export default function PeriodSummary({ periodId }: PeriodSummaryProps) {
  const periodQuery = usePeriod(periodId);

  if (periodQuery.data == null) {
    return null;
  }

  const allPeriodTimeslots = periodQuery.data.days
    .map((day) => day.timeslots)
    .flat();

  const summary = summarizeTimeslots(allPeriodTimeslots);
  const totalMinutes = Object.values(summary).reduce(
    (sum, minutes) => sum + minutes,
    0
  );

  if (!totalMinutes) return null;

  return (
    <div className="p-4 pt-3 rounded-md border border-slate-950 shadow-md flex flex-col gap-2">
      {Object.entries(summary).map(([name, minutes]) => (
        <PeriodSummaryRow key={name} title={name} minutes={minutes} />
      ))}
      <div className="font-bold">
        <PeriodSummaryRow title="Totalt" minutes={totalMinutes} />
      </div>
    </div>
  );
}

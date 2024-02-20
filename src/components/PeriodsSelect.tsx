'use client';
import { useAllPeriods, useCreatePeriod } from '@/data/queries';
import { formatDate } from '@/lib/date-utils';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

const NEW_PERIOD_TITLE = '[ny]';

const getPeriodTitle = (period: { days: Date[] }): string => {
  const [first, last] = [period.days.at(0), period.days.at(-1)];
  if (!first) {
    return NEW_PERIOD_TITLE;
  }

  if (!last) {
    return formatDate(first);
  }

  return `${formatDate(first)} -- ${formatDate(last)}`;
};

export default function PeriodSelect() {
  const router = useRouter();
  const { period: activePeriodId } = useParams<{ period?: string }>();
  const periodsQuery = useAllPeriods();
  const createPeriod = useCreatePeriod({
    onSuccess: (period) => {
      setPeriod(period.id);
    },
  });

  const setPeriod = (id: string) => {
    router.replace(`/${id}`);
  };

  if (periodsQuery.isLoading) {
    return <div>Laddar...</div>;
  }

  // TODO Fix a loader here

  const periods =
    periodsQuery.data
      ?.slice()
      .map((period) => {
        const days = period.days
          .map((d) => d.date)
          .toSorted((a, b) => a.getTime() - b.getTime());

        return {
          ...period,
          days,
          sortIndex: days.at(0)?.getTime() ?? Number.MAX_SAFE_INTEGER,
        };
      })
      .sort((a, b) => a.sortIndex - b.sortIndex) ?? [];

  const newPeriod = periods.find((period) => period.days.length === 0);

  return (
    <div className="flex justify-between">
      {periods.length > 0 && (
        <select
          value={activePeriodId ?? periods[0]?.id ?? ''}
          onChange={(e) => setPeriod(e.target.value)}
        >
          {periods.map((period) => (
            <option key={period.id} value={period.id}>
              {getPeriodTitle(period)}
            </option>
          ))}
        </select>
      )}
      {newPeriod && activePeriodId !== newPeriod.id ? (
        <button onClick={() => setPeriod(newPeriod.id)}>Gå till senaste</button>
      ) : (
        <button onClick={() => createPeriod.mutate()} disabled={!!newPeriod}>
          Skapa ny period
        </button>
      )}
    </div>
  );
}

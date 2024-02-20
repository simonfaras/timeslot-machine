'use client';
import React from 'react';
import Day from '@/components/Day';
import CreateDayInput from '@/components/CreateDayInput';
import PeriodSummary from '@/components/PeriodSummary';
import { usePeriod } from '@/data/queries';

function getTimeFromDate(date: Date) {
  return new Date(date).getTime();
}

interface PeriodDetailsProps {
  periodId: string;
}

export default function PeriodDetails({ periodId }: PeriodDetailsProps) {
  const periodQuery = usePeriod(periodId);

  // const updatePeriodSettings = useUpdatePeriodSettings(periodId);

  if (periodQuery.isLoading) {
    return <div>Laddar</div>;
  }

  if (!periodQuery.isSuccess || periodQuery.data == null) {
    return <div className="root">Hittar ingen period med id {periodId}.</div>;
  }

  // const { workWeekHours, lunchDurationMinutes } =
  //   periodQuery.data.findPeriodByID.settings;

  const orderedDays = periodQuery.data.days
    .slice()
    .sort((a, b) => getTimeFromDate(a.date) - getTimeFromDate(b.date));

  return (
    <div className="p-4 flex justify-center">
      <div className="flex flex-col relative gap-4">
        <div className="absolute -right-5">
          {/* <PeriodSettings
            update={updatePeriodSettings}
            workWeekHours={workWeekHours}
            lunchDurationMinutes={lunchDurationMinutes}
          /> */}
        </div>
        <div>
          {orderedDays.map(({ id, date, timeslots }) => (
            <Day
              key={id}
              id={id}
              date={date}
              timeslots={timeslots}
              defaultLunchDuration={60}
              workWeekHours={40}
            />
          ))}
        </div>
        <CreateDayInput
          periodId={periodId}
          disabled={() => false}
          // disabled={(date) => {
          //   const dateValue = new Date(date);
          //   return orderedDays.some((day) =>
          //     isSameDayDate(new Date(day.date), dateValue)
          //   );
          // }}
        />
        <PeriodSummary periodId={periodId} />
      </div>
    </div>
  );
}

import React from "react";
import { useQuery } from "@apollo/client";
import isSameDayDate from "date-fns/isSameDay";

import { GetPeriodDocument } from "@/graphql";
import { useUpdatePeriodSettings } from "@/graphql/mutations/periodMutations";
import Day from "@/components/Day";
import CreateDayInput from "@/components/CreateDayInput";
import PeriodSettings from "@/components/PeriodSettings";

function getTimeFromDate(date) {
  return new Date(date).getTime();
}

interface PeriodDetailsProps {
  periodId: string;
}

export default function PeriodDetails({ periodId }: PeriodDetailsProps) {
  const periodQuery = useQuery(GetPeriodDocument, {
    variables: { id: periodId },
  });
  const updatePeriodSettings = useUpdatePeriodSettings(periodId);

  if (periodQuery.loading) {
    return <div>Laddar</div>;
  }

  if (!periodQuery.data) {
    return <div className="root">Hittar ingen period med id {periodId}.</div>;
  }

  const {
    workWeekHours,
    lunchDurationMinutes,
  } = periodQuery.data.findPeriodByID.settings;

  const orderedDays = periodQuery.data.findPeriodByID.days.data
    .slice()
    .sort((a, b) => getTimeFromDate(a.date) - getTimeFromDate(b.date));

  return (
    <div className="root">
      <div className="wrapper">
        <div className="controls-wrapper">
          <PeriodSettings
            update={updatePeriodSettings}
            workWeekHours={workWeekHours}
            lunchDurationMinutes={lunchDurationMinutes}
          />
        </div>
        {orderedDays.map(({ _id, date, timeslots }) => (
          <Day
            key={_id}
            _id={_id}
            date={date}
            timeslots={timeslots.data}
            defaultLunchDuration={lunchDurationMinutes}
            workWeekHours={workWeekHours}
          />
        ))}
        <CreateDayInput
          periodId={periodId}
          disabled={(date) => {
            const dateValue = new Date(date);
            return orderedDays.some((day) =>
              isSameDayDate(new Date(day.date), dateValue)
            );
          }}
        />
      </div>
    </div>
  );
}

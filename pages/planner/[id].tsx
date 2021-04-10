import React from "react";
import { useRouter } from "next/router";
import isSameDayDate from "date-fns/isSameDay";

import { GetPeriodDocument } from "@/graphql";
import { useQuery } from "@apollo/client";
import { useUpdatePeriodSettings } from "@/graphql/mutations/periodMutations";

import Settings from "@/components/PeriodSettings";
import Day from "@/components/Day";
import CreateDayInput from "@/components/CreateDayInput";

function getTimeFromDate(date) {
  return new Date(date).getTime();
}

export default function Planner() {
  const router = useRouter();
  const {
    query: { id },
  } = router;
  const periodId: string = Array.isArray(id) ? id[0] : id;

  const periodQuery = useQuery(GetPeriodDocument, {
    variables: { id: periodId },
  });
  const updatePeriodSettings = useUpdatePeriodSettings(periodId);

  if (periodQuery.loading) {
    return <div>LOADING</div>;
  }

  const {
    worktimePercentage,
    lunchDurationMinutes,
  } = periodQuery.data.findPeriodByID.settings;

  const orderedDays = periodQuery.data.findPeriodByID.days.data
    .slice()
    .sort((a, b) => getTimeFromDate(a.date) - getTimeFromDate(b.date));

  return (
    <div className="root">
      <Settings
        update={updatePeriodSettings}
        worktimePercentage={worktimePercentage}
        lunchDurationMinutes={lunchDurationMinutes}
      />
      <div className="wrapper">
        {orderedDays.map(({ _id, date, timeslots }) => (
          <Day
            key={_id}
            _id={_id}
            date={date}
            timeslots={timeslots.data}
            defaultLunchDuration={lunchDurationMinutes}
            workdayHours={worktimePercentage}
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

export { default as getServerSideProps } from "@/utils/authProps";

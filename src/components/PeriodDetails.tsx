import React from "react";
import styled from "styled-components";
import { useQuery } from "@apollo/client";
import isSameDayDate from "date-fns/isSameDay";

import { GetPeriodDocument } from "@/graphql";
import { useUpdatePeriodSettings } from "@/graphql/mutations/periodMutations";
import Day from "@/components/Day";
import CreateDayInput from "@/components/CreateDayInput";
import PeriodSettings from "@/components/PeriodSettings";
import PeriodSummary from "@/components/PeriodSummary";

const PeriodsDetailsContainer = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: center;
`;

const PeriodDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 1rem;
`;

const PeriodDetailsSettingsWrapper = styled.div`
  position: absolute;
  right: -20px;
`;

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
    <PeriodsDetailsContainer>
      <PeriodDetailsWrapper>
        <PeriodDetailsSettingsWrapper>
          <PeriodSettings
            update={updatePeriodSettings}
            workWeekHours={workWeekHours}
            lunchDurationMinutes={lunchDurationMinutes}
          />
        </PeriodDetailsSettingsWrapper>
        <div>
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
        </div>
        <CreateDayInput
          periodId={periodId}
          disabled={(date) => {
            const dateValue = new Date(date);
            return orderedDays.some((day) =>
              isSameDayDate(new Date(day.date), dateValue)
            );
          }}
        />
        <PeriodSummary periodId={periodId} />
      </PeriodDetailsWrapper>
    </PeriodsDetailsContainer>
  );
}

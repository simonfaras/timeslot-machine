import React from "react";
import styled from "styled-components";
import parseISODate from "date-fns/parseISO";
import { GetPeriodDocument, Timeslot as TimeslotSource } from "@/graphql";
import { useQuery } from "@apollo/client";

const SummaryContainer = styled.div`
  padding: 0.75rem 1rem 1rem 1rem;
  border-radius: 4px;
  border: 1px solid #282c34;
  box-shadow: 2px 2px 1px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SummaryEntry = styled.div`
  font-weight: inherit;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const SummaryEntryCol = styled.span`
  font-weight: inherit;
`;

const SummaryRow = styled.div`
  font-weight: bold;
`;

type Timeslot = Pick<TimeslotSource, "start" | "end" | "activity">;
const isLunchTimeslot = (timeslot: Timeslot) =>
  timeslot.activity.toLowerCase() === "lunch";

function getMinutesDuration(timeslot: Timeslot): number {
  return Math.floor(
    (parseISODate(timeslot.end).getTime() -
      parseISODate(timeslot.start).getTime()) /
      1000 /
      60
  );
}

function summarizeTimeslots(timeslots: Timeslot[]): Record<string, number> {
  return timeslots
    .filter((timeslot) => !isLunchTimeslot(timeslot))
    .reduce((acc, timeslot) => {
      acc[timeslot.activity] =
        (acc[timeslot.activity] ?? 0) + getMinutesDuration(timeslot);

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
    <SummaryEntry>
      <SummaryEntryCol>{title}</SummaryEntryCol>
      <SummaryEntryCol>{formatTimespan(minutes)}</SummaryEntryCol>
    </SummaryEntry>
  );
}

interface PeriodSummaryProps {
  periodId: string;
}
export default function PeriodSummary({ periodId }: PeriodSummaryProps) {
  const periodQuery = useQuery(GetPeriodDocument, {
    variables: { id: periodId },
  });

  const allPeriodTimeslots = periodQuery.data.findPeriodByID.days.data
    .map((day) => day.timeslots.data)
    .flat();

  const summary = summarizeTimeslots(allPeriodTimeslots);
  const totalMinutes = Object.values(summary).reduce(
    (sum, minutes) => sum + minutes,
    0
  );

  if (!totalMinutes) return null;

  return (
    <SummaryContainer>
      {Object.entries(summary).map(([name, minutes]) => (
        <PeriodSummaryRow key={name} title={name} minutes={minutes} />
      ))}
      <SummaryRow>
        <PeriodSummaryRow title="Totalt" minutes={totalMinutes} />
      </SummaryRow>
    </SummaryContainer>
  );
}

import React from "react";
import styled from "styled-components";
import format from "date-fns/format";
import { useCreatePeriod } from "@/graphql/mutations/periodMutations";
import parseISODate from "date-fns/parseISO";

const PeriodSelectWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface Period {
  id: string;
  days: Date[];
}

interface PeriodsSelectProps {
  activePeriodId?: string;
  periods: Period[];
  onSelect: (id: string) => void;
  onCreate: (id: string) => void;
}

const formatDate = (date) => format(date, "yyyy-MM-dd");

const NEW_PERIOD_TITLE = "[ny]";

const getPeriodTitle = (period: Period) => {
  if (!period.days.length) {
    return NEW_PERIOD_TITLE;
  }

  if (period.days.length === 1) {
    return period.days[0];
  }

  return `${period.days[0]} -- ${period.days.pop()}`;
};

const formatPeriodDays = (days) =>
  days
    .slice()
    .sort((a, b) => a.getTime() - b.getTime())
    .map(formatDate);

export default function PeriodSelect({
  activePeriodId,
  periods: periodsRaw,
  onSelect,
  onCreate,
}: PeriodsSelectProps) {
  const createPeriod = useCreatePeriod({ onDone: onCreate });

  const periods = periodsRaw
    .slice()
    .map((period) => {
      const days = formatPeriodDays(period.days);
      return {
        ...period,
        days,
        sortIndex:
          days.length === 0
            ? Number.MAX_SAFE_INTEGER
            : parseISODate(days[0]).getTime(),
      };
    })
    .map((period) => ({
      ...period,
      title: getPeriodTitle(period),
    }))
    .sort((a, b) => a.sortIndex - b.sortIndex);

  const newPeriod = periods.find((period) => period.title === NEW_PERIOD_TITLE);

  return (
    <PeriodSelectWrapper>
      {periods.length > 0 && (
        <select
          value={activePeriodId ?? periods[0]?.id ?? ""}
          onChange={(e) => onSelect(e.target.value)}
        >
          {periods.map((period) => (
            <option key={period.id} value={period.id}>
              {period.title}
            </option>
          ))}
        </select>
      )}
      {newPeriod && activePeriodId !== newPeriod.id ? (
        <button onClick={() => onSelect(newPeriod.id)}>Gå till senaste</button>
      ) : (
        <button onClick={() => createPeriod()} disabled={!!newPeriod}>
          Skapa ny period
        </button>
      )}
    </PeriodSelectWrapper>
  );
}

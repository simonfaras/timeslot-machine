import React, { useEffect, useMemo, useState, useRef } from "react";
import styled from "styled-components";
import formatDate from "date-fns/format";
import addDate from "date-fns/add";
import areIntervalsOverlapping from "date-fns/areIntervalsOverlapping";
import parseISODate from "date-fns/parseISO";
import EntryRow, { TimeslotFields } from "./EntryRow";
import EntryControls, { EntryControlsContainer } from "./EntryControls";

import {
  useCreateTimeslot,
  useDeleteTimeslot,
  useUpdateTimeslot,
} from "@/graphql/mutations/timeslotsMutations";

const weekdays = [
  "Söndag",
  "Måndag",
  "Tisdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lördag",
];

interface Timeslot {
  _id: string;
  start: string;
  end: string;
  activity: string;
}

interface TimeslotParsed extends Pick<Timeslot, "_id" | "activity"> {
  start: Date;
  end: Date;
}

interface DayProps {
  _id: string;
  date: string;
  timeslots: Timeslot[];
  defaultLunchDuration: number;
  workWeekHours: number;
}

const formatTime = (date) => formatDate(date, "HH:mm");

const getTimeslotsSum = (timeslots: TimeslotParsed[]) => {
  const getTimespan = ({ start, end }) => {
    return end.getTime() - start.getTime();
  };

  return timeslots.reduce((sum, timeslot) => sum + getTimespan(timeslot), 0);
};

const formatTimeslot = (timeslot: number) => {
  const minutes = timeslot / 1000 / 60;

  return `${Math.floor(minutes / 60)} tim ${minutes % 60} min`;
};

const isLastInstanceOfActivity = (
  timeslot: TimeslotParsed,
  timeslots: TimeslotParsed[]
) => {
  const lastIndexOfActivity = timeslots
    .map(({ activity }) => activity)
    .lastIndexOf(timeslot.activity);

  return (
    timeslots.findIndex(({ _id }) => timeslot._id === _id) ===
    lastIndexOfActivity
  );
};

const getTotalTimeForActivity = (
  activity: string,
  timeslots: TimeslotParsed[]
) =>
  getTimeslotsSum(
    timeslots.filter((timeslot) => timeslot.activity === activity)
  ) /
  1000 /
  60 /
  60;

const isLunchTimeslot = (timeslot: TimeslotParsed) =>
  timeslot.activity.toLowerCase() === "lunch";

const formatEntryHeading = (isoDate: string) => {
  const date = parseISODate(isoDate);

  return `${weekdays[date.getDay()]} - ${formatDate(date, "d/M")}`;
};

const getTimespanMinutes = (start: Date, end: Date): number =>
  (end.getTime() - start.getTime()) / 1000 / 60;

const calcEndTime = (
  timeslotsArray: TimeslotParsed[],
  createTimestamp: (time: string) => Date,
  lunchDuration: number,
  workWeekHours: number
) => {
  const timeslots = timeslotsArray.slice(0);

  if (!timeslots.find((timeslot) => isLunchTimeslot(timeslot))) {
    const defaultLunchStart = createTimestamp("12:00");
    const defaultLunchEnd = addDate(new Date(defaultLunchStart), {
      minutes: lunchDuration,
    });

    timeslots.push({
      _id: "default_lunch",
      activity: "lunch",
      start: defaultLunchStart,
      end: defaultLunchEnd,
    });
  }

  // Find all non work timeslots and all unregistered time and sum it up
  const breakTime = timeslots.reduce(
    (breakTimeMinutes, timeslot, index, arr) => {
      let timeslotBreakTimeMinutes = 0;
      if (isLunchTimeslot(timeslot)) {
        timeslotBreakTimeMinutes = getTimespanMinutes(
          timeslot.start,
          timeslot.end
        );
      } else if (index > 0 && timeslot.start !== arr[index - 1].end) {
        // There is a gap between the last timeslot and this one, count the time as break
        timeslotBreakTimeMinutes = getTimespanMinutes(
          arr[index - 1].end,
          timeslot.start
        );
      }
      return breakTimeMinutes + timeslotBreakTimeMinutes;
    },
    0
  );

  const endTime = addDate(new Date(timeslots[0].start), {
    minutes: Math.floor((workWeekHours / 5) * 60) + breakTime,
  });

  return formatDate(endTime, "HH:mm");
};

const createTimestampParser = (date: string) => (time: string): Date => {
  const [hours, minutes] = time.split(":").map((n) => Number.parseInt(n));
  const d = parseISODate(date);
  d.setHours(hours, minutes, 0, 0);

  return d;
};

const DayContainer = styled.div`
  padding: 0.75rem 1rem 1rem 1rem;
  border-radius: 4px;
  border: 1px solid #282c34;
  box-shadow: 2px 2px 1px rgba(0, 0, 0, 0.2);
  & + & {
    margin-top: 0.5rem;
  }
`;

const DayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const DayTitle = styled.div`
  font-weight: 400;
`;

const SummaryContainer = styled.div`
  display: flex;
`;

const Summary = styled.div`
  display: block;
  margin-left: 1rem;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  border: 1px dashed #282c34;
`;

const ActivityTotalTime = styled.div`
  position: absolute;
  font-size: 0.825rem;
  right: 0;
  top: 0;
`;

const EntryContainer = styled.div`
  position: relative;
  margin-top: 0.5rem;
  &:hover ${EntryControlsContainer} {
    visibility: visible;
  }
`;

export default function Day({
  _id,
  date,
  timeslots,
  defaultLunchDuration,
  workWeekHours,
}: DayProps) {
  const timestamp = createTimestampParser(date);

  const [editTimeslotId, setEditTimeslotId] = useState(null);

  const createTimeslot = useCreateTimeslot(_id);
  const updateTimeslot = useUpdateTimeslot(_id);
  const deleteTimeslot = useDeleteTimeslot(_id);

  const createTimeslotInput = useRef(null);

  const handleOnCreateTimeslot = ({ start, end, activity }: TimeslotFields) => {
    createTimeslot({
      start: timestamp(start).toISOString(),
      end: timestamp(end).toISOString(),
      activity,
    });

    createTimeslotInput.current.focus();
  };

  const handleOnUpdateTimeslot = (
    id: string,
    { start, end, activity }: TimeslotFields
  ) => {
    updateTimeslot(id, {
      start: timestamp(start).toISOString(),
      end: timestamp(end).toISOString(),
      activity,
    });

    createTimeslotInput.current.focus();
  };

  const handleOnDeleteTimeslot = (id) => {
    deleteTimeslot(id);
  };

  const validateTimeslotInput = (
    { start, end }: TimeslotFields,
    { ignoreOverlapsFor = [] }: { ignoreOverlapsFor?: string[] } = {}
  ) => {
    const inputInterval = {
      start: timestamp(start),
      end: timestamp(end),
    };

    const duration =
      inputInterval.end.getTime() - inputInterval.start.getTime();

    if (duration === 0) {
      return "SAME DATE ERROR";
    }

    if (duration < 0) {
      return "END BEFORE START ERROR";
    }

    const overlaps = timeslots
      .filter((timeslot) => !ignoreOverlapsFor.includes(timeslot._id))
      .find((timeslot) =>
        areIntervalsOverlapping(inputInterval, {
          start: new Date(timeslot.start),
          end: new Date(timeslot.end),
        })
      );

    if (overlaps) {
      return "OVERLAPS ERROR";
    }
    return null;
  };

  useEffect(() => {
    if (editTimeslotId === null) {
      createTimeslotInput.current.focus();
    }
  }, [editTimeslotId]);

  const orderedTimeslots = useMemo(() => {
    return timeslots
      .slice()
      .map((timeslot) => ({
        ...timeslot,
        start: parseISODate(timeslot.start),
        end: parseISODate(timeslot.end),
      }))
      .sort((a, b) => a.start.getTime() - b.end.getTime());
  }, [timeslots]);

  return (
    <DayContainer key={date}>
      <DayHeader>
        <DayTitle>{formatEntryHeading(date)}</DayTitle>
        <SummaryContainer>
          <Summary>
            {formatTimeslot(
              getTimeslotsSum(
                orderedTimeslots.filter(
                  (timeslot) => !isLunchTimeslot(timeslot)
                )
              )
            )}
          </Summary>
          {timeslots.length > 0 && (
            <Summary>
              {calcEndTime(
                orderedTimeslots,
                timestamp,
                defaultLunchDuration,
                workWeekHours
              )}
            </Summary>
          )}
        </SummaryContainer>
      </DayHeader>
      {orderedTimeslots.map((timeslot, index, collection) => {
        return (
          <EntryContainer key={timeslot._id}>
            <EntryRow
              key={`${timeslot._id}-${timeslot.start}-${timeslot.end}-${timeslot.activity}`}
              onSave={(values) => handleOnUpdateTimeslot(timeslot._id, values)}
              validate={(values) =>
                validateTimeslotInput(values, {
                  ignoreOverlapsFor: [timeslot._id],
                })
              }
              defaultStart={formatTime(timeslot.start)}
              defaultEnd={formatTime(timeslot.end)}
              defaultActivity={timeslot.activity}
            >
              {(hasSaveButton) => (
                <>
                  {!hasSaveButton &&
                    !isLunchTimeslot(timeslot) &&
                    isLastInstanceOfActivity(timeslot, collection) && (
                      <ActivityTotalTime>
                        (
                        {getTotalTimeForActivity(
                          timeslot.activity,
                          collection
                        ).toFixed(2)}
                        )
                      </ActivityTotalTime>
                    )}
                  <EntryControls
                    onEdit={() => setEditTimeslotId(timeslot._id)}
                    onDelete={() => handleOnDeleteTimeslot(timeslot._id)}
                    hidden={hasSaveButton}
                  />
                </>
              )}
            </EntryRow>
          </EntryContainer>
        );
      })}
      {!editTimeslotId && (
        <EntryContainer>
          <EntryRow
            ref={createTimeslotInput}
            onSave={handleOnCreateTimeslot}
            validate={validateTimeslotInput}
          />
        </EntryContainer>
      )}
    </DayContainer>
  );
}

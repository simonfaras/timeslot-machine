import React, { useEffect, useMemo, useState, useRef } from "react";
import formatDate from "date-fns/format";
import addDate from "date-fns/add";
import areIntervalsOverlapping from "date-fns/areIntervalsOverlapping";
import parseISODate from "date-fns/parseISO";
import TimeslotInput, { TimeslotFields } from "./TimeslotInput";

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
  workdayHours: number;
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

const isLastInstanceOfActivityForDay = (
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

const calcEndTime = (
  timeslotsArray: TimeslotParsed[],
  createTimestamp: (time: string) => Date,
  lunchDuration: number,
  workdayHours: number
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

  const lunchTimeslot = timeslots.find((timeslot) => isLunchTimeslot(timeslot));
  if (lunchTimeslot) {
    lunchDuration =
      (lunchTimeslot.end.getTime() - lunchTimeslot.start.getTime()) / 1000 / 60;
  }

  const endTime = addDate(new Date(timeslots[0].start), {
    minutes: Math.floor(workdayHours * 60) + lunchDuration,
  });

  return formatDate(endTime, "HH:mm");
};

const createTimestampParser = (date: string) => (time: string): Date => {
  const [hours, minutes] = time.split(":").map((n) => Number.parseInt(n));
  const d = parseISODate(date);
  d.setHours(hours, minutes, 0, 0);

  return d;
};

export default function Day({
  _id,
  date,
  timeslots,
  defaultLunchDuration,
  workdayHours,
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
    setEditTimeslotId(null);
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
    <div className="day" key={date}>
      <div className="header">
        <span className="title">{formatEntryHeading(date)}</span>
        <div className="summary-wrapper">
          <span className="summary">
            {formatTimeslot(
              getTimeslotsSum(
                orderedTimeslots.filter(
                  (timeslot) => !isLunchTimeslot(timeslot)
                )
              )
            )}
          </span>
          {timeslots.length > 0 && (
            <span className="summary">
              {calcEndTime(
                orderedTimeslots,
                timestamp,
                defaultLunchDuration,
                workdayHours
              )}
            </span>
          )}
        </div>
      </div>
      {orderedTimeslots.map((timeslot, index, items) =>
        editTimeslotId !== timeslot._id ? (
          <React.Fragment key={timeslot._id}>
            <div className="entry">
              <div className="timespan">
                {formatTime(timeslot.start)}&nbsp;-&nbsp;
                {formatTime(timeslot.end)}
              </div>
              <div className="description">
                {timeslot.activity}
                {isLastInstanceOfActivityForDay(timeslot, items) && (
                  <span className="entry-summary">
                    (
                    {getTotalTimeForActivity(timeslot.activity, items).toFixed(
                      2
                    )}
                    )
                  </span>
                )}
              </div>
              {
                <div className="entry-controls">
                  <button
                    className="entry-control edit"
                    onClick={() => setEditTimeslotId(timeslot._id)}
                  />
                  <button
                    className="entry-control delete"
                    onClick={() => handleOnDeleteTimeslot(timeslot._id)}
                  />
                </div>
              }
            </div>
          </React.Fragment>
        ) : (
          <TimeslotInput
            key={timeslot._id}
            onSave={(values) => handleOnUpdateTimeslot(timeslot._id, values)}
            validate={(values) =>
              validateTimeslotInput(values, {
                ignoreOverlapsFor: [timeslot._id],
              })
            }
            defaultStart={formatTime(timeslot.start)}
            defaultEnd={formatTime(timeslot.end)}
            defaultActivity={timeslot.activity}
          />
        )
      )}
      {!editTimeslotId && (
        <TimeslotInput
          ref={createTimeslotInput}
          onSave={handleOnCreateTimeslot}
          validate={validateTimeslotInput}
        />
      )}
    </div>
  );
}

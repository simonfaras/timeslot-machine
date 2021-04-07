import React, { useMemo } from "react";
import formatDate from "date-fns/format";
import areIntervalsOverlapping from "date-fns/areIntervalsOverlapping";
import parseISODate from "date-fns/parseISO";
import TimeslotInput, { TimeslotFields } from "./TimeslotInput";
import { useMutation } from "@apollo/client";

import {
  Day as SchemaDay,
  Timeslot as SchemaTimeslot,
  AddTimeslotDocument,
  DeleteTimeslotDocument,
} from "@/graphql";

const weekdays = [
  "Söndag",
  "Måndag",
  "Tisdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lördag",
];

type Timeslot = Pick<SchemaTimeslot, "_id" | "start" | "end" | "activity">;

interface DayProps extends Pick<SchemaDay, "_id" | "date"> {
  timeslots: Timeslot[];
}

const formatTime = (date) => formatDate(date, "HH:mm");

const getTimeslotsSum = (timeslots: Timeslot[]) => {
  const getTimespan = ({ start, end }) => {
    const startDate = new Date(`2020-01-01 ${start}`);
    const endDate = new Date(`2020-01-01 ${end}`);

    return endDate.getTime() - startDate.getTime();
  };

  return timeslots.reduce((sum, timeslot) => sum + getTimespan(timeslot), 0);
};

const formatTimeslot = (timeslot: number) => {
  const minutes = timeslot / 1000 / 60;

  return `${Math.floor(minutes / 60)} tim ${minutes % 60} min`;
};
/*

const isLastInstanceOfActivityForDay = (
  timeslots: Timeslot[],
  timeslot: Timeslot,
  index: number
) => {
  const lastIndex = timeslots
    .map(({ activity }) => activity)
    .lastIndexOf(timeslot.activity);

  return lastIndex === index;
};

const getTotalTimeForActivity = (activity: string, timeslots: Timeslot[]) =>
  getTimeslotsSum(
    timeslots.filter((timeslot) => timeslot.activity === activity)
  ) /
  1000 /
  60 /
  60;
*/

const isLunchTimeslot = (timeslot: Timeslot) =>
  timeslot.activity.toLowerCase() === "lunch";

const formatEntryHeading = (date: Date) =>
  `${weekdays[date.getDay()]} - ${formatDate(date, "d/M")}`;
/*

const calcEndTime = (date: Date, timeslotsArray: Timeslot[]) => {
  const timeslots = timeslotsArray.slice(0);
  const dateString = formatDate(date, "yyyy-MM-dd");

  if (!timeslots.find((timeslot) => isLunchTimeslot(timeslot))) {
    const defaultLunchStart = new Date(`${dateString} 12:00`);
    const defaultLunchEnd = addDate(new Date(defaultLunchStart), {
      minutes: settings.lunchDuration,
    });

    timeslots.push({
      activity: "lunch",
      start: formatDate(defaultLunchStart, "HH:mm"),
      end: formatDate(defaultLunchEnd, "HH:mm"),
    });
  }

  let lunchDuration = settings.lunchDuration;
  const lunchTimeslot = timeslots.find((timeslot) => isLunchTimeslot(timeslot));
  if (lunchTimeslot) {
    lunchDuration =
      (new Date(`${dateString} ${lunchTimeslot.end}`).getTime() -
        new Date(`${dateString} ${lunchTimeslot.start}`).getTime()) /
      1000 /
      60;
  }

  const endTime = addDate(new Date(`${dateString} ${timeslots[0].start}`), {
    minutes: Math.floor(settings.workdayHours * 60) + lunchDuration,
  });

  return formatDate(endTime, "HH:mm");
};
*/

export default function Day({ _id, date: dateString, timeslots }: DayProps) {
  const date = parseISODate(dateString);

  const createTimestamp = (time) => {
    const [hours, minutes] = time.split(":").map((n) => Number.parseInt(n));
    const d = new Date(date);
    d.setHours(hours, minutes, 0, 0);

    return d;
  };

  const [addTimeslot] = useMutation(AddTimeslotDocument, {
    update(cache, { data: { createTimeslot } }) {
      cache.modify({
        id: `Day:${_id}`,
        fields: {
          timeslots(existingTimeslotRefs, { toReference }) {
            return {
              ...existingTimeslotRefs,
              data: existingTimeslotRefs.data.concat(
                toReference(createTimeslot)
              ),
            };
          },
        },
      });
    },
  });

  const [deleteTimeslot] = useMutation(DeleteTimeslotDocument, {
    update(cache, { data: { deleteTimeslot } }) {
      cache.modify({
        id: `Day:${_id}`,
        fields: {
          timeslots(existingTimeslotRefs, { readField }) {
            return {
              ...existingTimeslotRefs,
              data: existingTimeslotRefs.data.filter(
                (ref) => deleteTimeslot._id !== readField("_id", ref)
              ),
            };
          },
        },
      });
    },
  });

  const handleOnAddTimeslot = ({ activity, ...values }: TimeslotFields) => {
    const start = createTimestamp(values.start).toISOString();
    const end = createTimestamp(values.end).toISOString();

    addTimeslot({
      variables: {
        day: _id,
        start,
        end,
        activity,
      },
      optimisticResponse: {
        __typename: "Mutation",
        createTimeslot: {
          __typename: "Timeslot",
          _id: "Timeslot:TEMP",
          start,
          end,
          activity,
        },
      },
    });
  };

  const handleOnRemoveTimeslot = (id) => {
    deleteTimeslot({
      variables: {
        id,
      },
      optimisticResponse: {
        __typename: "Mutation",
        deleteTimeslot: {
          __typename: "Timeslot",
          _id: id,
        },
      },
    });
  };

  const validateTimeslotInput = ({ start, end }) => {
    const inputInterval = {
      start: createTimestamp(start),
      end: createTimestamp(end),
    };

    const duration =
      inputInterval.end.getTime() - inputInterval.start.getTime();

    if (duration === 0) {
      return "SAME DATE ERROR";
    }

    if (duration < 0) {
      return "END BEFORE START ERROR";
    }

    const overlaps = timeslots.find((timeslot) =>
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

  const orderedTimeslots = useMemo(() => {
    return timeslots
      .slice()
      .map((timeslot) => ({
        ...timeslot,
        start: parseISODate(timeslot.start),
        end: parseISODate(timeslot.end),
      }))
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [timeslots]);

  return (
    <div className="day" key={date.toISOString()}>
      <div className="header">
        <span className="title">{formatEntryHeading(date)}</span>
        <div className="summary-wrapper">
          <span className="summary">
            {formatTimeslot(
              getTimeslotsSum(
                timeslots.filter((timeslot) => !isLunchTimeslot(timeslot))
              )
            )}
          </span>
          {/*{timeslots.length > 0 && (
            <span className="summary">{calcEndTime(date, timeslots)}</span>
          )}*/}
        </div>
      </div>
      {orderedTimeslots.map(({ _id: timeslotId, start, end, activity }) => (
        <div className="entry" key={timeslotId}>
          <div className="timespan">
            {formatTime(start)}&nbsp;-&nbsp;{formatTime(end)}
          </div>
          <div className="description">
            {activity}
            {/*{isLastInstanceOfActivityForDay(
                    timeslotsArray,
                    timeslot,
                    timeslotIndex
                  ) && (
                    <span className="entry-summary">
                      (
                      {getTotalTimeForActivity(
                        timeslot.activity,
                        timeslots
                      ).toFixed(2)}
                      )
                    </span>
                  )}*/}
          </div>
          {
            <div className="entry-controls">
              <button className="entry-control edit" />
              <button
                className="entry-control delete"
                onClick={() => handleOnRemoveTimeslot(timeslotId)}
              />
            </div>
          }
        </div>
      ))}
      <TimeslotInput
        onSave={handleOnAddTimeslot}
        validate={validateTimeslotInput}
      />
    </div>
  );
}

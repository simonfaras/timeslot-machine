import React, { useEffect, useMemo, useState, useRef } from 'react';
import EntryRow, { TimeslotFields } from './EntryRow';
import EntryControls from './EntryControls';
import { EntryRowRef } from './EntryRow/EntryRow';
import { Timeslot } from '@/data/storage';
import { useCreateTimeslot } from '@/data/queries';

const weekdays = [
  'Söndag',
  'Måndag',
  'Tisdag',
  'Onsdag',
  'Torsdag',
  'Fredag',
  'Lördag',
];

interface TimeslotParsed extends Pick<Timeslot, 'id' | 'description'> {
  start: Date;
  end: Date;
}

interface DayProps {
  id: string;
  date: Date;
  timeslots: Timeslot[];
  defaultLunchDuration: number;
  workWeekHours: number;
}

type Interval = {
  start: Date;
  end: Date;
};

const areIntervalsOverlapping = (a: Interval, b: Interval): boolean => {
  return b.start.getTime() < a.end.getTime();
};

const addMinutes = (date: Date, minutes: number) =>
  new Date(date.getTime() + minutes * 60 * 1000);

const formatTime = (date: Date) =>
  new Intl.DateTimeFormat('sv-SE', { timeStyle: 'short' }).format(date);

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('sv-SE', { dateStyle: 'medium' }).format(date);

const getTimeslotsSum = (timeslots: TimeslotParsed[]) => {
  const getTimespan = ({ start, end }: { start: Date; end: Date }) => {
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
    .map(({ description }) => description)
    .lastIndexOf(timeslot.description);

  return (
    timeslots.findIndex(({ id }) => timeslot.id === id) === lastIndexOfActivity
  );
};

const getTotalTimeForActivity = (
  activity: string,
  timeslots: TimeslotParsed[]
) =>
  getTimeslotsSum(
    timeslots.filter((timeslot) => timeslot.description === activity)
  ) /
  1000 /
  60 /
  60;

const isLunchTimeslot = (timeslot: TimeslotParsed) =>
  timeslot.description.toLowerCase() === 'lunch';

const formatEntryHeading = (date: Date) => {
  return `${weekdays[date.getDay()]} - ${formatDate(date)}`;
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
    const defaultLunchStart = createTimestamp('12:00');
    const defaultLunchEnd = addMinutes(defaultLunchStart, lunchDuration);

    timeslots.push({
      id: 'default_lunch',
      description: 'lunch',
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

  const endTime = addMinutes(
    new Date(timeslots[0].start),
    Math.floor((workWeekHours / 5) * 60) + breakTime
  );

  return formatTime(endTime);
};

const createTimestampParser =
  (date: Date) =>
  (time: string): Date => {
    const [hours, minutes] = time.split(':').map((n) => Number.parseInt(n));
    const d = new Date(date);
    d.setHours(hours, minutes, 0, 0);

    return d;
  };

export default function Day({
  id,
  date,
  timeslots,
  defaultLunchDuration,
  workWeekHours,
}: DayProps) {
  const timestamp = createTimestampParser(date);

  const [editTimeslotId, setEditTimeslotId] = useState<string | null>(null);

  const createTimeslot = useCreateTimeslot(id);
  const updateTimeslot = useUpdateTimeslot(id);
  const deleteTimeslot = useDeleteTimeslot(id);

  const createTimeslotInput = useRef<EntryRowRef>(null);

  const handleOnCreateTimeslot = ({ start, end, activity }: TimeslotFields) => {
    if (start == null || end == null) {
      console.error('Invalid start or end', { start, end });
      return;
    }

    createTimeslot({
      start: timestamp(start).toISOString(),
      end: timestamp(end).toISOString(),
      activity,
    });

    createTimeslotInput.current?.focus();
  };

  const handleOnUpdateTimeslot = (
    id: string,
    { start, end, activity }: TimeslotFields
  ) => {
    if (start == null || end == null) {
      console.error('Invalid start or end', { start, end });
      return;
    }

    updateTimeslot(id, {
      start: timestamp(start).toISOString(),
      end: timestamp(end).toISOString(),
      activity,
    });

    createTimeslotInput.current?.focus();
  };

  const handleOnDeleteTimeslot = (id: string) => {
    deleteTimeslot(id);
  };

  const validateTimeslotInput = (
    { start, end }: TimeslotFields,
    { ignoreOverlapsFor = [] }: { ignoreOverlapsFor?: string[] } = {}
  ): string | null => {
    if (start == null || end == null) {
      console.error('Invalid start or end', { start, end });
      return null;
    }

    const inputInterval = {
      start: timestamp(start),
      end: timestamp(end),
    };

    const duration =
      inputInterval.end.getTime() - inputInterval.start.getTime();

    if (duration === 0) {
      return 'SAME DATE ERROR';
    }

    if (duration < 0) {
      return 'END BEFORE START ERROR';
    }

    const overlaps = timeslots
      .filter((timeslot) => !ignoreOverlapsFor.includes(timeslot.id))
      .find((timeslot) =>
        areIntervalsOverlapping(inputInterval, {
          start: new Date(timeslot.start),
          end: new Date(timeslot.end),
        })
      );

    if (overlaps) {
      return 'OVERLAPS ERROR';
    }
    return null;
  };

  useEffect(() => {
    if (editTimeslotId === null) {
      createTimeslotInput.current?.focus();
    }
  }, [editTimeslotId]);

  const orderedTimeslots = useMemo(() => {
    return timeslots
      .slice()
      .map((timeslot) => ({
        ...timeslot,
        start: new Date(timeslot.start),
        end: new Date(timeslot.end),
      }))
      .sort((a, b) => a.start.getTime() - b.end.getTime());
  }, [timeslots]);

  /*
  padding: 0.75rem 1rem 1rem 1rem;
  border-radius: 4px;
  border: 1px solid #282c34;
  box-shadow: 2px 2px 1px rgba(0, 0, 0, 0.2);
  & + & {
    margin-top: 0.5rem;
  }
  */
  /*
  display: flex;
  justify-content: space-between;
  align-items: baseline;
 */

  /*
  display: block;
  margin-left: 1rem;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  border: 1px dashed #282c34;
  */
  return (
    <div className="p-4 pt-3 rounded-md border-slate-950 shadow-lg">
      <div className="flex justify-between items-baseline">
        <h2>{formatEntryHeading(date)}</h2>
        <div className="flex">
          <div className="ml-4 py-1 px-2 rounded-md border border-dashed border-slate-950">
            {formatTimeslot(
              getTimeslotsSum(
                orderedTimeslots.filter(
                  (timeslot) => !isLunchTimeslot(timeslot)
                )
              )
            )}
          </div>
          {timeslots.length > 0 && (
            <div className="ml-4 py-1 px-2 rounded-md border border-dashed border-slate-950">
              {calcEndTime(
                orderedTimeslots,
                timestamp,
                defaultLunchDuration,
                workWeekHours
              )}
            </div>
          )}
        </div>
      </div>
      {orderedTimeslots.map((timeslot, index, collection) => (
        <div key={timeslot.id} className="relative mt-2">
          <EntryRow
            key={`${timeslot.id}-${timeslot.start}-${timeslot.end}-${timeslot.description}`}
            onSave={(values) => handleOnUpdateTimeslot(timeslot.id, values)}
            validate={(values) =>
              validateTimeslotInput(values, {
                ignoreOverlapsFor: [timeslot.id],
              })
            }
            defaultStart={formatTime(timeslot.start)}
            defaultEnd={formatTime(timeslot.end)}
            defaultActivity={timeslot.description}
          >
            {(hasSaveButton) => (
              <>
                {!hasSaveButton &&
                  !isLunchTimeslot(timeslot) &&
                  isLastInstanceOfActivity(timeslot, collection) && (
                    <div className="absolute text-sm right-0 top-0">
                      (
                      {getTotalTimeForActivity(
                        timeslot.description,
                        collection
                      ).toFixed(2)}
                      )
                    </div>
                  )}

                <EntryControls
                  onEdit={() => setEditTimeslotId(timeslot.id)}
                  onDelete={() => handleOnDeleteTimeslot(timeslot.id)}
                  hidden={hasSaveButton}
                />
              </>
            )}
          </EntryRow>
        </div>
      ))}
      {!editTimeslotId && (
        <div className="relative mt-2 group">
          <EntryRow
            ref={createTimeslotInput}
            onSave={handleOnCreateTimeslot}
            validate={validateTimeslotInput}
          />
        </div>
      )}
    </div>
  );
}

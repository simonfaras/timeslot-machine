import { useState } from "react";

import formatDate from "date-fns/format";
import parseISODate from "date-fns/parseISO";
import addDate from "date-fns/add";
import useStorage from "../src/utils/useStorage";
import TimeslotInput, { Timeslot } from "../src/components/TimeslotInput";

const weekdays = [
  "Söndag",
  "Måndag",
  "Tisdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lördag",
];

interface EditTimeslot extends Partial<Timeslot> {
  date: Date;
  timeslotIndex: number;
}

interface Day {
  date: Date;
  timeslots: Timeslot[];
}

const initialSettings = {
  lunchDuration: 30,
  workdayHours: 8,
};

type Settings = typeof initialSettings;

const formatEntryHeading = (date: Date) =>
  `${weekdays[date.getDay()]} - ${formatDate(date, "d/M")}`;

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

const isLunchTimeslot = (timeslot: Timeslot) =>
  timeslot.activity.toLowerCase() === "lunch";

const parseDays = (days) =>
  days.map((day) => ({
    ...day,
    date: parseISODate(day.date),
  }));

const App = () => {
  const [settings, setSettings] = useStorage(initialSettings, "settings");
  const [days, setDays] = useStorage<Day[]>([], "days", parseDays);
  const [editTimeslot, setEditTimeslot] = useState<EditTimeslot>(null);
  const [addDayDate, setAddDayDate] = useState(
    formatDate(new Date(Date.now()), "yyyy-MM-dd")
  );

  const updateSettings = (property: keyof Settings, value: any) =>
    setSettings((current) => ({
      ...current,
      [property]: value,
    }));

  const addDay = (date: Date) =>
    setDays((current) => [...current, { date, timeslots: [] }]);

  const addTimeslot = (dayIndex: number, timeslot: Timeslot) => {
    setDays((current) => [
      ...current.slice(0, dayIndex),
      {
        ...current[dayIndex],
        timeslots: [...current[dayIndex].timeslots, timeslot],
      },
      ...current.slice(dayIndex + 1),
    ]);
  };

  const updateTimeslot = (
    dayIndex: number,
    timeslotIndex: number,
    timeslot: Timeslot
  ) => {
    setDays((current) => [
      ...current.slice(0, dayIndex),
      {
        ...current[dayIndex],
        timeslots: [
          ...current[dayIndex].timeslots.slice(0, timeslotIndex),
          timeslot,
          ...current[dayIndex].timeslots.slice(timeslotIndex + 1),
        ],
      },
      ...current.slice(dayIndex + 1),
    ]);
    setEditTimeslot(null);
  };

  const deleteTimeslot = (dayIndex: number, timeslotIndex: number) => {
    setDays((current) => [
      ...current.slice(0, dayIndex),
      {
        ...current[dayIndex],
        timeslots: [
          ...current[dayIndex].timeslots.slice(0, timeslotIndex),
          ...current[dayIndex].timeslots.slice(timeslotIndex + 1),
        ],
      },
      ...current.slice(dayIndex + 1),
    ]);
  };

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
    const lunchTimeslot = timeslots.find((timeslot) =>
      isLunchTimeslot(timeslot)
    );
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

  const handleClearAll = () => {
    if (window.confirm("Ta bort allt?")) {
      setDays([]);
    }
  };

  const isEditEntry = (date, timeslotIndex) =>
    date === editTimeslot?.date &&
    timeslotIndex === editTimeslot?.timeslotIndex;

  const hasDay = (date) =>
    days.some((day) => formatDate(day.date, "yyyy-MM-dd") === date);

  return (
    <div className="root">
      <div className="wrapper">
        <div className="controls-wrapper">
          <div className="controls">
            {days.length > 0 && (
              <button onClick={handleClearAll}>Rensa&nbsp;allt</button>
            )}
            <div className="input-wrapper">
              <label htmlFor="lunch-duration">Lunch&nbsp;(min):</label>
              <input
                type="number"
                id="lunch-duration"
                value={settings.lunchDuration}
                onChange={(e) =>
                  updateSettings(
                    "lunchDuration",
                    Number.parseInt(e.target.value)
                  )
                }
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="workday-hours">Arbetstid&nbsp;(timmar):</label>
              <input
                type="number"
                id="workday-hours"
                value={settings.workdayHours}
                onChange={(e) => updateSettings("workdayHours", e.target.value)}
              />
            </div>
          </div>
        </div>
        {days.map(({ date, timeslots }, dayIndex, daysArray) => (
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
                {timeslots.length > 0 && (
                  <span className="summary">
                    {calcEndTime(date, timeslots)}
                  </span>
                )}
              </div>
            </div>
            {timeslots.map((timeslot, timeslotIndex, timeslotsArray) =>
              !isEditEntry(date, timeslotIndex) ? (
                <div className="entry" key={timeslot.start}>
                  <div className="timespan">
                    {timeslot.start}&nbsp;-&nbsp;{timeslot.end}
                  </div>
                  <div className="description">
                    {timeslot.activity}
                    {isLastInstanceOfActivityForDay(
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
                    )}
                  </div>
                  <div className="entry-controls">
                    <button
                      className="entry-control edit"
                      onClick={() => setEditTimeslot({ date, timeslotIndex })}
                    />
                    <button
                      className="entry-control delete"
                      onClick={() => deleteTimeslot(dayIndex, timeslotIndex)}
                    />
                  </div>
                </div>
              ) : (
                <TimeslotInput
                  key={timeslot.start}
                  onChange={(timeslot) =>
                    updateTimeslot(dayIndex, timeslotIndex, timeslot)
                  }
                  {...timeslot}
                />
              )
            )}
            {dayIndex === daysArray.length - 1 && (
              <TimeslotInput
                onChange={(timeslot) => addTimeslot(dayIndex, timeslot)}
              />
            )}
          </div>
        ))}
        {/*{!days.some(({ date }) => isToday(date)) && (*/}
        {/*  <button className="add-today" onClick={() => addDay(today)}>*/}
        {/*    {formatEntryHeading(today)}*/}
        {/*  </button>*/}
        {/*)}*/}
        <div className="add-day-wrapper">
          <input
            type="date"
            value={addDayDate}
            onChange={(e) => setAddDayDate(e.target.value)}
          />
          <button
            onClick={() => addDay(new Date(addDayDate))}
            disabled={hasDay(addDayDate)}
          >
            Lägg till
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;

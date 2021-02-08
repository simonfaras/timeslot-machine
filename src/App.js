import { useState } from "react";
import "./App.css";
import formatDate from "date-fns/format";
import parseISODate from "date-fns/parseISO";
import addDate from "date-fns/add";
import useStorage from "./utils/useStorage";
import EntryInput from "./components/EntryInput";

const weekdays = [
  "Söndag",
  "Måndag",
  "Tisdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lördag",
];

const formatEntryHeading = (date) =>
  `${weekdays[date.getDay()]} - ${formatDate(date, "d/M")}`;

const getTimeslotsSum = (timeslots) => {
  const getTimespan = ({ start, end }) => {
    const startDate = new Date(`2020-01-01 ${start}`);
    const endDate = new Date(`2020-01-01 ${end}`);

    return endDate - startDate;
  };

  return timeslots.reduce((sum, timeslot) => sum + getTimespan(timeslot), 0);
};

const formatTimeslot = (timeslot) => {
  const minutes = timeslot / 1000 / 60;

  return `${Math.floor(minutes / 60)} tim ${minutes % 60} min`;
};

const isLastInstanceOfActivityForDay = (timeslots, timeslot, index) => {
  const lastIndex = timeslots
    .map(({ activity }) => activity)
    .lastIndexOf(timeslot.activity);

  return lastIndex === index;
};

const getTotalTimeForActivity = (activity, timeslots) =>
  getTimeslotsSum(
    timeslots.filter((timeslot) => timeslot.activity === activity)
  ) /
  1000 /
  60 /
  60;

const isLunchTimeslot = (timeslot) =>
  timeslot.activity.toLowerCase() === "lunch";

const parseDays = (days) =>
  days.map((day) => ({
    ...day,
    date: parseISODate(day.date),
  }));

const App = () => {
  const [settings, setSettings] = useStorage(
    {
      lunchDuration: "30",
      workdayHours: "8",
    },
    "settings"
  );
  const [days, setDays] = useStorage([], "days", parseDays);
  const [editTimeslot, setEditTimeslot] = useState(null);
  const [addDayDate, setAddDayDate] = useState(
    formatDate(new Date(Date.now()), "yyyy-MM-dd")
  );

  const updateSettings = (property, value) =>
    setSettings((current) => ({
      ...current,
      [property]: value,
    }));

  const addDay = (date) =>
    setDays((current) => [...current, { date, timeslots: [] }]);

  const addTimeslot = (dayIndex, timeslot) => {
    setDays((current) => [
      ...current.slice(0, dayIndex),
      {
        ...current[dayIndex],
        timeslots: [...current[dayIndex].timeslots, timeslot],
      },
      ...current.slice(dayIndex + 1),
    ]);
  };

  const updateTimeslot = (dayIndex, timeslotIndex, timeslot) => {
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

  const deleteTimeslot = (dayIndex, timeslotIndex) => {
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

  const calcEndTime = (date, timeslotsArray) => {
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

    let lunchDuration = Number.parseInt(settings.lunchDuration);
    const lunchTimeslot = timeslots.find((timeslot) =>
      isLunchTimeslot(timeslot)
    );
    if (lunchTimeslot) {
      lunchDuration =
        (new Date(`${dateString} ${lunchTimeslot.end}`) -
          new Date(`${dateString} ${lunchTimeslot.start}`)) /
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
                  updateSettings("lunchDuration", e.target.value)
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
          <div className="day" key={date}>
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
                <EntryInput
                  key={timeslot.start}
                  onChange={(timeslot) =>
                    updateTimeslot(dayIndex, timeslotIndex, timeslot)
                  }
                  {...timeslot}
                />
              )
            )}
            {dayIndex === daysArray.length - 1 && (
              <EntryInput
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

import { useState } from "react";
import { useSession } from "next-auth/client";

import formatDate from "date-fns/format";
import parseISODate from "date-fns/parseISO";

import useStorage from "@/utils/useStorage";


interface EditTimeslot extends Partial<Timeslot> {
  date: Date;
  timeslotIndex: number;
}

interface Day {
  id?: string;
  date: Date;
  timeslots: Pick<Timeslot>[];
}

const initialSettings = {
  lunchDuration: 30,
  workdayHours: 8,
};



const parseDays = (days) =>
  days.map((day) => ({
    ...day,
    date: parseISODate(day.date),
  }));

const TimeslotsPage = () => {
  const [session, loading] = useSession();

  const [days, setDays] = useStorage<Day[]>([], "days", parseDays)
  const [addDayDate, setAddDayDate] = useState(
    formatDate(new Date(Date.now()), "yyyy-MM-dd")
  );

  const addDay = (date: Date) =>
    setDays((current) => [...current, { date, timeslots: [] }]);

  const hasDay = (date) =>
    days.some((day) => formatDate(day.date, "yyyy-MM-dd") === date);

  if (!!global.window && loading) {
    console.log("loading session");
    return null;
  }

  if (!session) {
    return <div>Access denied</div>;
  }


  return (
    <div className="root">
      <div className="wrapper">
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

export default TimeslotsPage;

export { default as getServerSideProps } from "@/utils/authProps";

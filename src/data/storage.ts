interface Timeslot {
  id: string;
  start: Date;
  end: Date;
  description: string;
}

interface Day {
  id: string;
  timeslots: Timeslot[];
  date: Date;
}

interface Period {
  id: string;
  days: Day[];
}

const key = "timeslot-data";

const getData = (): Period[] => {
  const data = localStorage.getItem(key);

  if (typeof data === "string") {
    return JSON.parse(data);
  }

  return [];
};

const saveData = () => {
  localStorage.setItem(key, JSON.stringify(saveData));
};

const periods: Period[] = getData();

export const getPeriod = async (id: string): Promise<Period | null> => {
  return periods.find((period) => period.id === id) ?? null;
};

export const getAllPeriods = async (): Promise<Period[]> => {
  return periods;
};

export const createPeriod = async (): Promise<Period> => {
  const period = {
    id: crypto.randomUUID(),
    days: [],
  };

  periods.push(period);

  saveData();

  return period;
};

export const createDay = async (periodId: string, date: Date): Promise<Day> => {
  const period = await getPeriod(periodId);

  if (period == null) {
    throw new Error("Unknown period");
  }

  const day: Day = {
    id: crypto.randomUUID(),
    timeslots: [],
    date,
  };

  period.days.push(day);

  saveData();

  return day;
};

type CreateTimeslotInput = Omit<Timeslot, "id">;

export const createTimeslot = async (
  periodId: string,
  dayId: string,
  timeslot: CreateTimeslotInput
): Promise<Timeslot> => {
  const day = periods
    ?.find((period) => period.id === periodId)
    ?.days.find((day) => day.id === dayId);

  if (day == null) {
    throw new Error("Unknown day");
  }

  const newTimeslot: Timeslot = {
    id: crypto.randomUUID(),
    ...timeslot,
  };

  day.timeslots.push(newTimeslot);

  saveData();

  return newTimeslot;
};

export const updateTimeslot = async (
  periodId,
  dayId,
  timeslot: Timeslot
): Promise<Timeslot> => {
  const oldTimeslot = periods
    ?.find((period) => period.id === periodId)
    ?.days.find((day) => day.id === dayId)
    ?.timeslots.find((t) => t.id === timeslot.id);

  if (oldTimeslot == null) {
    throw new Error("Unknown timeslot");
  }

  Object.assign(oldTimeslot, timeslot);

  saveData();

  return timeslot;
};

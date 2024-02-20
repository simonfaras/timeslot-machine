'use client';
export interface Timeslot {
  id: string;
  start: Date;
  end: Date;
  description: string;
  isBillable: boolean;
}

export interface Day {
  id: string;
  timeslots: Timeslot[];
  date: Date;
}

export interface Period {
  id: string;
  days: Day[];
}

const key = 'timeslot-data';

const getData = (): Period[] => {
  const data = globalThis?.localStorage?.getItem(key);

  const periods: Period[] = typeof data === 'string' ? JSON.parse(data) : [];

  return periods.map((period) => ({
    ...period,
    days: period.days.map((day) => ({
      ...day,
      date: new Date(day.date),
      timeslots: day.timeslots.map((timeslot) => ({
        ...timeslot,
        start: new Date(timeslot.start),
        end: new Date(timeslot.end),
      })),
    })),
  }));
};

const saveData = () => {
  localStorage?.setItem(key, JSON.stringify(periods));
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

export type CreateDayInput = Omit<Day, 'id' | 'timeslots'>;

export const createDay = async (
  periodId: string,
  day: CreateDayInput
): Promise<Day> => {
  const period = await getPeriod(periodId);

  if (period == null) {
    throw new Error('Unknown period');
  }

  const newDay: Day = {
    id: crypto.randomUUID(),
    timeslots: [],
    ...day,
  };

  period.days.push(newDay);

  saveData();

  return newDay;
};

export type CreateTimeslotInput = Omit<Timeslot, 'id'>;

export const createTimeslot = async (
  periodId: string,
  dayId: string,
  timeslot: CreateTimeslotInput
): Promise<Timeslot> => {
  const day = periods
    ?.find((period) => period.id === periodId)
    ?.days.find((day) => day.id === dayId);

  if (day == null) {
    throw new Error('Unknown day');
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
  periodId: string,
  dayId: string,
  timeslot: Timeslot
): Promise<Timeslot> => {
  const oldTimeslot = periods
    ?.find((period) => period.id === periodId)
    ?.days.find((day) => day.id === dayId)
    ?.timeslots.find((t) => t.id === timeslot.id);

  if (oldTimeslot == null) {
    throw new Error('Unknown timeslot');
  }

  Object.assign(oldTimeslot, timeslot);

  saveData();

  return timeslot;
};

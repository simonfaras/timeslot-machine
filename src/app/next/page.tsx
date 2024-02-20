import { Period } from '@/data/storage';
import clsx from 'clsx';

const mockPeriod: Period = {
  id: 'period-01',
  days: [
    {
      id: 'day-01',
      date: new Date('2024-01-21T08:00:00Z'),
      timeslots: [
        {
          id: 'period-01-day-01-slot-01',
          start: new Date('2024-01-21T07:00:00Z'),
          end: new Date('2024-01-21T11:00:00Z'),
          description: 'Work',
          isBillable: true,
        },
        {
          id: 'period-01-day-01-slot-02',
          start: new Date('2024-01-21T11:00:00Z'),
          end: new Date('2024-01-21T12:00:00Z'),
          description: 'Lunch',
          isBillable: false,
        },
        {
          id: 'period-01-day-01-slot-03',
          start: new Date('2024-01-21T12:00:00Z'),
          end: new Date('2024-01-21T14:00:00Z'),
          description: 'Work',
          isBillable: true,
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {mockPeriod.days.map((day) => (
        <div key={day.id}>
          <h2 className="mb-2">
            {new Intl.DateTimeFormat('sv-SE', {
              weekday: 'long',
              day: 'numeric',
              month: 'numeric',
            }).format(day.date)}
          </h2>
          <div className="rounded-md border-2 border-zinc-500 p-2 flex flex-col gap-2">
            {day.timeslots.map((timeslot) => (
              <div
                key={timeslot.id}
                className={clsx(
                  'rounded-md border-2 border-zinc-400 p-2 flex flex-col items-center w-60 gap-2',
                  {
                    'bg-green-200': timeslot.isBillable,
                    'bg-red-200': !timeslot.isBillable,
                  }
                )}
              >
                <span>
                  {new Intl.DateTimeFormat('sv-SE', {
                    timeStyle: 'short',
                  }).format(timeslot.start)}
                </span>
                <span>{timeslot.description}</span>
                <span>
                  {new Intl.DateTimeFormat('sv-SE', {
                    timeStyle: 'short',
                  }).format(timeslot.end)}
                </span>
              </div>
            ))}
            <button
              className={clsx(
                'rounded-md border-2 border-zinc-400 p-2 flex flex-col items-center w-60 gap-2 bg-blue-200'
              )}
            >
              <span>+</span>
            </button>
          </div>
        </div>
      ))}
    </main>
  );
}

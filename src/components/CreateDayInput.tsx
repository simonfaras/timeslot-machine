import { useCreateDay } from '@/data/queries';
import React, { useState } from 'react';

interface CreateDayInput {
  periodId: string;
  disabled(date: string): boolean;
}

export default function CreateDayInput({ periodId, disabled }: CreateDayInput) {
  const [value, setValue] = useState(
    new Intl.DateTimeFormat('sv-SE', { dateStyle: 'medium' }).format(
      new Date(Date.now())
    )
  );
  const createDay = useCreateDay(periodId);

  return (
    <div className="flex justify-end gap-2">
      <input
        type="date"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        onClick={() => createDay.mutate({ date: new Date(value) })}
        disabled={disabled(value)}
      >
        Lägg till
      </button>
    </div>
  );
}

import { useCreateDay } from '@/data/queries';
import React, { useState } from 'react';

interface CreateDayInput {
  periodId: string;
  disabled(date: Date): boolean;
}

const formatDate = new Intl.DateTimeFormat('sv-SE', {
  month: '2-digit',
  year: 'numeric',
  day: '2-digit',
}).format;

export default function CreateDayInput({ periodId, disabled }: CreateDayInput) {
  const [value, setValue] = useState(new Date(Date.now()));
  const createDay = useCreateDay(periodId);

  return (
    <div className="flex justify-end gap-2">
      <input
        type="date"
        value={formatDate(value)}
        onChange={(e) => {
          const date = new Date(e.currentTarget.value);
          setValue(date);
        }}
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

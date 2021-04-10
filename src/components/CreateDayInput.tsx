import React, { useState } from "react";
import formatDate from "date-fns/format";
import { useCreateDay } from "@/graphql/mutations/dayMutations";

interface CreateDayInput {
  periodId: string;
  disabled(date: string): boolean;
}

export default function CreateDayInput({ periodId, disabled }: CreateDayInput) {
  const [value, setValue] = useState(
    formatDate(new Date(Date.now()), "yyyy-MM-dd")
  );
  const createDay = useCreateDay(periodId);

  return (
    <div className="add-day-wrapper" key="add-day">
      <input
        type="date"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        onClick={() => createDay({ date: value })}
        disabled={disabled(value)}
      >
        Lägg till
      </button>
    </div>
  );
}

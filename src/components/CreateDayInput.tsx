import React, { useState } from "react";
import styled from "styled-components";
import formatDate from "date-fns/format";
import { useCreateDay } from "@/graphql/mutations/dayMutations";

const CreateDayInputContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  * + * {
    margin-left: 0.5rem;
  }
`;

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
    <CreateDayInputContainer>
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
    </CreateDayInputContainer>
  );
}

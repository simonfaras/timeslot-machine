import React, { useEffect, useState, useRef } from "react";
import TimeInput from "./TimeInput";

export interface TimeslotFields {
  start?: string;
  end?: string;
  activity?: string;
}

interface TimeslotInputProps {
  onSave(values: TimeslotFields): void;
  validate(values: TimeslotFields): string | null;
  defaultStart?: string;
  defaultEnd?: string;
  defaultActivity?: string;
}

const isValidTimeValue = (value) => /\d{2}:\d{2}/.test(value);

const TimeslotInput = ({
  onSave,
  validate,
  defaultStart = "",
  defaultEnd = "",
  defaultActivity = "",
}: TimeslotInputProps) => {
  const startInput = useRef(null);
  const endInput = useRef(null);
  const activityInput = useRef(null);

  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);
  const [activity, setActivity] = useState(defaultActivity);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const values = { start, end, activity };

    const error = validate(values);

    if (error) {
      setErrorMessage(error);
    } else {
      setErrorMessage("");
      onSave(values);
      startInput.current.clear();
      endInput.current.clear();
      setActivity("");

      startInput.current.focus();
    }
  };

  const hasRequiredInputs =
    isValidTimeValue(start) && isValidTimeValue(end) && activity;

  if (errorMessage) {
    console.error(errorMessage);
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="entry entry-input">
        <div className="timespan">
          <TimeInput
            onChange={(value) => {
              setStart(value);
            }}
            value={start}
            ref={startInput}
          />
          <span>&nbsp;-&nbsp;</span>
          <TimeInput onChange={setEnd} value={end} ref={endInput} />
        </div>
        <div className="description">
          <input
            type="text"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            ref={activityInput}
          />
          <button type="submit" disabled={!hasRequiredInputs}>
            Spara
          </button>
        </div>
      </div>
    </form>
  );
};

export default TimeslotInput;

import React, { useEffect, useState, useRef } from "react";
import TimeInput from "./TimeInput";

export interface TimeslotFields {
  start?: string;
  end?: string;
  activity?: string;
}

interface TimeslotInputProps {
  onSave(values: TimeslotFields): void;
}

const isValidTimeValue = (value) => /\d{2}:\d{2}/.test(value);

const TimeslotInput = ({ onSave }: TimeslotInputProps) => {
  const startInput = useRef(null);
  const endInput = useRef(null);
  const activityInput = useRef(null);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [activity, setActivity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({ start, end, activity });
    startInput.current.clear();
    endInput.current.clear();
    setActivity("");

    startInput.current.focus();
  };

  const hasValidInput =
    isValidTimeValue(start) && isValidTimeValue(end) && activity;

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
          <button type="submit" disabled={!hasValidInput}>
            Spara
          </button>
        </div>
      </div>
    </form>
  );
};

export default TimeslotInput;

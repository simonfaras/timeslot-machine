import React from "react";

export interface Timeslot {
  start: string;
  end: string;
  activity: string;
}

interface TimeslotInputProps extends Partial<Timeslot> {
  onChange(values: Timeslot): void;
}

const TimeslotInput = ({
  onChange,
  start = "",
  end = "",
  activity = "",
}: TimeslotInputProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const values = Array.from(formData).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value }),
      {}
    );

    onChange(values as Timeslot);
    e.currentTarget.reset();
    e.target[0].focus();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="entry entry-input">
        <div className="timespan">
          <input type="time" name="start" defaultValue={start} required />
          <span className="separator">-</span>
          <input type="time" name="end" defaultValue={end} required />
        </div>
        <div className="description">
          <input type="text" name="activity" defaultValue={activity} required />
          <button type="submit">Spara</button>
        </div>
      </div>
    </form>
  );
};

export default TimeslotInput;

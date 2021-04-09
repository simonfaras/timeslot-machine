import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import styled from "styled-components";

const TimeInputWrapper = styled.div`
  display: flex;
`;

const Input = styled.input`
  font-variant-numeric: tabular-nums;
  padding: 0;
`;

const HOURS_EXPRESSION = /^([0-2]|[0-1][0-9]|2[0-3])$/i;
const MINUTES_EXPRESSION = /^([0-5]|[0-5][0-9])$/i;
const TIME_EXPRESION = /^\d{2}:\d{2}$/i;

const isValidInput = (value, regExp) => value === "" || regExp.test(value);

interface TimeInputProps {
  value?: string;
  onChange: (value: string) => void;
}

interface TimeInputRef {
  focus: () => void;
}

const EMPTY_VALUE = "";

const parseValue = (value: string) => {
  const [hours, minutes] = value.split(":");

  return [
    hours?.length ? hours : EMPTY_VALUE,
    minutes?.length ? minutes : EMPTY_VALUE,
  ];
};

const TimeInput = forwardRef<TimeInputRef, TimeInputProps>(
  ({ value = "", onChange }: TimeInputProps, ref) => {
    const [hoursValue, minutesValue] = parseValue(value);

    const hoursInput = useRef(null);
    const minutesInput = useRef(null);
    const [hours, setHours] = useState(hoursValue);
    const [minutes, setMinutes] = useState(minutesValue);

    const isDirty = hours !== hoursValue || minutes !== minutesValue;

    useImperativeHandle(ref, () => ({
      focus: () => hoursInput.current.focus(),
      clear: () => {
        setHours(EMPTY_VALUE);
        setMinutes(EMPTY_VALUE);
        onChange("");
      },
    }));

    // Call onChange if internal state is changed to a valid time value
    useEffect(() => {
      if (!isDirty) {
        return;
      }

      const timeValue = `${hours}:${minutes}`;
      if (
        // If current was changed to a valid value or from a valid to an invalid value we call the onChange
        // This allows for the callee to determine if the value is valid while allowing for valid inputs to be edited
        isValidInput(timeValue, TIME_EXPRESION) ||
        isValidInput(value, TIME_EXPRESION)
      ) {
        onChange(timeValue);
      }
    }, [hours, minutes, value, isDirty, onChange]);

    // Sync state with values
    useEffect(() => {
      setHours(hoursValue);
      setMinutes(minutesValue);
    }, [hoursValue, minutesValue, setHours, setMinutes]);

    const handleHoursChange = (e) => {
      const value = e.target.value;
      if (isValidInput(value, HOURS_EXPRESSION)) {
        setHours(value);
        if (value.length === 2) {
          minutesInput.current.focus();
        }
      }
    };

    const handleMinutesChange = (e) => {
      const value = e.target.value;
      if (isValidInput(value, MINUTES_EXPRESSION)) {
        setMinutes(value);
      }
    };

    const handleFocus = (e) => {
      e.target.select();
    };

    return (
      <TimeInputWrapper>
        <Input
          type="text"
          placeholder="hh"
          size="1"
          value={hours}
          onChange={handleHoursChange}
          onFocus={handleFocus}
          ref={hoursInput}
        />
        <span>:</span>
        <Input
          type="text"
          placeholder="mm"
          size="1"
          value={minutes}
          onChange={handleMinutesChange}
          onFocus={handleFocus}
          ref={minutesInput}
        />
      </TimeInputWrapper>
    );
  }
);

TimeInput.displayName = "TimeInput";

export default TimeInput;

import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react';

const HOURS_EXPRESSION = /^([0-2]|[0-1][0-9]|2[0-3])$/i;
const MINUTES_EXPRESSION = /^([0-5]|[0-5][0-9])$/i;
const TIME_EXPRESION = /^\d{2}:\d{2}$/i;

const isValidInput = (value: string, regExp: RegExp) =>
  value === '' || regExp.test(value);

interface TimeInputProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export interface TimeInputRef {
  focus: () => void;
  clear: () => void;
}

const EMPTY_VALUE = '';

const parseValue = (value: string) => {
  const [hours, minutes] = value.split(':');

  return [
    hours?.length ? hours : EMPTY_VALUE,
    minutes?.length ? minutes : EMPTY_VALUE,
  ];
};

const TimeInput = forwardRef<TimeInputRef, TimeInputProps>(
  ({ value = '', onChange, disabled = false }: TimeInputProps, ref) => {
    const [hoursValue, minutesValue] = parseValue(value);

    const hoursInput = useRef<HTMLInputElement>(null);
    const minutesInput = useRef<HTMLInputElement>(null);
    const [hours, setHours] = useState(hoursValue);
    const [minutes, setMinutes] = useState(minutesValue);

    const isDirty = hours !== hoursValue || minutes !== minutesValue;

    useImperativeHandle(ref, () => ({
      focus: () => hoursInput.current?.focus(),
      clear: () => {
        setHours(EMPTY_VALUE);
        setMinutes(EMPTY_VALUE);
        onChange('');
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

    const handleHoursChange: React.ChangeEventHandler<HTMLInputElement> = (
      e
    ) => {
      const value = e.target.value;
      if (isValidInput(value, HOURS_EXPRESSION)) {
        setHours(value);
        if (value.length === 2) {
          minutesInput.current?.focus();
        }
      }
    };

    const handleMinutesChange: React.ChangeEventHandler<HTMLInputElement> = (
      e
    ) => {
      const value = e.target.value;
      if (isValidInput(value, MINUTES_EXPRESSION)) {
        setMinutes(value);
      }
    };

    const handleFocus = (e) => {
      e.target.select();
    };

    return (
      <div className="flex">
        <input
          type="text"
          placeholder="hh"
          size={2}
          disabled={disabled}
          value={hours}
          onChange={handleHoursChange}
          onFocus={handleFocus}
          ref={hoursInput}
          className="tabular-nums p-0 text-black w-[2ch] text-base border-none bg-transparent disabled:text-black focus:outline-none"
        />
        <span>:</span>
        <input
          type="text"
          placeholder="mm"
          size={2}
          disabled={disabled}
          value={minutes}
          onChange={handleMinutesChange}
          onFocus={handleFocus}
          ref={minutesInput}
          className="tabular-nums p-0 text-black w-[2ch] text-base border-none bg-transparent disabled:text-black focus:outline-none"
        />
      </div>
    );
  }
);

TimeInput.displayName = 'TimeInput';

export default TimeInput;

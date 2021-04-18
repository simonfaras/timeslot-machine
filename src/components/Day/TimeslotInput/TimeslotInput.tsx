import React, {
  useImperativeHandle,
  useState,
  useRef,
  forwardRef,
} from "react";
import styled from "styled-components";
import TimeInput from "./TimeInput";

const TimeslotInputContainer = styled.div`
  display: flex;
  position: relative;
`;

const TextInput = styled.input`
  color: #000;
  &:disabled {
    color: #000;
  }
`;

const SaveButton = styled.button`
  visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
`;

interface TimeslotInputRef {
  focus: () => void;
}

export interface TimeslotFields {
  start?: string;
  end?: string;
  activity?: string;
}

interface TimeslotInputProps {
  children?: (isDirty: boolean) => React.ReactNode;
  onSave(values: TimeslotFields): void;
  validate(values: TimeslotFields): string | null;
  defaultStart?: string;
  defaultEnd?: string;
  defaultActivity?: string;
}

const isValidTimeValue = (value) => /\d{2}:\d{2}/.test(value);

const TimeslotInput = forwardRef<TimeslotInputRef, TimeslotInputProps>(
  (
    {
      children = () => null,
      onSave,
      validate,
      defaultStart = "",
      defaultEnd = "",
      defaultActivity = "",
    }: TimeslotInputProps,
    ref
  ) => {
    const startInput = useRef(null);
    const endInput = useRef(null);
    const activityInput = useRef(null);

    const [start, setStart] = useState(defaultStart);
    const [end, setEnd] = useState(defaultEnd);
    const [activity, setActivity] = useState(defaultActivity);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const isDirty =
      start !== defaultStart ||
      end !== defaultEnd ||
      activity !== defaultActivity;

    useImperativeHandle(
      ref,
      () => ({
        focus: () => startInput.current.focus(),
      }),
      []
    );

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

    const showSaveButton = hasRequiredInputs && isDirty;

    if (errorMessage) {
      console.error(errorMessage);
    }

    return (
      <>
        <form onSubmit={handleSubmit}>
          <TimeslotInputContainer>
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
              <TextInput
                type="text"
                placeholder="Aktivitet"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                ref={activityInput}
              />
            </div>
            <SaveButton $visible={showSaveButton} type="submit">
              Spara
            </SaveButton>
          </TimeslotInputContainer>
        </form>
        {children(isDirty)}
      </>
    );
  }
);

TimeslotInput.displayName = "TimeslotInput";

export default TimeslotInput;

import React, {
  useImperativeHandle,
  useState,
  useRef,
  forwardRef,
} from "react";
import styled from "styled-components";
import TimeInput from "./TimeInput";

const EntryRowContainer = styled.div`
  display: flex;
  position: relative;
`;

const Timespan = styled.div`
  display: flex;
`;

const TextInput = styled.input`
  margin-left: 1rem;
  color: #000;
  &:disabled {
    color: #000;
  }
`;

const SaveButton = styled.button`
  visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
`;

interface EntryRowRef {
  focus: () => void;
}

export interface TimeslotFields {
  start?: string;
  end?: string;
  activity?: string;
}

interface EntryRowProps {
  children?: (hasSaveButton: boolean) => React.ReactNode;
  onSave(values: TimeslotFields): void;
  validate(values: TimeslotFields): string | null;
  defaultStart?: string;
  defaultEnd?: string;
  defaultActivity?: string;
}

const isValidTimeValue = (value) => /\d{2}:\d{2}/.test(value);

const EntryRow = forwardRef<EntryRowRef, EntryRowProps>(
  (
    {
      children = () => null,
      onSave,
      validate,
      defaultStart = "",
      defaultEnd = "",
      defaultActivity = "",
    }: EntryRowProps,
    ref
  ) => {
    const startInput = useRef(null);
    const endInput = useRef(null);
    const activityInput = useRef(null);

    const [start, setStart] = useState(defaultStart);
    const [end, setEnd] = useState(defaultEnd);
    const [activity, setActivity] = useState(defaultActivity);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => startInput.current.focus(),
      }),
      []
    );

    const isDirty =
      start !== defaultStart ||
      end !== defaultEnd ||
      activity !== defaultActivity;

    const hasRequiredInputs =
      isValidTimeValue(start) && isValidTimeValue(end) && activity;

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!hasRequiredInputs) {
        setErrorMessage("MISSING INPUT");
        return;
      }

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
      }
    };

    const showSaveButton = hasRequiredInputs && isDirty;

    if (errorMessage) {
      console.error(errorMessage);
    }

    return (
      <>
        <form onSubmit={handleSubmit}>
          <EntryRowContainer>
            <Timespan>
              <TimeInput
                onChange={(value) => {
                  setStart(value);
                }}
                value={start}
                ref={startInput}
              />
              <span>&nbsp;-&nbsp;</span>
              <TimeInput onChange={setEnd} value={end} ref={endInput} />
            </Timespan>
            <TextInput
              type="text"
              placeholder="Aktivitet"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              ref={activityInput}
            />
            <div>
              <SaveButton $visible={showSaveButton} type="submit">
                Spara
              </SaveButton>
            </div>
          </EntryRowContainer>
        </form>
        {children(showSaveButton)}
      </>
    );
  }
);

EntryRow.displayName = "EntryRow";

export default EntryRow;

import React, {
  useImperativeHandle,
  useState,
  useRef,
  forwardRef,
} from 'react';
import TimeInput, { TimeInputRef } from './TimeInput';

export interface EntryRowRef {
  focus: () => void;
}

export interface TimeslotFields {
  start?: string;
  end?: string;
  description?: string;
}

interface EntryRowProps {
  children?: (hasSaveButton: boolean) => React.ReactNode;
  onSave(values: TimeslotFields): void;
  validate(values: TimeslotFields): string | null;
  defaultStart?: string;
  defaultEnd?: string;
  defaultDescription?: string;
}

const isValidTimeValue = (value: string) => /\d{2}:\d{2}/.test(value);

const EntryRow = forwardRef<EntryRowRef, EntryRowProps>(
  (
    {
      children = () => null,
      onSave,
      validate,
      defaultStart = '',
      defaultEnd = '',
      defaultDescription = '',
    }: EntryRowProps,
    ref
  ) => {
    const startInput = useRef<TimeInputRef>(null);
    const endInput = useRef<TimeInputRef>(null);
    const descriptionInput = useRef<HTMLInputElement>(null);

    const [start, setStart] = useState(defaultStart);
    const [end, setEnd] = useState(defaultEnd);
    const [description, setDescription] = useState(defaultDescription);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => startInput.current?.focus(),
      }),
      []
    );

    const isDirty =
      start !== defaultStart ||
      end !== defaultEnd ||
      description !== defaultDescription;

    const hasRequiredInputs =
      isValidTimeValue(start) && isValidTimeValue(end) && description != null;

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!hasRequiredInputs) {
        setErrorMessage('MISSING INPUT');
        return;
      }

      const values = { start, end, description };

      const error = validate(values);

      if (error) {
        setErrorMessage(error);
      } else {
        setErrorMessage('');
        onSave(values);
        startInput.current?.clear();
        endInput.current?.clear();
        setDescription('');
      }
    };

    const showSaveButton = hasRequiredInputs && isDirty;

    if (errorMessage) {
      console.error(errorMessage);
    }

    return (
      <>
        <form onSubmit={handleSubmit}>
          <div className="flex relative group-hover:visible">
            <div className="flex">
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
            <input
              type="text"
              className="ml-4 p-0 text-black text-base border-none bg-transparent disabled:text-black focus:outline-none"
              placeholder="Aktivitet"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              ref={descriptionInput}
            />
            <div>
              <button
                disabled={!showSaveButton}
                type="submit"
                className="disabled:invisible"
              >
                Spara
              </button>
            </div>
          </div>
        </form>
        {children(showSaveButton)}
      </>
    );
  }
);

EntryRow.displayName = 'EntryRow';

export default EntryRow;

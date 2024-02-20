import React from 'react';

interface EntryControlsProps {
  onEdit: () => void;
  onDelete: () => void;
  hidden?: boolean;
}

export default function EntryControls({
  onDelete,
  hidden,
}: EntryControlsProps) {
  return (
    !hidden && (
      <div className="absolute top-0 -right-5 flex invisible">
        <button className="size-4 ml-2" onClick={() => onDelete()}>
          ×
        </button>
      </div>
    )
  );
}

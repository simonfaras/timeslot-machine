import React from "react";
import styled from "styled-components";

interface EntryControlsProps {
  onEdit: () => void;
  onDelete: () => void;
  hidden?: boolean;
}

export const EntryControlsContainer = styled.div`
  position: absolute;
  top: 0;
  right: -20px;
  display: flex;
  visibility: hidden;
`;

const EntryControl = styled.div`
  height: 1rem;
  width: 1rem;
  margin-left: 0.5rem;
  cursor: pointer;
`;

export default function EntryControls({
  onDelete,
  hidden,
}: EntryControlsProps) {
  return (
    !hidden && (
      <EntryControlsContainer>
        <EntryControl onClick={() => onDelete()}>×</EntryControl>
      </EntryControlsContainer>
    )
  );
}

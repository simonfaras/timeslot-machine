import React, { useState, useEffect } from "react";
import { Settings } from "@/graphql";

export type SettingsConfig = Pick<
  Settings,
  "worktimePercentage" | "lunchDurationMinutes"
>;

interface SettingsProps extends SettingsConfig {
  update: (settings: SettingsConfig) => void;
}

export default function PeriodSettings({
  update,
  lunchDurationMinutes,
  worktimePercentage,
}: SettingsProps) {
  const [settings, setSettings] = useState<SettingsConfig>({
    lunchDurationMinutes,
    worktimePercentage,
  });

  // Sync state with props
  useEffect(() => {
    setSettings({ lunchDurationMinutes, worktimePercentage });
  }, [setSettings, lunchDurationMinutes, worktimePercentage]);

  const handleUpdate = (key: keyof SettingsConfig, value: number) =>
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

  const handleSave = () => update(settings);

  const handleCancel = () =>
    setSettings({ lunchDurationMinutes, worktimePercentage });

  const isPristine =
    lunchDurationMinutes !== settings.lunchDurationMinutes ||
    worktimePercentage !== settings.worktimePercentage;

  return (
    <div>
      <div className="input-wrapper">
        <label htmlFor="lunch-duration">Lunch&nbsp;(min):</label>
        <input
          type="number"
          id="lunch-duration"
          value={settings.lunchDurationMinutes}
          onChange={(e) =>
            handleUpdate(
              "lunchDurationMinutes",
              Number.parseInt(e.target.value)
            )
          }
        />
      </div>
      <div className="input-wrapper">
        <label htmlFor="workday-hours">Arbetstid&nbsp;(timmar):</label>
        <input
          type="number"
          id="workday-hours"
          value={settings.worktimePercentage}
          onChange={(e) =>
            handleUpdate(
              "worktimePercentage",
              Number.parseFloat(e.target.value)
            )
          }
        />
      </div>

      {isPristine && (
        <div>
          <button onClick={handleSave}>Spara</button>
          <button onClick={handleCancel}>Avbryt</button>{" "}
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Settings } from "@/graphql";

export type SettingsConfig = Pick<
  Settings,
  "workWeekHours" | "lunchDurationMinutes"
>;

interface SettingsProps extends SettingsConfig {
  update: (settings: SettingsConfig) => void;
}

export default function PeriodSettings({
  update,
  lunchDurationMinutes,
  workWeekHours,
}: SettingsProps) {
  const [settings, setSettings] = useState<SettingsConfig>({
    lunchDurationMinutes,
    workWeekHours,
  });

  // Sync state with props
  useEffect(() => {
    setSettings({ lunchDurationMinutes, workWeekHours });
  }, [setSettings, lunchDurationMinutes, workWeekHours]);

  const handleUpdate = (key: keyof SettingsConfig, value: number) =>
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

  const handleSave = () => update(settings);

  const handleCancel = () =>
    setSettings({ lunchDurationMinutes, workWeekHours });

  const isPristine =
    lunchDurationMinutes !== settings.lunchDurationMinutes ||
    workWeekHours !== settings.workWeekHours;

  return (
    <div className="controls">
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
        <label htmlFor="workday-hours">Arbetstid&nbsp;(timmar/vecka):</label>
        <input
          type="number"
          id="workday-hours"
          value={settings.workWeekHours}
          onChange={(e) =>
            handleUpdate("workWeekHours", Number.parseFloat(e.target.value))
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

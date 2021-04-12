import { useMutation } from "@apollo/client";
import {
  CreatePeriodDocument,
  UpdateSettingsDocument,
  AllPeriodsDocument,
  SettingsInput,
} from "@/graphql";

const DEFAULT_LUNCH_DURATION_MINUTES = 60;
const DEFAULT_WORK_WEEK_HOURS = 40;

export function useCreatePeriod({ onDone }: { onDone: (id: string) => void }) {
  const [createPeriodMutation] = useMutation(CreatePeriodDocument, {
    update(cache, { data: { createPeriod } }) {
      const periodsQuery = cache.readQuery({
        query: AllPeriodsDocument,
      });

      cache.writeQuery({
        query: AllPeriodsDocument,

        data: {
          ...periodsQuery,
          getAllPeriods: {
            ...periodsQuery.getAllPeriods,
            data: [...periodsQuery.getAllPeriods.data, createPeriod],
          },
        },
      });
      onDone(createPeriod._id);
    },
  });

  return function createPeriod() {
    createPeriodMutation({
      variables: {
        lunchDurationMinutes: DEFAULT_LUNCH_DURATION_MINUTES,
        workWeekHours: DEFAULT_WORK_WEEK_HOURS,
      },
    });
  };
}

export function useUpdatePeriodSettings(periodId: string) {
  const [updatePeriodSettingsMutation] = useMutation(UpdateSettingsDocument, {
    update(cache, { data: { updatePeriod } }) {
      cache.modify({
        id: `Period:${periodId}`,
        fields: {
          settings() {
            return updatePeriod.settings;
          },
        },
      });
    },
  });

  return function updatePeriodSettings({
    workWeekHours,
    lunchDurationMinutes,
  }: SettingsInput) {
    updatePeriodSettingsMutation({
      variables: {
        id: periodId,
        workWeekHours,
        lunchDurationMinutes,
      },
      optimisticResponse: {
        __typename: "Mutation",
        updatePeriod: {
          __typename: "Period",
          settings: {
            __typename: "Settings",
            workWeekHours,
            lunchDurationMinutes,
          },
        },
      },
    });
  };
}

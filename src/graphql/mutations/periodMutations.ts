import { useMutation } from "@apollo/client";
import { UpdateSettingsDocument, SettingsInput } from "@/graphql";

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

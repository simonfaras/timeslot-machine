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
    worktimePercentage,
    lunchDurationMinutes,
  }: SettingsInput) {
    updatePeriodSettingsMutation({
      variables: {
        id: periodId,
        worktimePercentage,
        lunchDurationMinutes,
      },
      optimisticResponse: {
        __typename: "Mutation",
        updatePeriod: {
          __typename: "Period",
          settings: {
            worktimePercentage,
            lunchDurationMinutes,
          },
        },
      },
    });
  };
}

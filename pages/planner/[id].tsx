import React from "react";
import { useRouter } from "next/router";

import { GetPeriodDocument, UpdateSettingsDocument } from "@/graphql";
import { useQuery, useMutation } from "@apollo/client";

import Settings from "./components/PeriodSettings";
import Day from "./components/Day";

export default function Planner() {
  const router = useRouter();
  const {
    query: { id },
  } = router;
  const periodQuery = useQuery(GetPeriodDocument, { variables: { id } });
  const [updateSettings] = useMutation(UpdateSettingsDocument, {
    update(cache, { data: { updatePeriod } }) {
      cache.modify({
        id: cache.identify(periodQuery.data.findPeriodByID),
        fields: {
          settings() {
            return updatePeriod.settings;
          },
        },
      });
    },
  });

  if (periodQuery.loading) {
    return <div>LOADING</div>;
  }

  return (
    <div className="root">
      <Settings
        update={({ worktimePercentage, lunchDurationMinutes }) =>
          updateSettings({
            variables: {
              id: periodQuery.data.findPeriodByID._id,
              worktimePercentage,
              lunchDurationMinutes,
            },
          })
        }
        worktimePercentage={
          periodQuery.data.findPeriodByID.settings.worktimePercentage
        }
        lunchDurationMinutes={
          periodQuery.data.findPeriodByID.settings.lunchDurationMinutes
        }
      />
      <div className="wrapper">
        {periodQuery.data.findPeriodByID.days.data.map(
          ({ _id, date, timeslots }) => (
            <Day key={_id} _id={_id} date={date} timeslots={timeslots.data} />
          )
        )}
      </div>
    </div>
  );
}

export { default as getServerSideProps } from "@/utils/authProps";

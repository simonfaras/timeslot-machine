import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import parseISODate from "date-fns/parseISO";

import { AllPeriodsDocument } from "@/graphql";
import PeriodDetails from "@/components/PeriodDetails";
import PeriodSelect from "@/components/PeriodsSelect";

export default function PeriodsPage() {
  const router = useRouter();
  const query = useQuery(AllPeriodsDocument);
  const { id } = router.query;
  const activePeriodId = Array.isArray(id) ? id[0] : id;
  const periods = query.data?.getAllPeriods.data ?? [];

  const cursor = query.data?.getAllPeriods.after;

  useEffect(() => {
    if (cursor) {
      query.fetchMore({
        variables: {
          cursor,
        },
      });
    }
  }, [cursor]);

  const setPeriod = (id, replace = false) => {
    (replace ? router.replace : router.push)(`${router.pathname}?id=${id}`);
  };

  useEffect(() => {
    if (
      router?.isReady &&
      !query.loading &&
      periods.length &&
      !activePeriodId
    ) {
      const { data } = query.data.getAllPeriods;
      const lastDay = data
        .map((period) => period.days.data)
        .flat()
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .pop();

      const latestPeriod =
        data.find((period) =>
          period.days.data.find((day) => day._id === lastDay._id)
        ) ?? periods[0];

      setPeriod(latestPeriod._id, true);
    }
  }, [router, query, periods, activePeriodId]);

  return (
    <div>
      {query.loading ? (
        "Laddar"
      ) : (
        <PeriodSelect
          activePeriodId={activePeriodId}
          periods={periods.map((period) => ({
            id: period._id,
            days: period.days.data.map(({ date }) => parseISODate(date)),
          }))}
          onSelect={setPeriod}
          onCreate={setPeriod}
        />
      )}
      {!!activePeriodId && <PeriodDetails periodId={activePeriodId} />}
    </div>
  );
}

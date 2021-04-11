import React from "react";
import { useRouter } from "next/router";

import { useQuery } from "@apollo/client";
import { AllPeriodsDocument } from "@/graphql";

export default function Planner() {
  const router = useRouter();
  const query = useQuery(AllPeriodsDocument);

  if (router?.isReady && !query.loading) {
    const { data } = query.data.getAllPeriods;
    const lastDay = data
      .map((period) => period.days.data)
      .flat()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .pop();

    const latestPeriod = data.find((period) =>
      period.days.data.find((day) => day._id === lastDay._id)
    );

    router.replace(`/planner/${latestPeriod._id}`);
  }

  // TODO Add Loader
  return <div>Loading</div>;
}

export { default as getServerSideProps } from "@/utils/authProps";

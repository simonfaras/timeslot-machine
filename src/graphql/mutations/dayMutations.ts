import { useMutation } from "@apollo/client";
import { CreateDayDocument, CreateDayInput } from "@/graphql";

export function useCreateDay(periodId: string) {
  const [createDayMutation] = useMutation(CreateDayDocument, {
    update(cache, { data: { createDay } }) {
      cache.modify({
        id: `Period:${periodId}`,
        fields: {
          days(existingDayRefs, { toReference }) {
            return {
              ...existingDayRefs,
              data: existingDayRefs.data.concat(toReference(createDay)),
            };
          },
        },
      });
    },
  });

  return function createDay({ date }: Pick<CreateDayInput, "date">) {
    createDayMutation({
      variables: {
        period: periodId,
        date,
      },
      optimisticResponse: {
        __typename: "Mutation",
        createDay: {
          __typename: "Day",
          _id: `Day:${date}`,
          date,
          timeslots: {
            data: [],
          },
        },
      },
    });
  };
}

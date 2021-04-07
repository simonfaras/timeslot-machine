import { useMutation } from "@apollo/client";
import {
  AddTimeslotDocument,
  DeleteTimeslotDocument,
  TimeslotInput,
} from "@/graphql";

export function useAddTimeslot(dayId: string) {
  const [addTimeslotMutation] = useMutation(AddTimeslotDocument, {
    update(cache, { data: { createTimeslot } }) {
      cache.modify({
        id: `Day:${dayId}`,
        fields: {
          timeslots(existingTimeslotRefs, { toReference }) {
            return {
              ...existingTimeslotRefs,
              data: existingTimeslotRefs.data.concat(
                toReference(createTimeslot)
              ),
            };
          },
        },
      });
    },
  });

  return function addTimeslot({ activity, start, end }: TimeslotInput) {
    addTimeslotMutation({
      variables: {
        day: dayId,
        start,
        end,
        activity,
      },
      optimisticResponse: {
        __typename: "Mutation",
        createTimeslot: {
          __typename: "Timeslot",
          _id: "Timeslot:TEMP",
          start,
          end,
          activity,
        },
      },
    });
  };
}

export function useDeleteTimeslot(dayId: string) {
  const [deleteTimeslotMutation] = useMutation(DeleteTimeslotDocument, {
    update(cache, { data: { deleteTimeslot } }) {
      cache.modify({
        id: `Day:${dayId}`,
        fields: {
          timeslots(existingTimeslotRefs, { readField }) {
            return {
              ...existingTimeslotRefs,
              data: existingTimeslotRefs.data.filter(
                (ref) => deleteTimeslot._id !== readField("_id", ref)
              ),
            };
          },
        },
      });
    },
  });

  return function deleteTimeslot(id: string) {
    deleteTimeslotMutation({
      variables: {
        id,
      },
      optimisticResponse: {
        __typename: "Mutation",
        deleteTimeslot: {
          __typename: "Timeslot",
          _id: id,
        },
      },
    });
  };
}

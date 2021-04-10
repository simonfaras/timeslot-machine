import { useMutation } from "@apollo/client";
import {
  CreateTimeslotDocument,
  DeleteTimeslotDocument,
  UpdateTimeslotDocument,
  TimeslotInput as SchemaTimeslotInput,
} from "@/graphql";

type TimeslotInput = Pick<SchemaTimeslotInput, "start" | "end" | "activity">;

export function useCreateTimeslot(dayId: string) {
  const [creteTimeslotMutation] = useMutation(CreateTimeslotDocument, {
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

  return function createTimeslot({ activity, start, end }: TimeslotInput) {
    creteTimeslotMutation({
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

export function useUpdateTimeslot(dayId: string) {
  const [updateTimeslotMutation] = useMutation(UpdateTimeslotDocument, {
    update(cache, { data: { updateTimeslot } }) {
      cache.modify({
        id: `Day:${dayId}`,
        fields: {
          timeslots(existingTimeslotRefs, { readField, toReference }) {
            const updatedIndex = existingTimeslotRefs.data.findIndex(
              (ref) => updateTimeslot._id === readField("_id", ref)
            );

            return {
              ...existingTimeslotRefs,
              data: [
                ...existingTimeslotRefs.data.slice(0, updatedIndex),
                toReference(updateTimeslot),
                ...existingTimeslotRefs.data.slice(updatedIndex + 1),
              ],
            };
          },
        },
      });
    },
  });

  return function updateTimeslot(
    id: string,
    { start, end, activity }: TimeslotInput
  ) {
    updateTimeslotMutation({
      variables: {
        id,
        start,
        end,
        activity,
      },
      optimisticResponse: {
        __typename: "Mutation",
        updateTimeslot: {
          __typename: "Timeslot",
          _id: id,
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

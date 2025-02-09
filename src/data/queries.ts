import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  CreateDayInput,
  CreateTimeslotInput,
  Period,
  Timeslot,
  createDay,
  createPeriod,
  createTimeslot,
  deleteTimeslot,
  getAllPeriods,
  getPeriod,
  updateTimeslot,
} from './storage';

const keys = {
  all: ['all'],
  periods: () => [...keys.all, 'periods'],
  period: (id: string) => [...keys.periods(), { id }],
  day: (id: string) => [...keys.all, 'day', { id }],
};

export const useAllPeriods = () => {
  return useQuery({
    queryKey: keys.periods(),
    queryFn: () => getAllPeriods(),
  });
};

export const usePeriod = (periodId: string) => {
  return useQuery({
    queryKey: keys.period(periodId),
    queryFn: () => getPeriod(periodId),
  });
};

const useInvalidatePeriod = (periodId: string) => {
  const client = useQueryClient();

  return () => {
    client.invalidateQueries(keys.period(periodId));
  };
};

type CreatePeriodOptions = {
  onSuccess?: (period: Period) => void;
};

export const useCreatePeriod = (options: CreatePeriodOptions) => {
  const client = useQueryClient();

  return useMutation({
    mutationFn: () => createPeriod(),
    onSuccess: (period) => {
      client.invalidateQueries({ queryKey: keys.periods() });
      options.onSuccess?.(period);
    },
  });
};

export const useCreateDay = (periodId: string) => {
  const refresh = useInvalidatePeriod(periodId);

  return useMutation({
    mutationFn: (day: CreateDayInput) => createDay(periodId, day),
    onSuccess: refresh,
  });
};

export const useCreateTimeslot = (periodId: string, dayId: string) => {
  const refresh = useInvalidatePeriod(periodId);

  return useMutation({
    mutationFn: (timeslot: CreateTimeslotInput) =>
      createTimeslot(periodId, dayId, timeslot),
    onSuccess: refresh,
  });
};

export const useUpdateTimeslot = (periodId: string, dayId: string) => {
  const refresh = useInvalidatePeriod(periodId);

  return useMutation({
    mutationFn: (timeslot: Timeslot) =>
      updateTimeslot(periodId, dayId, timeslot),
    onSuccess: refresh,
  });
};

export const useDeleteTimeslot = (periodId: string, dayId: string) => {
  const refresh = useInvalidatePeriod(periodId);

  return useMutation({
    mutationFn: (timeslotId: string) =>
      deleteTimeslot(periodId, dayId, timeslotId),
    onSuccess: refresh,
  });
};

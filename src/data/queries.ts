import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  CreateDayInput,
  CreateTimeslotInput,
  Period,
  createDay,
  createPeriod,
  createTimeslot,
  getAllPeriods,
  getPeriod,
} from './storage';

const keys = {
  all: ['all'],
  periods: () => [keys.all, 'periods'],
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
  return useMutation({
    mutationFn: (day: CreateDayInput) => createDay(periodId, day),
  });
};

export const useCreateTimeslot = (periodId: string, dayId: string) => {
  return useMutation({
    mutationFn: (timeslot: CreateTimeslotInput) =>
      createTimeslot(periodId, dayId, timeslot),
  });
};

export const useUpdateTimeslot = () => {};

export const useDeleteTimeslot = () => {};

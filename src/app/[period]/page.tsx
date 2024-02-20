import PeriodDetails from '@/components/PeriodDetails';

type PeriodPageProps = {
  params: {
    period: 'string';
  };
};

export default function PeriodPage({ params }: PeriodPageProps) {
  return <PeriodDetails periodId={params.period} />;
}

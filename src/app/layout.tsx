import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from './_components/query-provider';
import PeriodSelect from '@/components/PeriodsSelect';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Stämpla in',
  description: 'Tidrapportering',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className={inter.className}>
        <QueryProvider>
          <div className="flex justify-center p-12">
            <div className="max-w-screen-sm">
              <PeriodSelect />
              {children}
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}

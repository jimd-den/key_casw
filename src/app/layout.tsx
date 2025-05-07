import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google'; // Corrected import for Geist font
import './globals.css';
import { AppLayout } from '@/components/layout'; // Importing AppLayout

const geistSans = Geist({ // Corrected instantiation
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({ // Corrected instantiation
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Key Case',
  description: 'Solve mysteries using your unique digital key.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* Added suppressHydrationWarning for potential themeing/localStorage issues */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}

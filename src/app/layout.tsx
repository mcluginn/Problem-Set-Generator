import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Engineering Practice Engine | Differential Calculus',
  description:
    'Unlimited, mathematically verified, conceptually diverse practice for engineering mathematics and calculus.',
  icons: {
    icon: '/mechanical-engineering-society.png',
    apple: '/mechanical-engineering-society.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-brand-navy text-slate-100 antialiased min-h-screen flex flex-col selection:bg-brass-500/30 selection:text-brass-400">
        {children}
      </body>
    </html>
  );
}

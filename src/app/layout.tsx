import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import { AuthProvider } from '@/hooks/use-auth';

export const metadata: Metadata = {
  title: 'Recipe Remix',
  description:
    'Generate unique recipes from your ingredients with the power of AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn('min-h-screen font-body antialiased')}
        style={{
          backgroundImage: `url(https://www.transparenttextures.com/patterns/food.png)`,
          backgroundSize: '300px 300px',
          backgroundAttachment: 'fixed',
        }}
      >
        <AuthProvider>
          <div className="relative flex min-h-dvh flex-col bg-background/90">
            <Header />
            <main className="flex-1 flex flex-col">
              <div className="flex-1 flex flex-col">{children}</div>
            </main>
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

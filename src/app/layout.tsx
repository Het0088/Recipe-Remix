import type { Metadata } from 'next';
import { Poppins, Alegreya } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import { AuthProvider } from '@/hooks/use-auth';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const alegreya = Alegreya({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-alegreya',
});

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
      <body
        className={cn(
          'min-h-screen font-body antialiased',
          poppins.variable,
          alegreya.variable
        )}
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1498579809087-ef1e558fd1da?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <AuthProvider>
          <div className="relative flex min-h-dvh flex-col">
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

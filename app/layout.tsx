import { AuthProvider } from '@/components/providers/auth-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: { default: 'DocuMind', template: '%s | DocuMind' },
  description: 'Turn your documents into an intelligent, searchable knowledge workspace.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={outfit.variable}>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster position="bottom-right" richColors />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

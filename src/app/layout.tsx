import { Metadata } from 'next';
import { ThemeProvider } from '@/application/providers/ThemeProvider';
import { ClientThemeWrapper } from '@/presentation/components/Theme/ClientThemeWrapper';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Portfolio website'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <ClientThemeWrapper>{children}</ClientThemeWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}

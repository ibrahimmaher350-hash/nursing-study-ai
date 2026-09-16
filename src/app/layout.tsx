import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { TopHeader } from '@/components/layout/TopHeader';
import { DesktopSidebar } from '@/components/layout/DesktopSidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

export const metadata: Metadata = {
  title: 'Nursing Study AI | منصة دراسة التمريض الذكية',
  description:
    'المنصة الذكية الأولى لطلاب كليات ومعاهد التمريض في مصر — ترجمة طبية دقيقة، نطق بالسرعات، مصطلحات، شرح بالمصري، وأسئلة امتحانات معتمدة.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0F4C81',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-cairo antialiased">
        <ThemeProvider>
          {/* Top Global Header */}
          <TopHeader />

          {/* Main App Container */}
          <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 md:pb-0">
            {/* Desktop Navigation Sidebar */}
            <DesktopSidebar />

            {/* Content Area */}
            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>

          {/* Mobile Bottom Navigation */}
          <MobileBottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}

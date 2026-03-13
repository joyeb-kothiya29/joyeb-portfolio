import UmamiAnalytics from '@/components/analytics/UmamiAnalytics';
import ChatBubble from '@/components/common/ChatBubble';
import Footer from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import DynamicFavicon from '@/components/common/DynamicFavicon';
import OnekoCat from '@/components/common/OnekoCat';
import { ThemeProvider } from '@/components/common/ThemeProviders';
import { generateMetadata as getMetadata } from '@/config/Meta';
import { lenisOptions } from '@/lib/lenis';
import ReactLenis from 'lenis/react';
import { ViewTransitions } from 'next-view-transitions';
import type { Viewport } from 'next';

import './globals.css';

export const metadata = getMetadata('/');

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#FFD700' },
    { media: '(prefers-color-scheme: light)', color: '#3B82F6' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body className={`font-hanken-grotesk antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ReactLenis root options={lenisOptions}>
              <DynamicFavicon />
              <Navbar />
              {children}
              <OnekoCat />
              <Footer />
              <ChatBubble />
              <UmamiAnalytics />
            </ReactLenis>
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}

// src/app/layout.tsx
import type { Metadata } from "next";
import Script from 'next/script';
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawerWrapper } from "@/components/layout/CartDrawerWrapper";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { getTrackingScripts } from '@/services/wpService';

const inter = Inter({ 
  subsets: ["latin", "vietnamese"], 
  variable: '--font-inter',
  display: 'swap', 
  preload: true, 
});

const merriweather = Merriweather({ 
  weight: ['300', '400', '700', '900'], 
  subsets: ["latin", "vietnamese"], 
  style: ['normal', 'italic'],
  variable: '--font-merriweather',
  display: 'swap', 
  preload: true, 
});

export const metadata: Metadata = {
  title: "Kho Panel | Tổng Kho Panel Cách Nhiệt",
  description: "Kho Panel chuyên cung cấp giải pháp tấm panel cách nhiệt, cách âm chất lượng cao. Bảo hành 15 năm.",
  metadataBase: new URL('https://khopanel.com'), 
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const trackingScripts = await getTrackingScripts();

  return (
    <html lang="vi" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://portal.khopanel.com" />
        <link rel="dns-prefetch" href="https://portal.khopanel.com" />
      </head>

      <body 
        suppressHydrationWarning
        className={`${inter.variable} ${merriweather.variable} font-sans bg-white text-slate-900 selection:bg-brand-100 selection:text-brand-900 antialiased`}
      >
        {/* Phần giao diện người dùng được đưa lên ĐẦU TIÊN để vẽ ngay lập tức */}
        <Providers>
          <Header />
          <CartDrawerWrapper />
          <main className="flex-grow min-h-screen relative z-0">
            {children}
          </main>
          <FloatingContact />
          <Footer />
        </Providers>

    {/* TỐI ƯU TBT/LCP: Chuyển tất cả script tracking sang lazyOnload 
          để không chặn luồng chính của trình duyệt di động */}
        {trackingScripts?.headerScripts && (
          <Script 
            id="wp-header-scripts"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{ __html: trackingScripts.headerScripts }} 
          />
        )}
        
        {trackingScripts?.bodyTopScripts && (
          <Script 
            id="wp-body-top-scripts"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{ __html: trackingScripts.bodyTopScripts }} 
          />
        )}

        {trackingScripts?.footerScripts && (
          <Script 
            id="wp-footer-scripts"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{ __html: trackingScripts.footerScripts }} 
          />
        )}
      </body>
    </html>
  );
}
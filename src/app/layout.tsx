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
import { getTrackingScripts, getSiteMetadata } from '@/services/wpService';
import { Suspense } from "react";

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

// THÊM HÀM NÀY ĐỂ LẤY METADATA ĐỘNG TỪ WORDPRESS
export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getSiteMetadata();

  return {
    title: {
      default: siteData.title, // Lấy tên site từ WP (VD: Kho Panel)
      template: `%s | ${siteData.title}`, // Template cho các trang con
    },
    description: siteData.description, // Lấy mô tả từ WP
    metadataBase: new URL('https://khopanel.com'), 
    icons: {
      icon: '/icon.png', // Trỏ tới file icon mới của bạn
      shortcut: '/favicon.ico',
    },
  };
}

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
        <Providers>
          <Suspense fallback={<div className="h-20 bg-slate-100 animate-pulse w-full"></div>}>
            <Header />
          </Suspense>
          <CartDrawerWrapper />
          <main className="flex-grow min-h-screen relative z-0">
            {children}
          </main>
          <FloatingContact />
          <Suspense fallback={<div className="h-40 bg-[#0B1727] animate-pulse w-full"></div>}>
            <Footer />
          </Suspense>
        </Providers>

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
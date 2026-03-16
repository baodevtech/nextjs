// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawerWrapper } from "@/components/layout/CartDrawerWrapper";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { getTrackingScripts, getSiteMetadata } from '@/services/wpService';
import { Suspense } from "react";
import parse from 'html-react-parser'; // Import thư viện parse HTML

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

// LẤY METADATA ĐỘNG TỪ WORDPRESS
export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getSiteMetadata();

  return {
    title: {
      default: siteData.title || 'Kho Panel', // Tên mặc định nếu không gọi được API
      template: `%s | ${siteData.title || 'Kho Panel'}`,
    },
    description: siteData.description,
    metadataBase: new URL('https://khopanel.com'), 
    icons: {
      icon: '/icon.png',
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
        
        {/* PARSE HEADER SCRIPTS VÀO ĐÚNG THẺ <HEAD> */}
        {/* Google Site Verification, Analytics, Pixel sẽ nằm chuẩn ở đây */}
        {trackingScripts?.headerScripts && parse(trackingScripts.headerScripts)}
      </head>

      <body 
        suppressHydrationWarning
        className={`${inter.variable} ${merriweather.variable} font-sans bg-white text-slate-900 selection:bg-brand-100 selection:text-brand-900 antialiased`}
      >
        {/* PARSE BODY TOP SCRIPTS NGAY SAU THẺ MỞ <BODY> */}
        {/* Thường dùng cho thẻ <noscript> của Google Tag Manager */}
        {trackingScripts?.bodyTopScripts && parse(trackingScripts.bodyTopScripts)}

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

        {/* PARSE FOOTER SCRIPTS TRƯỚC THẺ ĐÓNG </BODY> */}
        {/* Thường dùng cho Livechat, Zalo widget, các script không ưu tiên tải */}
        {trackingScripts?.footerScripts && parse(trackingScripts.footerScripts)}
      </body>
    </html>
  );
}
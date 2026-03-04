// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawerWrapper } from "@/components/layout/CartDrawerWrapper";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { getTrackingScripts } from '@/services/wpService';

// 👇 1. Import hàm parse của thư viện
import parse from 'html-react-parser'; 

const inter = Inter({ 
  subsets: ["latin", "vietnamese"], 
  variable: '--font-inter',
  display: 'swap',
});

const merriweather = Merriweather({ 
  weight: ['300', '400', '700', '900'], 
  subsets: ["latin", "vietnamese"], 
  style: ['normal', 'italic'],
  variable: '--font-merriweather',
  display: 'swap',
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
        
        {/* 👇 2. Dùng hàm parse() để biến chuỗi String thành Component React thực thụ */}
        {trackingScripts?.headerScripts && parse(trackingScripts.headerScripts)}
      </head>

      <body 
        suppressHydrationWarning
        className={`${inter.variable} ${merriweather.variable} font-sans bg-white text-slate-900 selection:bg-brand-100 selection:text-brand-900 antialiased`}
      >
        {/* THÊM BODY TOP SCRIPTS */}
        {trackingScripts?.bodyTopScripts && parse(trackingScripts.bodyTopScripts)}

        <Providers>
          <Header />
          <CartDrawerWrapper />
          <main className="flex-grow min-h-screen relative z-0">
            {children}
          </main>
          <FloatingContact />
          <Footer />
        </Providers>

        {/* THÊM FOOTER SCRIPTS */}
        {trackingScripts?.footerScripts && parse(trackingScripts.footerScripts)}
      </body>
    </html>
  );
}
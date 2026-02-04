// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawerWrapper } from "@/components/layout/CartDrawerWrapper";
import { FloatingContact } from "@/components/layout/FloatingContact";

// TỐI ƯU FONT: Thêm display: 'swap' để chữ hiện ngay lập tức
const inter = Inter({ 
  subsets: ["latin", "vietnamese"], 
  variable: '--font-inter',
  display: 'swap', // <--- QUAN TRỌNG
});

const merriweather = Merriweather({ 
  weight: ['300', '400', '700', '900'], 
  subsets: ["latin", "vietnamese"], 
  style: ['normal', 'italic'],
  variable: '--font-merriweather',
  display: 'swap', // <--- QUAN TRỌNG
});

export const metadata: Metadata = {
  title: "Đại Nam Wall | Tấm Ốp Tường Cao Cấp",
  description: "Đại Nam Wall chuyên cung cấp giải pháp tấm ốp tường, lam sóng, PVC vân đá chất lượng cao. Bảo hành 15 năm.",
  // Thêm metadataBase để chuẩn SEO nếu share link
  metadataBase: new URL('https://tamnhuagiada.com'), 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className={`${inter.variable} ${merriweather.variable} font-sans bg-white text-slate-900 selection:bg-brand-100 selection:text-brand-900 antialiased`}>
        <Providers>
          <Header />
          <CartDrawerWrapper />
          <main className="flex-grow min-h-screen relative z-0">
            {children}
          </main>
          <FloatingContact />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
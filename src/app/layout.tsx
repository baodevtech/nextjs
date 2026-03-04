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

// TỐI ƯU FONT: Thêm display: 'swap' để chữ hiện ngay lập tức
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
  // [FIX]: Đổi tên thương hiệu và mô tả chuẩn
  title: "Kho Panel | Tổng Kho Panel Cách Nhiệt",
  description: "Kho Panel chuyên cung cấp giải pháp tấm panel cách nhiệt, cách âm chất lượng cao. Bảo hành 15 năm.",
  // [FIX]: Thêm metadataBase chuẩn domain của bạn
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
        
        {/* THỦ THUẬT CHÈN HTML THÔ VÀO HEAD KHÔNG BỊ LỖI */}
        {trackingScripts?.headerScripts && (
          <script
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ 
              __html: `</script>${trackingScripts.headerScripts}<script>` 
            }}
          />
        )}
      </head>

      <body 
        suppressHydrationWarning
        className={`${inter.variable} ${merriweather.variable} font-sans bg-white text-slate-900 selection:bg-brand-100 selection:text-brand-900 antialiased`}
      >
        {/* CHÈN BODY TOP SCRIPTS */}
        {trackingScripts?.bodyTopScripts && (
          <div 
            dangerouslySetInnerHTML={{ __html: trackingScripts.bodyTopScripts }} 
            style={{ display: 'none' }} 
          />
        )}

        <Providers>
          <Header />
          <CartDrawerWrapper />
          <main className="flex-grow min-h-screen relative z-0">
            {children}
          </main>
          <FloatingContact />
          <Footer />
        </Providers>

        {/* CHÈN FOOTER SCRIPTS */}
        {trackingScripts?.footerScripts && (
          <div 
            dangerouslySetInnerHTML={{ __html: trackingScripts.footerScripts }} 
            style={{ display: 'none' }} 
          />
        )}
      </body>
    </html>
  );
}
'use client';
import React from 'react';
import Link from 'next/link';

export const CTABanner = () => {
  return (
      <section className="py-32 bg-slate-950 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
          <div className="max-w-3xl mx-auto px-4 relative z-10">
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter leading-none">Ready to <br/> Transform?</h2>
              <p className="text-slate-400 text-xl mb-12 font-light max-w-xl mx-auto leading-relaxed">
                  Liên hệ ngay với chuyên gia của Đại Nam Wall để nhận tư vấn giải pháp tối ưu cho không gian của bạn.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link href="/contact">
                      <button className="h-16 px-10 rounded-full bg-white text-slate-950 text-base font-bold uppercase tracking-widest hover:bg-brand-400 hover:text-white transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(56,189,248,0.4)]">
                          Nhận Báo Giá Ngay
                      </button>
                  </Link>
                  <a href="tel:0912345678" className="h-16 px-10 flex items-center justify-center rounded-full border border-slate-700 text-white text-base font-bold uppercase tracking-widest hover:bg-slate-800 hover:border-slate-600 transition-colors">
                      Hotline: 0912.345.678
                  </a>
              </div>
          </div>
      </section>
  );
};
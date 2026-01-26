'use client';
import React from 'react';
import { Layers, Droplets, Leaf } from 'lucide-react';

export const QualitySection = () => {
  return (
      <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16 max-w-3xl mx-auto">
                  <h2 className="text-4xl font-semibold text-slate-900 tracking-tight mb-4">Tiêu Chuẩn Đại Nam Wall</h2>
                  <p className="text-slate-500 text-lg">Chúng tôi không chỉ bán vật liệu, chúng tôi cung cấp sự an tâm tuyệt đối cho công trình của bạn.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[500px]">
                  {/* Card 1: Main Feature (Large) */}
                  <div className="md:col-span-2 md:row-span-2 bg-slate-50 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-100 rounded-full blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-blue-200"></div>
                      <div className="relative z-10 h-full flex flex-col justify-between">
                          <div>
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-brand-600">
                                  <Layers size={24} />
                              </div>
                              <h3 className="text-3xl font-bold text-slate-900 mb-4">Cấu Trúc 5 Lớp <br/> Siêu Bền</h3>
                              <p className="text-slate-600 text-lg max-w-md leading-relaxed">
                                  Công nghệ ép nhiệt Nano tiên tiến giúp liên kết 5 lớp vật liệu thành một khối thống nhất. Chống tách lớp, cong vênh trong mọi điều kiện thời tiết.
                              </p>
                          </div>
                          <div className="mt-8 flex gap-3">
                              <span className="px-4 py-2 bg-white rounded-full text-xs font-bold text-slate-700 shadow-sm border border-slate-100">UV Protection</span>
                              <span className="px-4 py-2 bg-white rounded-full text-xs font-bold text-slate-700 shadow-sm border border-slate-100">Scratch Resistant</span>
                          </div>
                      </div>
                      <img src="https://images.unsplash.com/photo-1620626012053-93f56b5463f0?q=80&w=800&auto=format&fit=crop" className="absolute bottom-0 right-0 w-1/2 h-2/3 object-contain object-bottom translate-x-12 translate-y-12 group-hover:translate-x-8 group-hover:translate-y-8 transition-transform duration-700" alt="Layers" />
                  </div>

                  {/* Card 2: Water Resistance */}
                  <div className="bg-slate-50 rounded-3xl p-8 relative overflow-hidden group hover:bg-blue-50 transition-colors duration-300">
                      <Droplets className="text-blue-500 mb-4 w-10 h-10" />
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Chống Nước 100%</h3>
                      <p className="text-slate-500 text-sm">Giải pháp hoàn hảo cho tường ẩm mốc. Không mối mọt.</p>
                  </div>

                  {/* Card 3: Eco Friendly */}
                  <div className="bg-slate-50 rounded-3xl p-8 relative overflow-hidden group hover:bg-green-50 transition-colors duration-300">
                      <Leaf className="text-green-500 mb-4 w-10 h-10" />
                      <h3 className="text-xl font-bold text-slate-900 mb-2">An Toàn Sức Khỏe</h3>
                      <p className="text-slate-500 text-sm">Nhựa nguyên sinh không chứa Formaldehyde. An toàn cho trẻ nhỏ.</p>
                  </div>
              </div>
          </div>
      </section>
  );
};
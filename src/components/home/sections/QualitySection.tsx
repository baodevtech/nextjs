'use client';

import React from 'react';
import { Layers, Droplets, Leaf } from 'lucide-react';
import { HomeSettings } from '@/types';

interface QualitySectionProps {
  settings?: {
    heading: string;
    subheading: string;
    large: HomeSettings['qualityLarge'];
    small: HomeSettings['qualitySmall'];
  };
}

export const QualitySection: React.FC<QualitySectionProps> = ({ settings }) => {
  // Fallback Data
  const heading = settings?.heading || "Tiêu Chuẩn Đại Nam Wall";
  const subheading = settings?.subheading || "Chúng tôi không chỉ bán vật liệu, chúng tôi cung cấp sự an tâm tuyệt đối cho công trình của bạn.";
  
  const largeCard = settings?.large || {
      title: "Cấu Trúc 5 Lớp<br/>Siêu Bền",
      description: "Công nghệ ép nhiệt Nano tiên tiến giúp liên kết 5 lớp vật liệu thành một khối thống nhất.",
      icon: "",
      image: "https://images.unsplash.com/photo-1620626012053-93f56b5463f0?q=80&w=800&auto=format&fit=crop",
      tags: [{ text: "Chống xước" }, { text: "Bền màu" }]
  };

  const smallCards = settings?.small || [
      { title: "Chống Nước", description: "Tuyệt đối không ẩm mốc, mối mọt.", icon: "" },
      { title: "An Toàn", description: "Nhựa nguyên sinh không độc hại.", icon: "" }
  ];

  return (
      <section className="py-12 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* HEADER */}
              <div className="text-center mb-8 md:mb-16 max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight mb-2 md:mb-4">{heading}</h2>
                  <p className="text-slate-500 text-sm md:text-lg">{subheading}</p>
              </div>

              {/* GRID LAYOUT COMPACT */}
              {/* Mobile: Grid 2 cột (để xếp 2 card nhỏ ngang nhau). PC: Grid 3 cột */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 md:h-[500px]">
                  
                  {/* --- CARD LỚN (Chiếm trọn bề ngang trên mobile) --- */}
                  <div className="col-span-2 md:row-span-2 bg-slate-50 rounded-2xl md:rounded-3xl p-5 md:p-12 relative overflow-hidden group hover:shadow-xl transition-all duration-500 min-h-[220px] md:min-h-0">
                      {/* Background Decoration */}
                      <div className="absolute top-0 right-0 w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-blue-100 rounded-full blur-[60px] md:blur-[100px] -mr-20 -mt-20 md:-mr-32 md:-mt-32 transition-all group-hover:bg-blue-200"></div>
                      
                      <div className="relative z-10 h-full flex flex-col justify-between">
                          <div className="md:w-3/5"> {/* Giới hạn chiều rộng text trên PC */}
                              {/* Icon */}
                              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm mb-3 md:mb-6 text-blue-600">
                                  {largeCard.icon ? (
                                      <img src={largeCard.icon} alt="Icon" className="w-5 h-5 md:w-6 md:h-6 object-contain" />
                                  ) : (
                                      <Layers className="w-5 h-5 md:w-6 md:h-6" />
                                  )}
                              </div>
                              
                              {/* Title & Desc */}
                              <h3 className="text-xl md:text-3xl font-bold text-slate-900 mb-2 md:mb-4 leading-tight" dangerouslySetInnerHTML={{ __html: largeCard.title }}></h3>
                              <p className="text-slate-600 text-xs md:text-lg leading-relaxed line-clamp-3 md:line-clamp-none pr-24 md:pr-0">
                                  {largeCard.description}
                              </p>
                          </div>
                          
                          {/* Tags */}
                          <div className="mt-4 md:mt-8 flex flex-wrap gap-2">
                              {largeCard.tags.map((tag, idx) => (
                                  <span key={idx} className="px-2.5 py-1 md:px-4 md:py-2 bg-white rounded-full text-[10px] md:text-xs font-bold text-slate-700 shadow-sm border border-slate-100">
                                      {tag.text}
                                  </span>
                              ))}
                          </div>
                      </div>

                      {/* Illustration Image: Mobile (Nhỏ góc phải), PC (To góc phải) */}
                      {largeCard.image && (
                          <img 
                            src={largeCard.image} 
                            className="absolute bottom-0 right-0 w-[120px] md:w-1/2 h-3/4 md:h-2/3 object-contain object-bottom translate-x-4 translate-y-4 md:translate-x-12 md:translate-y-12 transition-transform duration-700" 
                            alt="Structure Layer" 
                          />
                      )}
                  </div>

                  {/* --- CARD NHỎ 1 (Chiếm 1 cột - Nửa màn hình mobile) --- */}
                  {smallCards[0] && (
                      <div className="col-span-1 bg-slate-50 rounded-2xl md:rounded-3xl p-4 md:p-8 relative overflow-hidden group hover:bg-blue-50 transition-colors duration-300 flex flex-col justify-center min-h-[140px] md:min-h-0">
                          <div className="mb-2 md:mb-4">
                              {smallCards[0].icon ? (
                                  <img src={smallCards[0].icon} alt="Icon" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                              ) : (
                                  <Droplets className="text-blue-500 w-6 h-6 md:w-10 md:h-10" />
                              )}
                          </div>
                          <h3 className="text-sm md:text-xl font-bold text-slate-900 mb-1 line-clamp-1">{smallCards[0].title}</h3>
                          <p className="text-slate-500 text-[10px] md:text-sm line-clamp-2 md:line-clamp-none leading-snug">{smallCards[0].description}</p>
                      </div>
                  )}

                  {/* --- CARD NHỎ 2 (Chiếm 1 cột - Nửa màn hình mobile) --- */}
                  {smallCards[1] && (
                      <div className="col-span-1 bg-slate-50 rounded-2xl md:rounded-3xl p-4 md:p-8 relative overflow-hidden group hover:bg-green-50 transition-colors duration-300 flex flex-col justify-center min-h-[140px] md:min-h-0">
                          <div className="mb-2 md:mb-4">
                              {smallCards[1].icon ? (
                                  <img src={smallCards[1].icon} alt="Icon" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                              ) : (
                                  <Leaf className="text-green-500 w-6 h-6 md:w-10 md:h-10" />
                              )}
                          </div>
                          <h3 className="text-sm md:text-xl font-bold text-slate-900 mb-1 line-clamp-1">{smallCards[1].title}</h3>
                          <p className="text-slate-500 text-[10px] md:text-sm line-clamp-2 md:line-clamp-none leading-snug">{smallCards[1].description}</p>
                      </div>
                  )}

              </div>
          </div>
      </section>
  );
};
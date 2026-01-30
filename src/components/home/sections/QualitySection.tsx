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
      title: "Cấu Trúc 5 Lớp Siêu Bền",
      description: "Công nghệ ép nhiệt Nano tiên tiến giúp liên kết 5 lớp vật liệu thành một khối thống nhất. Chống tách lớp, cong vênh trong mọi điều kiện thời tiết.",
      icon: "",
      image: "https://images.unsplash.com/photo-1620626012053-93f56b5463f0?q=80&w=800&auto=format&fit=crop",
      tags: [{ text: "UV Protection" }, { text: "Scratch Resistant" }]
  };

  const smallCards = settings?.small || [
      { title: "Chống Nước 100%", description: "Giải pháp hoàn hảo cho tường ẩm mốc. Không mối mọt.", icon: "" },
      { title: "An Toàn Sức Khỏe", description: "Nhựa nguyên sinh không chứa Formaldehyde. An toàn cho trẻ nhỏ.", icon: "" }
  ];

  return (
      <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              {/* HEADER */}
              <div className="text-center mb-16 max-w-3xl mx-auto">
                  <h2 className="text-4xl font-semibold text-slate-900 tracking-tight mb-4">{heading}</h2>
                  <p className="text-slate-500 text-lg">{subheading}</p>
              </div>

              {/* GRID LAYOUT */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[500px]">
                  
                  {/* Card 1: Main Feature (Large) */}
                  <div className="md:col-span-2 md:row-span-2 bg-slate-50 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                      {/* Background Decoration */}
                      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-100 rounded-full blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-blue-200"></div>
                      
                      <div className="relative z-10 h-full flex flex-col justify-between">
                          <div>
                              {/* Icon */}
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-blue-600">
                                  {largeCard.icon ? (
                                      <img src={largeCard.icon} alt="Icon" className="w-6 h-6 object-contain" />
                                  ) : (
                                      <Layers size={24} />
                                  )}
                              </div>
                              
                              {/* Title & Desc */}
                              <h3 className="text-3xl font-bold text-slate-900 mb-4" dangerouslySetInnerHTML={{ __html: largeCard.title.replace(/\n/g, '<br/>') }}></h3>
                              <p className="text-slate-600 text-lg max-w-md leading-relaxed">
                                  {largeCard.description}
                              </p>
                          </div>
                          
                          {/* Tags */}
                          <div className="mt-8 flex flex-wrap gap-3">
                              {largeCard.tags.map((tag, idx) => (
                                  <span key={idx} className="px-4 py-2 bg-white rounded-full text-xs font-bold text-slate-700 shadow-sm border border-slate-100">
                                      {tag.text}
                                  </span>
                              ))}
                          </div>
                      </div>

                      {/* Illustration Image */}
                      {largeCard.image && (
                          <img 
                            src={largeCard.image} 
                            className="absolute bottom-0 right-0 w-1/2 h-2/3 object-contain object-bottom translate-x-12 translate-y-12 group-hover:translate-x-8 group-hover:translate-y-8 transition-transform duration-700" 
                            alt="Structure Layer" 
                          />
                      )}
                  </div>

                  {/* Card 2: Small Card 1 (Water Resistance) */}
                  {smallCards[0] && (
                      <div className="bg-slate-50 rounded-3xl p-8 relative overflow-hidden group hover:bg-blue-50 transition-colors duration-300 flex flex-col justify-center">
                          <div className="mb-4">
                              {smallCards[0].icon ? (
                                  <img src={smallCards[0].icon} alt="Icon" className="w-10 h-10 object-contain" />
                              ) : (
                                  <Droplets className="text-blue-500 w-10 h-10" />
                              )}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">{smallCards[0].title}</h3>
                          <p className="text-slate-500 text-sm">{smallCards[0].description}</p>
                      </div>
                  )}

                  {/* Card 3: Small Card 2 (Eco Friendly) */}
                  {smallCards[1] && (
                      <div className="bg-slate-50 rounded-3xl p-8 relative overflow-hidden group hover:bg-green-50 transition-colors duration-300 flex flex-col justify-center">
                          <div className="mb-4">
                              {smallCards[1].icon ? (
                                  <img src={smallCards[1].icon} alt="Icon" className="w-10 h-10 object-contain" />
                              ) : (
                                  <Leaf className="text-green-500 w-10 h-10" />
                              )}
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">{smallCards[1].title}</h3>
                          <p className="text-slate-500 text-sm">{smallCards[1].description}</p>
                      </div>
                  )}

              </div>
          </div>
      </section>
  );
};
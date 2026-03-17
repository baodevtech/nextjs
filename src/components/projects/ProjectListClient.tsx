'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Calendar, Ruler } from 'lucide-react';
import { Project } from '@/types';

interface ProjectListClientProps {
  initialProjects: Project[];
}

export default function ProjectListClient({ initialProjects }: ProjectListClientProps) {
    const [filter, setFilter] = useState('all');

    const categories = useMemo(() => {
        const uniqueCats = new Map();
        uniqueCats.set('all', 'Tất cả dự án');

        initialProjects.forEach(p => {
            if (p.categorySlug && p.category) {
                uniqueCats.set(p.categorySlug, p.category);
            }
        });

        return Array.from(uniqueCats.entries()).map(([slug, label]) => ({ id: slug, label }));
    }, [initialProjects]);

    const filteredProjects = filter === 'all' 
        ? initialProjects 
        : initialProjects.filter(p => p.categorySlug === filter);

    return (
        <div className="bg-slate-950 animate-fade-in font-sans min-h-screen text-slate-200 overflow-x-hidden">
             
             {/* HERO SECTION */}
             {/* Đã giảm pt-40 pb-20 xuống pt-24 pb-10 cho mobile */}
             <section className="relative pt-24 md:pt-40 pb-10 md:pb-20 px-4 overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-amber-900/20 rounded-full blur-[80px] md:blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="max-w-8xl mx-auto px-0 md:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-10 border-b border-slate-800 pb-8 md:pb-12">
                        <div className="max-w-4xl">
                            {/* Chỉnh lại size text cho mobile */}
                            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter leading-[1] md:leading-[0.9] mb-4 md:mb-8">
                                SELECTED <br/> 
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-700">WORKS.</span>
                            </h1>
                            <p className="text-base md:text-xl text-slate-400 font-light max-w-xl leading-relaxed">
                                Tuyển tập những công trình kiến trúc nội thất sử dụng vật liệu ốp tường cao cấp Đại Nam Wall. Nơi kỹ thuật gặp gỡ nghệ thuật.
                            </p>
                        </div>
                        <div className="hidden md:block pb-4">
                            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500">
                                <span className="w-12 h-px bg-slate-700"></span> Scroll Down
                            </div>
                        </div>
                    </div>

                    {/* FILTER BUTTONS - Chuyển sang Scroll ngang trên Mobile */}
                    <div className="mt-8 md:mt-12 -mx-4 px-4 md:mx-0 md:px-0 flex overflow-x-auto md:flex-wrap gap-3 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.id)}
                                className={`whitespace-nowrap px-6 py-2 md:px-8 md:py-3 rounded-full text-xs md:text-sm font-bold transition-all duration-500 border ${
                                    filter === cat.id 
                                    ? 'bg-white text-slate-950 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                                    : 'bg-transparent text-slate-500 border-slate-800 hover:border-slate-500 hover:text-white'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
             </section>

             {/* PROJECT GRID */}
             <section className="pb-16 md:pb-32 px-4">
                <div className="max-w-8xl mx-auto px-0 md:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 md:gap-y-20">
                        {filteredProjects.map((project, index) => (
                             <div 
                                key={project.id} 
                                className={`group relative ${index % 3 === 0 ? 'md:col-span-2' : 'md:col-span-1'}`}
                             >
                                {/* Index Number Background - Ẩn trên mobile để đỡ rối */}
                                <span className="hidden md:block absolute -top-16 -left-4 text-[120px] font-bold text-slate-800/20 leading-none select-none z-0 transition-all duration-700 group-hover:text-slate-800/40 group-hover:-translate-y-4">
                                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                                </span>

                                <Link href={`/du-an/${project.slug}`} className="relative z-10 block overflow-hidden rounded-md cursor-pointer">
                                    {/* Chỉnh aspect ratio thống nhất hơn trên mobile */}
                                    <div className={`overflow-hidden relative aspect-[4/3] ${index % 3 === 0 ? 'md:aspect-[21/9]' : 'md:aspect-[4/3]'} bg-slate-900 rounded-lg`}>
                                        <img 
                                            src={project.image} 
                                            alt={project.title} 
                                            className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] md:group-hover:scale-110 opacity-90 md:opacity-80 md:group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent md:bg-slate-950/40 md:group-hover:bg-transparent transition-colors duration-700"></div>
                                        
                                        {/* Icon mũi tên - hiển thị luôn góc phải ở mobile, giữa ở desktop */}
                                        <div className="absolute top-4 right-4 md:inset-0 flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 md:scale-50 md:group-hover:scale-100 pointer-events-none">
                                            <div className="w-10 h-10 md:w-24 md:h-24 bg-white/20 md:bg-white/10 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center text-white">
                                                <ArrowUpRight className="w-5 h-5 md:w-8 md:h-8" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Thu gọn phần mô tả trên mobile */}
                                    <div className="mt-4 md:mt-8 flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-6 border-t border-slate-800 pt-4 md:pt-6 md:group-hover:border-slate-600 transition-colors duration-500">
                                        <div className="max-w-xl">
                                            <h3 className="text-xl md:text-4xl font-bold text-white mb-2 md:mb-3 md:group-hover:text-amber-400 transition-colors">
                                                {project.title}
                                            </h3>
                                            <p className="text-sm md:text-base text-slate-400 font-light leading-relaxed mb-3 md:mb-4 line-clamp-2">
                                                {project.desc}
                                            </p>
                                            <div className="flex gap-2 flex-wrap">
                                                {project.tags.map((tag, i) => (
                                                    <span key={i} className="text-[10px] md:text-xs text-slate-500 border border-slate-800 px-2 py-1 rounded md:hover:bg-slate-800 transition-colors">#{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        {/* Icon stats - dàn hàng ngang gọn gàng trên mobile */}
                                        <div className="flex flex-row flex-wrap md:flex-col gap-3 md:gap-2 text-xs md:text-sm text-slate-400 min-w-[150px] md:text-right mt-2 md:mt-0">
                                            <div className="flex items-center md:justify-end gap-1.5">
                                                <MapPin size={14} className="text-amber-500"/> {project.location}
                                            </div>
                                            <div className="flex items-center md:justify-end gap-1.5">
                                                <Calendar size={14} className="text-amber-500"/> {project.year}
                                            </div>
                                            <div className="flex items-center md:justify-end gap-1.5">
                                                <Ruler size={14} className="text-amber-500"/> {project.area}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                             </div>
                        ))}
                    </div>
                </div>
             </section>

             {/* STATS SECTION */}
             <section className="py-12 md:py-24 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center divide-x divide-white/10">
                        <div className="space-y-1 md:space-y-2">
                            <p className="text-3xl md:text-6xl font-bold text-white ">10<span className="text-amber-400">+</span></p>
                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">Năm Kinh Nghiệm</p>
                        </div>
                        <div className="space-y-1 md:space-y-2">
                            <p className="text-3xl md:text-6xl font-bold text-white ">5k<span className="text-amber-400">+</span></p>
                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">Dự Án Hoàn Thành</p>
                        </div>
                        <div className="space-y-1 md:space-y-2">
                            <p className="text-3xl md:text-6xl font-bold text-white ">99<span className="text-amber-400">%</span></p>
                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">Hài Lòng</p>
                        </div>
                        <div className="space-y-1 md:space-y-2 border-none sm:border-solid">
                            <p className="text-3xl md:text-6xl font-bold text-white ">15</p>
                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">Năm Bảo Hành</p>
                        </div>
                    </div>
                </div>
             </section>

             {/* CTA SECTION */}
             <section className="py-16 md:py-32 bg-slate-950 text-center border-t border-slate-900">
                <div className="max-w-4xl mx-auto px-4">
                    <p className="text-amber-500 text-xs md:text-sm font-bold uppercase tracking-widest mb-4 md:mb-6 animate-pulse">Ready to start?</p>
                    <h2 className="text-3xl md:text-7xl font-bold text-white mb-8 md:mb-10 tracking-tight leading-tight md:leading-none">
                        Let's build your <br className="hidden md:block"/>
                        <span className="italic text-slate-500 md:ml-2">dream space.</span>
                    </h2>
                    <div className="flex justify-center">
                        <Link href="/lien-he" className="w-full sm:w-auto">
                             <button className="w-full sm:w-auto h-14 md:h-16 px-8 md:px-12 text-sm md:text-base font-bold uppercase tracking-widest bg-white text-slate-950 hover:bg-amber-400 hover:text-slate-900 border-none transition-all duration-300 rounded-full">
                                Bắt đầu dự án
                             </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
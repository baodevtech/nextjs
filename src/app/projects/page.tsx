'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Calendar, Ruler } from 'lucide-react';
import { Button } from '@/components/common/UI';

const PROJECT_CATEGORIES = [
  { id: 'all', label: 'All Projects' },
  { id: 'residential', label: 'Residential' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'hospitality', label: 'Hospitality' },
];

const PROJECTS = [
  {
    id: 1,
    title: "Penthouse Ecopark Grand",
    category: "residential",
    location: "Hưng Yên",
    year: "2024",
    area: "350m²",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1600&auto=format&fit=crop",
    desc: "Bản giao hưởng của gỗ óc chó và đá Marble tự nhiên, tạo nên không gian sống thượng lưu giữa lòng khu đô thị xanh.",
    tags: ["Nano Panel", "Lam sóng", "PVC Stone"]
  },
  {
    id: 2,
    title: "Metropole Legend Lounge",
    category: "hospitality",
    location: "Hoàn Kiếm, HN",
    year: "2023",
    area: "1200m²",
    image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=1600&auto=format&fit=crop",
    desc: "Không gian sảnh chờ khách sạn 5 sao với hệ trần nan gỗ uốn lượn phức tạp, kết hợp ánh sáng nghệ thuật.",
    tags: ["Trần nan gỗ", "Vách 3D"]
  },
  {
    id: 3,
    title: "Vinhomes Riverside Villa",
    category: "residential",
    location: "Long Biên, HN",
    year: "2023",
    area: "500m²",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1600&auto=format&fit=crop",
    desc: "Biệt thự đơn lập phong cách Neoclassical. Sử dụng phào chỉ PU dát vàng và tấm ốp than tre chống ẩm tuyệt đối.",
    tags: ["Than tre", "Phào chỉ"]
  },
  {
    id: 4,
    title: "Audi Showroom Danang",
    category: "commercial",
    location: "Đà Nẵng",
    year: "2022",
    area: "800m²",
    image: "https://images.unsplash.com/photo-1565514020176-db704df6b883?q=80&w=1600&auto=format&fit=crop",
    desc: "Thiết kế Industrial Modern với mảng tường hiệu ứng bê tông đúc sẵn từ tấm ốp PVC khổ lớn.",
    tags: ["Giả bê tông", "PVC"]
  },
  {
    id: 5,
    title: "Sky Lake Duplex",
    category: "residential",
    location: "Mỹ Đình, HN",
    year: "2023",
    area: "220m²",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1600&auto=format&fit=crop",
    desc: "Căn hộ thông tầng hiện đại với điểm nhấn là vách tivi cao 6m ốp đá xuyên sáng.",
    tags: ["Đá xuyên sáng", "Vách TV"]
  },
  {
    id: 6,
    title: "Techcombank Head Office",
    category: "commercial",
    location: "Ba Đình, HN",
    year: "2024",
    area: "2000m²",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
    desc: "Văn phòng làm việc hạng A sử dụng vật liệu cách âm, tiêu âm cao cấp cho vách ngăn và trần.",
    tags: ["Tiêu âm", "Vách ngăn"]
  }
];

export default function ProjectsPage() {
    const [filter, setFilter] = useState('all');

    const filteredProjects = filter === 'all' 
        ? PROJECTS 
        : PROJECTS.filter(p => p.category === filter);

    return (
        <div className="bg-slate-950 animate-fade-in font-sans min-h-screen text-slate-200">
             <section className="relative pt-40 pb-20 px-4 overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-900/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10 border-b border-slate-800 pb-12">
                        <div className="max-w-4xl">
                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter leading-[0.9] mb-8">
                                SELECTED <br/> 
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-700">WORKS.</span>
                            </h1>
                            <p className="text-xl text-slate-400 font-light max-w-xl leading-relaxed">
                                Tuyển tập những công trình kiến trúc nội thất sử dụng vật liệu ốp tường cao cấp Đại Nam Wall. Nơi kỹ thuật gặp gỡ nghệ thuật.
                            </p>
                        </div>
                        <div className="hidden md:block pb-4">
                            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-500 rotate-0">
                                <span className="w-12 h-px bg-slate-700"></span> Scroll Down
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-12">
                        {PROJECT_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.id)}
                                className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-500 border ${
                                    filter === cat.id 
                                    ? 'bg-white text-slate-950 border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                                    : 'bg-transparent text-slate-500 border-slate-800 hover:border-slate-500 hover:text-white'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
             </section>

             <section className="pb-32 px-4">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-20">
                        {filteredProjects.map((project, index) => (
                             <div 
                                key={project.id} 
                                className={`group relative ${index % 3 === 0 ? 'md:col-span-2' : 'md:col-span-1'}`}
                             >
                                <span className="absolute -top-16 -left-4 text-[120px] font-bold text-slate-800/20 leading-none select-none z-0 transition-all duration-700 group-hover:text-slate-800/40 group-hover:-translate-y-4">
                                    0{index + 1}
                                </span>

                                <Link href={`/projects/${project.id}`} className="relative z-10 block overflow-hidden rounded-sm cursor-pointer">
                                    <div className={`overflow-hidden relative ${index % 3 === 0 ? 'aspect-[21/9]' : 'aspect-[4/3]'} bg-slate-900`}>
                                        <img 
                                            src={project.image} 
                                            alt={project.title} 
                                            className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-transparent transition-colors duration-700"></div>
                                        
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100 pointer-events-none">
                                            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full border border-white/30 flex items-center justify-center text-white">
                                                <ArrowUpRight size={32} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex flex-col md:flex-row md:items-start justify-between gap-6 border-t border-slate-800 pt-6 group-hover:border-slate-600 transition-colors duration-500">
                                        <div className="max-w-xl">
                                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">{project.title}</h3>
                                            <p className="text-slate-400 font-light leading-relaxed mb-4 line-clamp-2">
                                                {project.desc}
                                            </p>
                                            <div className="flex gap-2 flex-wrap">
                                                {project.tags.map((tag, i) => (
                                                    <span key={i} className="text-xs text-slate-500 border border-slate-800 px-2 py-1 rounded hover:bg-slate-800 transition-colors">#{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-row md:flex-col gap-6 md:gap-2 text-sm text-slate-500 min-w-[150px] md:text-right">
                                            <div className="flex items-center md:justify-end gap-2">
                                                <MapPin size={14} className="text-amber-500"/> {project.location}
                                            </div>
                                            <div className="flex items-center md:justify-end gap-2">
                                                <Calendar size={14} className="text-amber-500"/> {project.year}
                                            </div>
                                            <div className="flex items-center md:justify-end gap-2">
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

             <section className="py-24 bg-brand-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x divide-white/10">
                        <div className="space-y-2">
                            <p className="text-5xl md:text-6xl font-bold text-white ">10<span className="text-amber-400">+</span></p>
                            <p className="text-xs font-bold uppercase tracking-widest text-brand-200">Năm Kinh Nghiệm</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-5xl md:text-6xl font-bold text-white ">5k<span className="text-amber-400">+</span></p>
                            <p className="text-xs font-bold uppercase tracking-widest text-brand-200">Dự Án Hoàn Thành</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-5xl md:text-6xl font-bold text-white ">99<span className="text-amber-400">%</span></p>
                            <p className="text-xs font-bold uppercase tracking-widest text-brand-200">Hài Lòng</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-5xl md:text-6xl font-bold text-white ">15</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-brand-200">Năm Bảo Hành</p>
                        </div>
                    </div>
                </div>
             </section>

             <section className="py-32 bg-slate-950 text-center border-t border-slate-900">
                <div className="max-w-4xl mx-auto px-4">
                    <p className="text-amber-500 text-sm font-bold uppercase tracking-widest mb-6 animate-pulse">Ready to start?</p>
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-10 tracking-tight leading-none">
                        Let's build your <br/>
                        <span className="italic  text-slate-500">dream space.</span>
                    </h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link href="/contact">
                             <Button className="h-16 px-12 text-base font-bold uppercase tracking-widest bg-white text-slate-950 hover:bg-amber-400 hover:text-slate-900 border-none transition-all duration-300">
                                Bắt đầu dự án
                             </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};
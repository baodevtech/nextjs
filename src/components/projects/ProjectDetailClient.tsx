'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
    ArrowLeft, ArrowRight, Layout, Quote, X, ChevronLeft, 
    ChevronRight, ZoomIn, Grid 
} from 'lucide-react';
import { Project } from '@/types';

interface ProjectDetailClientProps {
  project: Project;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
    const router = useRouter();
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // --- Lightbox Logic (Giữ nguyên từ code mẫu) ---
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, currentImageIndex]);

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = 'auto';
    };

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % project.gallery.length);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + project.gallery.length) % project.gallery.length);
    };

    // --- Render ---
    return (
        <div className="bg-slate-950 font-sans text-slate-200 animate-fade-in selection:bg-amber-500 selection:text-white">
            
            {/* LIGHTBOX (Giữ nguyên cấu trúc HTML/Tailwind của bạn) */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col animate-fade-in touch-none">
                    {/* ... (Copy nguyên phần Lightbox UI từ code mẫu vào đây) ... */}
                    <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-50 text-white bg-gradient-to-b from-black/50 to-transparent">
                        <div className="flex items-center gap-3">
                             <Grid size={20} className="text-amber-500"/>
                             <span className="text-sm font-bold tracking-widest uppercase">{project.title}</span>
                             <span className="text-xs font-mono opacity-50 border-l border-white/20 pl-3 ml-3 hidden sm:inline-block">
                                 {currentImageIndex + 1} / {project.gallery.length}
                             </span>
                        </div>
                        <button onClick={closeLightbox} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
                            <X size={28} strokeWidth={1.5} />
                        </button>
                    </div>

                    <div className="flex-1 flex items-center justify-center relative w-full h-full p-4 md:p-12 lg:p-20 overflow-hidden">
                        <button onClick={prevImage} className="absolute left-4 lg:left-8 p-4 rounded-full bg-white/5 hover:bg-white/20 text-white/50 hover:text-white hidden md:flex items-center justify-center backdrop-blur-sm transition-all group z-40 border border-white/5">
                            <ChevronLeft size={32} />
                        </button>
                        <div className="relative w-full h-full flex items-center justify-center">
                             <img 
                                key={currentImageIndex}
                                src={project.gallery[currentImageIndex]} 
                                className="max-w-full max-h-full object-contain shadow-2xl animate-fade-in select-none"
                            />
                        </div>
                        <button onClick={nextImage} className="absolute right-4 lg:right-8 p-4 rounded-full bg-white/5 hover:bg-white/20 text-white/50 hover:text-white hidden md:flex items-center justify-center backdrop-blur-sm transition-all group z-40 border border-white/5">
                            <ChevronRight size={32} />
                        </button>
                    </div>
                </div>
            )}

            {/* HERO SECTION */}
            <section className="relative h-screen w-full overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover animate-pan-slow"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-slate-950/20"></div>
                </div>

                <div className="absolute top-8 left-8 z-20">
                     <Link href="/du-an" className="flex items-center gap-2 text-white/70 hover:text-amber-400 transition-colors uppercase text-xs font-bold tracking-widest group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Works
                     </Link>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-20">
                    <div className="max-w-7xl mx-auto">
                        <span className="text-amber-400 text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-4 block animate-slide-up">
                            {project.category}
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold text-white mb-10 tracking-tight leading-none animate-slide-up">
                            {project.title}
                        </h1>
                        <div className="flex flex-wrap gap-x-12 gap-y-6 border-t border-white/10 pt-8 animate-slide-up">
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Location</p>
                                <p className="text-white font-medium text-lg">{project.location}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Year</p>
                                <p className="text-white font-medium text-lg">{project.year}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Area</p>
                                <p className="text-white font-medium text-lg">{project.area}</p>
                            </div>
                             <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Architect</p>
                                <p className="text-white font-medium text-lg">{project.architect}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTENT & STORY */}
            <section className="py-24 md:py-32 px-4 bg-slate-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                        
                        {/* LEFT: STORY & MATERIALS */}
                        <div className="lg:col-span-4 space-y-12">
                            <div>
                                <h2 className="text-4xl font-bold text-white mb-8 leading-tight">
                                    Câu chuyện <br/>
                                    <span className="text-amber-500 italic">Thiết kế.</span>
                                </h2>
                                <p className="text-slate-300 text-lg leading-loose font-light text-justify">
                                    {project.desc}
                                </p>
                            </div>

                            <div className="bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-amber-500/50 transition-colors duration-500">
                                <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6 flex items-center gap-3">
                                    <Layout size={18} className="text-amber-500" /> Palette Vật liệu
                                </h3>
                                <ul className="space-y-4">
                                    {project.materials.map((item: string, idx: number) => (
                                        <li key={idx} className="flex items-center gap-3 text-sm text-slate-300 group">
                                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-amber-400 transition-colors"></span>
                                            <span className="group-hover:text-white transition-colors">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* RIGHT: CHALLENGE & SOLUTION */}
                        <div className="lg:col-span-8 space-y-8">
                            <div className="group relative bg-slate-900/50 p-8 md:p-12 rounded-3xl border border-white/5 hover:bg-slate-900 hover:border-amber-500/30 transition-all duration-500 overflow-hidden">
                                <div className="absolute -right-10 -top-10 text-[180px] font-bold text-white/5 group-hover:text-white/10 transition-colors select-none leading-none">01</div>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                        Thách thức <ArrowRight className="text-amber-500 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                                    </h3>
                                    <p className="text-slate-400 font-light text-lg leading-relaxed group-hover:text-slate-300 transition-colors">
                                        {project.challenge}
                                    </p>
                                </div>
                            </div>

                             <div className="group relative bg-slate-900/50 p-8 md:p-12 rounded-3xl border border-white/5 hover:bg-slate-900 hover:border-amber-500/30 transition-all duration-500 overflow-hidden">
                                <div className="absolute -right-10 -top-10 text-[180px] font-bold text-white/5 group-hover:text-white/10 transition-colors select-none leading-none">02</div>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                        Giải pháp Đại Nam <ArrowRight className="text-amber-500 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                                    </h3>
                                    <p className="text-slate-400 font-light text-lg leading-relaxed group-hover:text-slate-300 transition-colors">
                                        {project.solution}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-8 px-4 md:px-12">
                                <Quote className="text-amber-500 mb-6 opacity-80" size={40}/>
                                <p className="text-2xl italic text-slate-200 leading-relaxed opacity-90">
                                    "Đại Nam Wall đã làm việc cực kỳ chuyên nghiệp. Chất lượng hoàn thiện và sự tỉ mỉ trong từng đường nét vượt xa mong đợi của tôi."
                                </p>
                                <div className="flex items-center gap-4 mt-8">
                                    <div className="w-12 h-px bg-slate-700"></div>
                                    <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">{project.client}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* GALLERY GRID */}
            <section className="py-20 bg-slate-950">
                 <div className="max-w-[1920px] mx-auto px-4">
                    <div className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
                        <div className="flex items-end gap-4">
                            <h2 className="text-3xl font-bold text-white">Project Gallery</h2>
                            <span className="text-sm font-mono text-amber-500 mb-1">{project.gallery.length} Images</span>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <ZoomIn size={14}/> Click to Expand
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[300px] md:auto-rows-[400px]">
                        {project.gallery.map((img: string, idx: number) => (
                            <div 
                                key={idx}
                                onClick={() => openLightbox(idx)}
                                className={`relative group overflow-hidden rounded-sm cursor-zoom-in ${idx === 0 ? 'md:col-span-2 lg:col-span-2 md:row-span-2' : ''}`}
                            >
                                <img 
                                    src={img} 
                                    alt={`Gallery ${idx}`} 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500"></div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 transform scale-50 group-hover:scale-100 transition-transform duration-500">
                                        <ZoomIn size={28} strokeWidth={1.5} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            </section>

            {/* NEXT PROJECT (Có thể truyền prop hoặc để tĩnh) */}
            <section className="py-32 bg-slate-900 relative overflow-hidden group cursor-pointer" onClick={() => router.push('/du-an/')}>
                 <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700 scale-105 group-hover:scale-100 transform transition-transform">

                    <img

                        src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=2000&auto=format&fit=crop"

                        className="w-full h-full object-cover filter grayscale"

                        alt="Next"

                    />

                 </div>

                 <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>

                 

                 <div className="relative z-10 max-w-7xl mx-auto px-4">

                    <div className="max-w-xl">

                        <p className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-6 flex items-center gap-3">

                            <span className="w-8 h-px bg-amber-500"></span> Next Project

                        </p>

                        <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 group-hover:text-amber-50 transition-colors ">

                            TIẾP THEO

                        </h2>

                        <div className="inline-flex items-center gap-4 text-white font-bold text-sm uppercase tracking-widest group-hover:gap-8 transition-all duration-300">

                            Xem chi tiết <ArrowRight className="text-amber-500" />

                        </div>

                    </div>

                 </div>

            </section>
        </div>
    );
}
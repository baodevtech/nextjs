'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Layout, Quote, X, ChevronLeft, ChevronRight, ZoomIn, Grid } from 'lucide-react';

const PROJECT_DETAILS: Record<string, any> = {
  "1": {
    id: 1,
    title: "Penthouse Ecopark Grand",
    subtitle: "A Symphony of Walnut & Marble",
    location: "Hưng Yên",
    year: "2024",
    area: "350m²",
    client: "Mr. Hưng",
    architect: "Studio D12",
    heroImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop",
    description: "Nằm tại vị trí đắc địa của khu đô thị xanh Ecopark, căn Penthouse này là hiện thân của sự sang trọng tinh tế. Gia chủ mong muốn một không gian vừa ấm cúng cho gia đình, vừa đủ đẳng cấp để tiếp đón đối tác. Thiết kế tập trung vào việc mở rộng tầm nhìn ra thiên nhiên bên ngoài, đồng thời sử dụng vật liệu nội thất để tạo nên sự kết nối liền mạch giữa các không gian.",
    challenge: "Thách thức lớn nhất là xử lý hệ thống trần cao 6m tại phòng khách. Nếu không khéo léo, không gian sẽ trở nên lạnh lẽo và thiếu liên kết. Ngoài ra, việc tích hợp hệ thống điều hòa âm trần phức tạp mà không phá vỡ kết cấu thẩm mỹ của trần cũng là một bài toán khó.",
    solution: "Đại Nam Wall đã sử dụng hệ tấm ốp than tre khổ lớn (1.2m x 2.8m) kết hợp nẹp inox mạ vàng PVD để tạo điểm nhấn dọc, giúp 'kéo' trần xuống về mặt thị giác. Trần được xử lý bằng nan gỗ nhựa composite uốn cong (Curved Ceiling), tạo cảm giác mềm mại, dẫn hướng ánh nhìn và giấu kín các miệng gió điều hòa.",
    materials: ["Tấm ốp Nano Vân Gỗ Óc Chó", "PVC Vân Đá Trắng Sứ", "Nẹp Inox 304 Gold", "Lam sóng bán nguyệt"],
    gallery: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop", 
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  "2": {
    id: 2,
    title: "Metropole Legend Lounge",
    subtitle: "Hospitality Elegance",
    location: "Hoàn Kiếm, Hà Nội",
    year: "2023",
    area: "1200m²",
    client: "Metropole Group",
    architect: "Indochine Arts",
    heroImage: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=2000&auto=format&fit=crop",
    description: "Dự án cải tạo sảnh chờ khách sạn 5 sao Metropole Legend. Yêu cầu đặt ra là giữ nguyên nét cổ điển Đông Dương nhưng vẫn phải mang hơi thở đương đại, sang trọng và bền bỉ với thời gian.",
    challenge: "Thi công trong môi trường khách sạn vẫn đang hoạt động, yêu cầu tuyệt đối không tiếng ồn, không bụi bặm và tiến độ thần tốc (chỉ được phép thi công từ 0h - 5h sáng).",
    solution: "Sử dụng giải pháp 'Thi công khô' của Đại Nam Wall. Tấm ốp PVC giả đá cẩm thạch xuyên sáng kết hợp khung xương thép tiền chế. Toàn bộ vật liệu được cắt CNC chính xác tại nhà máy và chỉ lắp ráp tại công trình, giảm 90% bụi và tiếng ồn.",
    materials: ["Đá xuyên sáng nhân tạo", "Phào chỉ PU dát vàng", "Tấm ốp vân vải"],
    gallery: [
       "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=2000&auto=format&fit=crop",
       "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1200&auto=format&fit=crop",
       "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop"
    ]
  },
  "default": {
    id: 0,
    title: "Modern Luxury Villa",
    subtitle: "Bespoke Interior Design",
    location: "Vietnam",
    year: "2024",
    area: "500m²",
    client: "Private Owner",
    architect: "Đại Nam Design",
    heroImage: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop",
    description: "Một công trình tiêu biểu cho phong cách hiện đại sang trọng (Modern Luxury), sử dụng tối đa vật liệu thân thiện môi trường để tạo nên không gian sống xanh.",
    challenge: "Tạo ra sự liên kết giữa không gian trong nhà và sân vườn, đồng thời đảm bảo khả năng chống ẩm mốc cho các bức tường tầng 1 vốn hay bị nồm ẩm.",
    solution: "Sử dụng tấm ốp cốt than tre chống nước tuyệt đối. Bề mặt phủ film PET chống trầy xước, chịu va đập tốt. Màu sắc trung tính được lựa chọn để làm nền cho các đồ nội thất rời.",
    materials: ["Cốt than tre", "Film PET Metal", "Lam sóng"],
    gallery: [
        "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop"
    ]
  }
};

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [project, setProject] = useState<any>(null);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const data = PROJECT_DETAILS[params.id || ""] || PROJECT_DETAILS["default"];
        setProject(data);
    }, [params.id]);

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
        if (project) {
            setCurrentImageIndex((prev) => (prev + 1) % project.gallery.length);
        }
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (project) {
            setCurrentImageIndex((prev) => (prev - 1 + project.gallery.length) % project.gallery.length);
        }
    };

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;
        
        if (isLeftSwipe) nextImage();
        if (isRightSwipe) prevImage();
    };

    if (!project) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;

    const nextProjectId = (parseInt(params.id || "1") + 1).toString();

    return (
        <div className="bg-slate-950 font-sans text-slate-200 animate-fade-in selection:bg-amber-500 selection:text-white">
            
            {lightboxOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col animate-fade-in touch-none">
                    <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-50 text-white bg-gradient-to-b from-black/50 to-transparent">
                        <div className="flex items-center gap-3">
                             <Grid size={20} className="text-amber-500"/>
                             <span className="text-sm font-bold tracking-widest uppercase">{project.title}</span>
                             <span className="text-xs font-mono opacity-50 border-l border-white/20 pl-3 ml-3 hidden sm:inline-block">
                                 {currentImageIndex + 1} / {project.gallery.length}
                             </span>
                        </div>
                        <button 
                            onClick={closeLightbox}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                        >
                            <X size={28} strokeWidth={1.5} />
                        </button>
                    </div>

                    <div 
                        className="flex-1 flex items-center justify-center relative w-full h-full p-4 md:p-12 lg:p-20 overflow-hidden"
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <button onClick={prevImage} className="absolute left-4 lg:left-8 p-4 rounded-full bg-white/5 hover:bg-white/20 text-white/50 hover:text-white hidden md:flex items-center justify-center backdrop-blur-sm transition-all group z-40 border border-white/5">
                            <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" strokeWidth={1} />
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center">
                             <img 
                                key={currentImageIndex}
                                src={project.gallery[currentImageIndex]} 
                                alt={`Gallery ${currentImageIndex + 1}`} 
                                className="max-w-full max-h-full object-contain shadow-2xl animate-fade-in select-none"
                                draggable={false}
                            />
                        </div>

                        <button onClick={nextImage} className="absolute right-4 lg:right-8 p-4 rounded-full bg-white/5 hover:bg-white/20 text-white/50 hover:text-white hidden md:flex items-center justify-center backdrop-blur-sm transition-all group z-40 border border-white/5">
                            <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" strokeWidth={1}/>
                        </button>
                    </div>

                    <div className="h-24 bg-black/40 backdrop-blur-md border-t border-white/10 flex items-center justify-center gap-3 overflow-x-auto px-4 py-3 no-scrollbar z-50">
                        {project.gallery.map((img: string, idx: number) => (
                            <button 
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                className={`relative h-full aspect-square rounded-lg overflow-hidden transition-all duration-300 flex-shrink-0 border-2 ${currentImageIndex === idx ? 'border-amber-500 opacity-100 scale-100 shadow-lg shadow-amber-500/20' : 'border-transparent opacity-40 hover:opacity-100 hover:border-white/30 scale-95'}`}
                            >
                                <img src={img} className="w-full h-full object-cover" loading="lazy" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <section className="relative h-screen w-full overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src={project.heroImage} 
                        alt={project.title} 
                        className="w-full h-full object-cover animate-pan-slow"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-slate-950/20"></div>
                </div>

                <div className="absolute top-8 left-8 z-20">
                     <Link href="/projects" className="flex items-center gap-2 text-white/70 hover:text-amber-400 transition-colors uppercase text-xs font-bold tracking-widest group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Works
                     </Link>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-20">
                    <div className="max-w-7xl mx-auto">
                        <span className="text-amber-400 text-xs md:text-sm font-bold uppercase tracking-[0.3em] mb-4 block animate-slide-up">
                            {project.subtitle}
                        </span>
                        <h1 className="text-5xl md:text-7xl lg:text-9xl  font-bold text-white mb-10 tracking-tight leading-none animate-slide-up" style={{ animationDelay: '0.1s' }}>
                            {project.title}
                        </h1>
                        <div className="flex flex-wrap gap-x-12 gap-y-6 border-t border-white/10 pt-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
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

            <section className="py-24 md:py-32 px-4 bg-slate-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                        
                        <div className="lg:col-span-4 space-y-12">
                            <div>
                                <h2 className="text-4xl  font-bold text-white mb-8 leading-tight">
                                    Câu chuyện <br/>
                                    <span className="text-amber-500 italic">Thiết kế.</span>
                                </h2>
                                <p className="text-slate-300 text-lg leading-loose font-light text-justify">
                                    {project.description}
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
                                <p className="text-2xl italic text-slate-200  leading-relaxed opacity-90">
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

            <section className="py-20 bg-slate-950">
                 <div className="max-w-[1920px] mx-auto px-4">
                    <div className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
                        <div className="flex items-end gap-4">
                            <h2 className="text-3xl  font-bold text-white">Project Gallery</h2>
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
                                className={`
                                    relative group overflow-hidden rounded-sm cursor-zoom-in 
                                    ${idx === 0 ? 'md:col-span-2 lg:col-span-2 md:row-span-2' : ''}
                                `}
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

            <section className="py-32 bg-slate-900 relative overflow-hidden group cursor-pointer" onClick={() => router.push(`/projects/${nextProjectId}`)}>
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
};
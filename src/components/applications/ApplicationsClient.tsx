'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
    ArrowRight, Maximize2, Droplets, Mic2, Zap, Info,
    MoveHorizontal, Plus, ChevronDown, ShieldCheck, Layers,
    Star, Clock, Leaf, LucideIcon
} from 'lucide-react';
import { Button } from '@/components/common/UI';
import { ApplicationPageData, ApplicationSpace } from '@/types';

// --- ICON MAPPING ---
const ICON_MAP: Record<string, LucideIcon> = {
    'layers': Layers,
    'maximize': Maximize2,
    'zap': Zap,
    'mic': Mic2,
    'shield': ShieldCheck,
    'droplets': Droplets,
    'star': Star,
    'clock': Clock,
    'leaf': Leaf,
    'default': Info
};

const ICON_COLORS: Record<string, string> = {
    'clock': 'text-amber-500 bg-amber-500/20',
    'leaf': 'text-green-500 bg-green-500/20',
    'droplets': 'text-blue-500 bg-blue-500/20',
    'default': 'text-slate-200 bg-slate-700'
};

// --- SUB-COMPONENTS ---

const InteractiveSpace: React.FC<{ space: ApplicationSpace, isActive: boolean }> = ({ space, isActive }) => {
    const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

    return (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <img
                src={space.image}
                alt={space.name}
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Hotspots Layer */}
            <div className="absolute inset-0 pointer-events-none">
                {space.hotspots.map((spot, idx) => {
                    const IconComponent = ICON_MAP[spot.iconType] || Info;
                    const isNearRightEdge = spot.x > 70; // Giúp popup không bị cắt nếu hotspot nằm sát lề phải

                    return (
                        <div
                            key={idx}
                            className="absolute pointer-events-auto z-20"
                            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                        >
                            {/* Hotspot Button */}
                            <button
                                onClick={() => setActiveHotspot(activeHotspot === idx ? null : idx)}
                                className="relative group focus:outline-none -translate-x-1/2 -translate-y-1/2"
                            >
                                {/* GIẢM: w-6 h-6 cho mobile, w-8 h-8 cho desktop */}
                                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/20 backdrop-blur-md border border-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-transform duration-300 hover:scale-110">
                                    <Plus size={14} className={`text-white md:w-4 md:h-4 transition-transform duration-300 ${activeHotspot === idx ? 'rotate-45' : ''}`} />
                                </div>
                                <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-30"></div>
                            </button>

                            {/* Popover Card - Responsive Positioning */}
                            <div className={`
                                absolute transition-all duration-300
                                /* Mobile: Nằm trên hoặc dưới điểm chạm */
                                top-full left-1/2 -translate-x-1/2 mt-2 origin-top
                                /* Desktop: Nằm bên phải (hoặc trái nếu sát lề) */
                                md:top-1/2 md:-translate-y-1/2 md:mt-0 md:origin-left
                                ${isNearRightEdge ? 'md:right-full md:mr-6 md:left-auto md:translate-x-0' : 'md:left-full md:ml-6 md:translate-x-0'}
                                w-[220px] sm:w-64 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/50 z-50
                                ${activeHotspot === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}
                            `}>
                                <div className="flex items-start gap-3 mb-2">
                                    <div className="p-2 bg-brand-50 rounded-lg text-brand-600 shrink-0">
                                        <IconComponent size={18} />
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-sm pt-1 leading-tight">{spot.label}</h4>
                                </div>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {spot.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const BeforeAfterSlider = ({ beforeImage, afterImage }: { beforeImage: string, afterImage: string }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleMove = (clientX: number) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
            setSliderPosition((x / rect.width) * 100);
        }
    };

    const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-[4/3] sm:aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden cursor-ew-resize select-none shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 group bg-slate-800"
            onMouseMove={(e) => isDragging.current && handleMove(e.clientX)}
            onMouseDown={() => isDragging.current = true}
            onMouseUp={() => isDragging.current = false}
            onMouseLeave={() => isDragging.current = false}
            onTouchMove={onTouchMove}
        >
            <img
                src={afterImage || 'https://via.placeholder.com/1600x900?text=After'}
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
                alt="After"
            />
            <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-black/60 backdrop-blur-md px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold text-white uppercase tracking-widest border border-white/20">
                Đã Hoàn Thiện
            </div>

            <div
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={beforeImage || 'https://via.placeholder.com/1600x900?text=Before'}
                    className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125"
                    draggable={false}
                    alt="Before"
                />
                <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-white/90 backdrop-blur-md px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-bold text-slate-900 uppercase tracking-widest shadow-lg">
                    Hiện Trạng Cũ
                </div>
            </div>

            <div
                className="absolute top-0 bottom-0 w-0.5 bg-white z-20 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:w-1 transition-all"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-2xl transform active:scale-95 transition-transform text-slate-900 border-4 border-slate-900/10">
                    <MoveHorizontal size={16} className="md:w-5 md:h-5" />
                </div>
            </div>
        </div>
    );
};

// --- MAIN CLIENT COMPONENT ---

interface ApplicationsClientProps {
    data: ApplicationPageData;
}

export default function ApplicationsClient({ data }: ApplicationsClientProps) {
    const [activeSpaceIdx, setActiveSpaceIdx] = useState(0);
    const activeSpace = data.spaces[activeSpaceIdx] || data.spaces[0] || {};
    const [bigCommItem, ...smallCommItems] = data.commItems;

    return (
        <div className="bg-slate-950 font-sans text-slate-200 animate-fade-in">

            {/* 1. CINEMATIC HERO */}
            <section className="relative h-[80vh] min-h-[600px] md:h-screen flex flex-col justify-center items-center overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <img
                        src={data.spaces[0]?.image || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000'}
                        alt="Hero Architecture"
                        className="w-full h-full object-cover animate-pan-slow"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/70 to-slate-950"></div>

                <div className="relative z-10 text-center max-w-5xl px-4 mt-16 md:mt-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-amber-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6 md:mb-8 animate-slide-up">
                        <Star size={12} fill="currentColor" /> Premium Wall Solutions
                    </div>
                    {/* Responsive Text Size */}
                    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 md:mb-8 leading-[1.15] md:leading-[1.1] tracking-tight animate-slide-up delay-100 px-2">
                        {data.heroTitle}
                    </h1>
                    <p className="text-slate-300 text-base md:text-xl font-light max-w-2xl mx-auto mb-10 md:mb-12 animate-slide-up delay-200 leading-relaxed whitespace-pre-line px-4">
                        {data.heroDesc}
                    </p>

                    <div className="animate-slide-up delay-300">
                        <ChevronDown className="w-8 h-8 md:w-10 md:h-10 text-white/50 mx-auto animate-bounce" />
                    </div>
                </div>
            </section>

            {/* 2. INTERACTIVE SPACE NAVIGATOR */}
            <section className="relative bg-slate-950 py-16 md:py-24 md:pb-32">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

                        {/* LEFT: Content & Navigation */}
                        <div className="lg:col-span-4 lg:sticky lg:top-32 z-20">
                            <div className="mb-8 md:mb-12 text-center lg:text-left">
                                <span className="text-amber-500 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-3 md:mb-4 block">Interactive Tour</span>
                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
                                    Giải Pháp <br className="hidden lg:block" /> Từng Phòng
                                </h2>
                                <p className="text-slate-400 text-sm md:text-lg font-light leading-relaxed max-w-md mx-auto lg:mx-0">
                                    Chọn không gian để khám phá ứng dụng cụ thể của vật liệu.
                                </p>
                            </div>

                            {/* Nav Pills - Ngang cho Mobile, Dọc cho Desktop */}
                            <div className="flex flex-row lg:flex-col gap-2 md:gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 snap-x lg:snap-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                {data.spaces.map((space, idx) => (
                                    <button
                                        key={space.id}
                                        onClick={() => setActiveSpaceIdx(idx)}
                                        // GIẢM: p-3 lg:p-4 (thay vì p-4 md:p-5), min-w-[140px] (thay vì 200px), bo góc nhỏ hơn
                                        className={`group flex items-center justify-between p-3 lg:p-4 rounded-lg md:rounded-xl transition-all duration-500 border text-left shrink-0 min-w-[140px] lg:min-w-0 snap-start ${activeSpaceIdx === idx
                                            ? 'bg-white/10 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.1)]'
                                            : 'bg-transparent border-white/5 hover:bg-white/5 text-slate-500 hover:text-white'
                                            }`}
                                    >
                                        <div>
                                            {/* GIẢM: text-sm lg:text-base (thay vì text-base md:text-xl) */}
                                            <span className={`text-sm lg:text-base font-bold block mb-0.5 transition-colors ${activeSpaceIdx === idx ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                                                {space.name}
                                            </span>

                                            {activeSpaceIdx === idx && (
                                                <span className="text-[10px] md:text-xs text-amber-400 font-medium animate-fade-in block">
                                                    Đang xem
                                                </span>
                                            )}
                                        </div>

                                        {/* GIẢM: Kích thước icon ArrowRight xuống 16 */}
                                        <ArrowRight size={16} className={`hidden md:block transition-all duration-300 ${activeSpaceIdx === idx ? 'text-amber-400 translate-x-0' : 'text-slate-600 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Visual Showcase */}
                        <div className="lg:col-span-8 flex flex-col">
                            {/* GIẢM CHIỀU CAO: h-[300px] cho mobile, h-[400px] cho tablet, h-[550px] cho laptop, h-[650px] cho màn to */}
                            <div className="relative h-[300px] sm:h-[400px] lg:h-[550px] xl:h-[650px] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900 transition-all duration-500">

                                {data.spaces.map((space, idx) => (
                                    <InteractiveSpace
                                        key={space.id}
                                        space={space}
                                        isActive={activeSpaceIdx === idx}
                                    />
                                ))}

                                {/* Floating Info Card (Desktop Chỉ định góc phải) */}
                                <div className="absolute bottom-6 right-6 z-20 hidden lg:block">
                                    {/* Thu nhỏ một chút padding và font chữ của thẻ Info Card trên Desktop cho đồng bộ */}
                                    <div className="bg-slate-950/80 backdrop-blur-xl p-5 rounded-xl border border-white/10 shadow-2xl max-w-[320px]">
                                        <h3 className="text-lg font-bold text-white mb-1.5">{activeSpace?.title}</h3>
                                        <p className="text-xs text-slate-400 mb-4 line-clamp-2">{activeSpace?.description}</p>
                                        <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-3">
                                            {activeSpace?.stats?.map((stat, i) => (
                                                <div key={i}>
                                                    <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">{stat.label}</p>
                                                    <p className="text-base font-bold text-amber-400">{stat.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Info Card (Đẩy xuống dưới ảnh thay vì chèn lên ảnh) - GIỮ NGUYÊN */}
                            <div className="lg:hidden mt-4 bg-slate-900/60 p-4 rounded-xl border border-white/5">
                                <h3 className="text-base font-bold text-white mb-1.5">{activeSpace?.title}</h3>
                                <p className="text-xs text-slate-400 mb-4 leading-relaxed">{activeSpace?.description}</p>
                                <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-3">
                                    {activeSpace?.stats?.map((stat, i) => (
                                        <div key={i}>
                                            <p className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">{stat.label}</p>
                                            <p className="text-sm font-bold text-amber-400">{stat.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 3. BEFORE / AFTER */}
            <section className="py-20 md:py-32 bg-slate-900 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-amber-900/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-10 md:mb-16">
                        <span className="text-amber-500 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-3 block">Renovation Magic</span>
                        <h2 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6 px-2">
                            {data.renovationHeading}
                        </h2>
                        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed px-4">
                            {data.renovationDesc}
                        </p>
                    </div>

                    <BeforeAfterSlider
                        beforeImage={data.beforeImage}
                        afterImage={data.afterImage}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mt-12 md:mt-16 text-center">
                        {data.renovationFeatures.map((feature, idx) => {
                            const IconComponent = ICON_MAP[feature.icon] || Info;
                            const colorClass = ICON_COLORS[feature.icon] || ICON_COLORS['default'];

                            return (
                                <div key={idx} className="p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className={`w-10 h-10 md:w-12 md:h-12 mx-auto rounded-full flex items-center justify-center mb-4 md:mb-4 ${colorClass}`}>
                                        <IconComponent size={20} className="md:w-6 md:h-6" />
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{feature.title}</h3>
                                    <p className="text-slate-400 text-xs md:text-sm">{feature.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 4. COMMERCIAL SHOWCASE */}
            <section className="py-16 md:py-24 bg-white text-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16">
                        <div className="mb-4 md:mb-0">
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-3 md:mb-4">
                                {data.commHeading}
                            </h2>
                            <p className="text-slate-500 text-base md:text-lg max-w-xl">
                                {data.commDesc}
                            </p>
                        </div>
                        <Link href={data.commLinkUrl} className="inline-flex items-center gap-2 font-bold text-brand-600 hover:text-brand-800 transition-colors">
                            {data.commLinkText} <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                        {/* ITEM LỚN (Bên trái) */}
                        {bigCommItem && (
                            <div className="group relative h-[300px] sm:h-[400px] lg:h-[550px] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer">
                                <img
                                    src={bigCommItem.image}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    alt={bigCommItem.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>
                                <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 pr-6 text-white">
                                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{bigCommItem.title}</h3>
                                    <p className="text-sm md:text-base text-slate-300 mb-3 md:mb-4 lg:opacity-0 lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 transition-all duration-500 line-clamp-2 md:line-clamp-none">
                                        {bigCommItem.desc}
                                    </p>
                                    <span className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs md:text-sm uppercase tracking-widest">
                                        Khám phá <ArrowRight size={14} className="md:w-4 md:h-4" />
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* CÁC ITEM NHỎ (Bên phải) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-4 md:gap-8 lg:h-[550px]">
                            {smallCommItems.map((item, idx) => (
                                <div key={idx} className="group relative h-[200px] sm:h-[250px] lg:h-auto rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer">
                                    <img
                                        src={item.image}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        alt={item.title}
                                    />
                                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors"></div>
                                    <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 pr-4 text-white">
                                        <h3 className="text-xl md:text-2xl font-bold mb-1">{item.title}</h3>
                                        <p className="text-xs md:text-sm text-slate-300 line-clamp-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. FINAL CTA */}
            <section className="py-16 md:py-24 bg-slate-950 text-center border-t border-white/10 px-4">
                <div className="max-w-4xl mx-auto">
                    <Info size={40} className="mx-auto text-amber-500 mb-4 md:mb-6 md:w-12 md:h-12" />
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
                        {data.ctaHeading}
                    </h2>
                    <p className="text-slate-400 text-base md:text-lg mb-8 md:mb-10 max-w-2xl mx-auto">
                        {data.ctaDesc}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
                        <Link href="/lien-he" className="w-full sm:w-auto">
                            <Button className="w-full h-14 md:h-16 px-8 md:px-12 text-xs md:text-sm font-bold uppercase tracking-widest bg-amber-500 text-slate-900 hover:bg-white border-none shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                                {data.ctaBtnPrimary}
                            </Button>
                        </Link>
                        <Link href="/san-pham" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full h-14 md:h-16 px-8 md:px-12 text-xs md:text-sm font-bold uppercase tracking-widest border-slate-700 text-white hover:bg-white hover:text-slate-900 hover:border-white">
                                {data.ctaBtnSecondary}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
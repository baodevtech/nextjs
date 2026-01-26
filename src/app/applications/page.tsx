
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
    ArrowRight, CheckCircle2, Maximize2, Droplets, Mic2, Sun, Zap, Info, 
    MoveHorizontal, Plus, X, ChevronDown, PlayCircle, ShieldCheck, Layers,
    Star, Clock, Leaf
} from 'lucide-react';
import { Button } from '@/components/common/UI';

// --- DATA TYPES & CONTENT ---

interface Hotspot {
    x: number;
    y: number;
    label: string;
    description: string;
    icon: React.ElementType;
}

interface SpaceData {
    id: string;
    name: string;
    title: string;
    description: string;
    image: string;
    hotspots: Hotspot[];
    stats: { label: string; value: string }[];
}

const SPACES: SpaceData[] = [
    {
        id: 'living',
        name: 'Phòng Khách',
        title: 'Tuyệt Tác Phòng Khách',
        description: 'Biến bức tường vô tri thành điểm nhấn nghệ thuật. Sự kết hợp giữa tấm ốp Nano vân gỗ óc chó và Lam sóng tạo chiều sâu không gian, mang lại vẻ đẹp quyền quý nhưng vẫn ấm cúng.',
        image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop',
        hotspots: [
            { x: 30, y: 40, label: 'Vách Tivi Nano', description: 'Bề mặt phủ Nano chống trầy xước, vân gỗ sắc nét như thật.', icon: Layers },
            { x: 65, y: 20, label: 'Trần Lam Sóng', description: 'Trọng lượng siêu nhẹ, an toàn tuyệt đối khi ốp trần.', icon: Maximize2 },
            { x: 85, y: 60, label: 'Góc Bo Cong', description: 'Công nghệ uốn nhiệt tấm ốp than tre độc quyền.', icon: Zap },
        ],
        stats: [
            { label: 'Thi công', value: '24h' },
            { label: 'Độ bền', value: '20+' },
            { label: 'Bảo hành', value: '15 Năm' }
        ]
    },
    {
        id: 'bedroom',
        name: 'Phòng Ngủ',
        title: 'Sự Tĩnh Lặng Hoàn Hảo',
        description: 'Không gian nghỉ ngơi cần sự an toàn tuyệt đối. Chúng tôi sử dụng cốt than tre hoạt tính giúp khử mùi, kháng khuẩn và đặc biệt là khả năng cách âm vượt trội.',
        image: 'https://images.unsplash.com/photo-1616594039964-40891a909d72?q=80&w=2000&auto=format&fit=crop',
        hotspots: [
            { x: 50, y: 50, label: 'Vách Đầu Giường', description: 'Tiêu âm, giảm tiếng ồn từ phòng bên cạnh.', icon: Mic2 },
            { x: 20, y: 70, label: 'An Toàn Sức Khỏe', description: 'Không chứa Formaldehyde, an toàn cho trẻ nhỏ.', icon: ShieldCheck },
        ],
        stats: [
            { label: 'Cách âm', value: '90%' },
            { label: 'An toàn', value: 'E0' },
            { label: 'Mẫu mã', value: '300+' }
        ]
    },
    {
        id: 'bathroom',
        name: 'Phòng Tắm',
        title: 'Spa Tại Gia',
        description: 'Tạm biệt nỗi lo tường thấm nước, bong tróc sơn. Tấm ốp PVC vân đá tráng gương là giải pháp thay thế hoàn hảo cho đá tự nhiên, chịu nước 100%.',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2000&auto=format&fit=crop',
        hotspots: [
            { x: 40, y: 45, label: 'PVC Vân Đá', description: 'Chống nước tuyệt đối, không bám rêu mốc.', icon: Droplets },
            { x: 70, y: 80, label: 'Sàn SPC', description: 'Chống trơn trượt, ấm chân vào mùa đông.', icon: Layers },
        ],
        stats: [
            { label: 'Chống nước', value: '100%' },
            { label: 'Vệ sinh', value: 'Dễ dàng' },
            { label: 'Chi phí', value: '-30%' } // So với đá
        ]
    }
];

// --- COMPONENTS ---

const InteractiveSpace: React.FC<{ space: SpaceData, isActive: boolean }> = ({ space, isActive }) => {
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
                {space.hotspots.map((spot, idx) => (
                    <div 
                        key={idx}
                        className="absolute pointer-events-auto"
                        style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    >
                        {/* Hotspot Button */}
                        <button 
                            onClick={() => setActiveHotspot(activeHotspot === idx ? null : idx)}
                            className="relative group focus:outline-none"
                        >
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-transform duration-300 hover:scale-110">
                                <Plus size={16} className={`text-white transition-transform duration-300 ${activeHotspot === idx ? 'rotate-45' : ''}`} />
                            </div>
                            <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-30"></div>
                        </button>

                        {/* Popover Card */}
                        <div className={`
                            absolute left-full ml-4 top-1/2 -translate-y-1/2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-2xl border border-white/50 origin-left transition-all duration-300
                            ${activeHotspot === idx ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-90 -translate-x-4 pointer-events-none'}
                        `}>
                            <div className="flex items-start gap-3 mb-2">
                                <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
                                    <spot.icon size={18} />
                                </div>
                                <h4 className="font-bold text-slate-900 text-sm pt-1">{spot.label}</h4>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                {spot.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BeforeAfterSlider = () => {
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

    return (
        <div 
            ref={containerRef}
            className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden cursor-ew-resize select-none shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 group"
            onMouseMove={(e) => isDragging.current && handleMove(e.clientX)}
            onMouseDown={() => isDragging.current = true}
            onMouseUp={() => isDragging.current = false}
            onMouseLeave={() => isDragging.current = false}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        >
            {/* AFTER Image (Base) */}
            <img 
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop" 
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
            />
            <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/20">
                Đã Hoàn Thiện
            </div>

            {/* BEFORE Image (Clipped) */}
            <div 
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img 
                    src="https://images.unsplash.com/photo-1588854337421-29a8119258eb?q=80&w=2000&auto=format&fit=crop"
                    className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125" // Grayscale for dramatic effect
                    draggable={false}
                />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold text-slate-900 uppercase tracking-widest shadow-lg">
                    Hiện Trạng Cũ
                </div>
            </div>

            {/* Slider Handle */}
            <div 
                className="absolute top-0 bottom-0 w-0.5 bg-white z-20 flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:w-1 transition-all"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl transform active:scale-95 transition-transform text-slate-900 border-4 border-slate-900/10">
                    <MoveHorizontal size={20} />
                </div>
            </div>
        </div>
    );
};

export default function ApplicationsPage() {
    const [activeSpaceIdx, setActiveSpaceIdx] = useState(0);
    const activeSpace = SPACES[activeSpaceIdx];

    return (
        <div className="bg-slate-950 font-sans text-slate-200 animate-fade-in">
            
            {/* 1. CINEMATIC HERO (Video Background Vibe) */}
            <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
                <div className="absolute inset-0 opacity-40">
                    <img 
                        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop" 
                        alt="Hero Architecture" 
                        className="w-full h-full object-cover animate-pan-slow"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-slate-950"></div>
                
                <div className="relative z-10 text-center max-w-5xl px-4 mt-20">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-amber-400 text-xs font-bold uppercase tracking-widest mb-8 animate-slide-up">
                        <Star size={12} fill="currentColor" /> Premium Wall Solutions
                    </div>
                    <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-8 leading-[1.1] tracking-tight animate-slide-up delay-100">
                        Nghệ Thuật <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-200">Biến Hóa Không Gian.</span>
                    </h1>
                    <p className="text-slate-300 text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 animate-slide-up delay-200 leading-relaxed">
                        Khám phá cách vật liệu Đại Nam Wall tái định nghĩa khái niệm sang trọng trong từng mét vuông ngôi nhà bạn.
                    </p>
                    
                    <div className="animate-slide-up delay-300">
                        <ChevronDown className="w-10 h-10 text-white/50 mx-auto animate-bounce" />
                    </div>
                </div>
            </section>

            {/* 2. INTERACTIVE SPACE NAVIGATOR (Sticky Layout) */}
            <section className="relative bg-slate-950 py-24 md:py-32">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                        
                        {/* LEFT: Content & Navigation (Sticky) */}
                        <div className="lg:col-span-4 lg:sticky lg:top-32 z-20">
                            <div className="mb-12">
                                <span className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-4 block">Interactive Tour</span>
                                <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                                    Giải Pháp <br/> Từng Phòng
                                </h2>
                                <p className="text-slate-400 text-lg font-light leading-relaxed">
                                    Chọn không gian để khám phá ứng dụng cụ thể của vật liệu.
                                </p>
                            </div>

                            {/* Nav Pills */}
                            <div className="flex flex-col gap-2">
                                {SPACES.map((space, idx) => (
                                    <button
                                        key={space.id}
                                        onClick={() => setActiveSpaceIdx(idx)}
                                        className={`group flex items-center justify-between p-5 rounded-2xl transition-all duration-500 border text-left ${
                                            activeSpaceIdx === idx 
                                            ? 'bg-white/10 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.1)]' 
                                            : 'bg-transparent border-white/5 hover:bg-white/5 text-slate-500 hover:text-white'
                                        }`}
                                    >
                                        <div>
                                            <span className={`text-xl font-bold block mb-1 transition-colors ${activeSpaceIdx === idx ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                                                {space.name}
                                            </span>
                                            {activeSpaceIdx === idx && (
                                                <span className="text-xs text-amber-400 font-medium animate-fade-in">
                                                    Đang xem chi tiết
                                                </span>
                                            )}
                                        </div>
                                        <ArrowRight size={20} className={`transition-all duration-300 ${activeSpaceIdx === idx ? 'text-amber-400 translate-x-0' : 'text-slate-600 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Visual Showcase (Dynamic) */}
                        <div className="lg:col-span-8 relative min-h-[600px] lg:h-[800px] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900">
                            {SPACES.map((space, idx) => (
                                <InteractiveSpace 
                                    key={space.id} 
                                    space={space} 
                                    isActive={activeSpaceIdx === idx} 
                                />
                            ))}

                            {/* Floating Info Card (Bottom Right) */}
                            <div className="absolute bottom-8 right-8 z-20 hidden md:block">
                                <div className="bg-slate-950/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl max-w-sm">
                                    <h3 className="text-xl font-bold text-white mb-2">{activeSpace.title}</h3>
                                    <p className="text-sm text-slate-400 mb-6">{activeSpace.description}</p>
                                    
                                    <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
                                        {activeSpace.stats.map((stat, i) => (
                                            <div key={i}>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                                                <p className="text-lg font-bold text-amber-400">{stat.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 3. BEFORE / AFTER (Dark Mode) */}
            <section className="py-32 bg-slate-900 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-900/20 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-amber-500 font-bold uppercase tracking-[0.2em] text-xs mb-4 block">Renovation Magic</span>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">Cải Tạo Thần Tốc</h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                            Chứng kiến sự lột xác ngoạn mục. Thi công trực tiếp trên tường cũ, không đập phá, không bụi bặm.
                        </p>
                    </div>

                    <BeforeAfterSlider />
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center">
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="w-12 h-12 mx-auto bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 mb-4">
                                <Clock size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">24 Giờ</h3>
                            <p className="text-slate-400 text-sm">Thời gian thi công hoàn thiện một căn phòng 30m2.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="w-12 h-12 mx-auto bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-4">
                                <Leaf size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Sạch Sẽ</h3>
                            <p className="text-slate-400 text-sm">Không bụi bặm, tiếng ồn thấp, có thể vào ở ngay sau khi làm xong.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="w-12 h-12 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500 mb-4">
                                <Droplets size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Chống Ẩm</h3>
                            <p className="text-slate-400 text-sm">Giải quyết triệt để tình trạng tường ẩm mốc, bong tróc sơn.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. COMMERCIAL SHOWCASE (Different Vibe) */}
            <section className="py-24 bg-white text-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">Không Gian Thương Mại</h2>
                            <p className="text-slate-500 text-lg max-w-xl">
                                Giải pháp vật liệu bền bỉ, tối ưu chi phí vận hành cho Khách sạn, Nhà hàng & Văn phòng.
                            </p>
                        </div>
                        <Link href="/projects" className="hidden md:flex items-center gap-2 font-bold text-brand-600 hover:underline underline-offset-4">
                            Xem dự án thực tế <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Hotel Card */}
                        <div className="group relative h-[500px] rounded-3xl overflow-hidden cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Hotel" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                            <div className="absolute bottom-8 left-8 text-white">
                                <h3 className="text-3xl font-serif font-bold mb-2">Hotel & Resort</h3>
                                <p className="text-slate-300 mb-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                    Sang trọng đẳng cấp với tấm ốp vân đá khổ lớn. Chịu được tần suất sử dụng cao.
                                </p>
                                <span className="inline-flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-widest">
                                    Khám phá <ArrowRight size={16} />
                                </span>
                            </div>
                        </div>

                        {/* Office Grid */}
                        <div className="grid grid-rows-2 gap-8 h-[500px]">
                            <div className="group relative rounded-3xl overflow-hidden cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Office" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h3 className="text-2xl font-bold">Văn Phòng</h3>
                                    <p className="text-xs text-slate-300 mt-1">Hiện đại, thi công nhanh, không gián đoạn công việc.</p>
                                </div>
                            </div>
                            <div className="group relative rounded-3xl overflow-hidden cursor-pointer">
                                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Restaurant" />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h3 className="text-2xl font-bold">F&B (Nhà Hàng/Cafe)</h3>
                                    <p className="text-xs text-slate-300 mt-1">Dễ dàng vệ sinh dầu mỡ, tạo điểm nhấn check-in.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. FINAL CTA */}
            <section className="py-24 bg-slate-950 text-center border-t border-white/10">
                <div className="max-w-4xl mx-auto px-4">
                    <Info size={48} className="mx-auto text-amber-500 mb-6" />
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Bạn Đã Có Ý Tưởng Cho Không Gian?</h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                        Đừng ngần ngại liên hệ với chúng tôi để được tư vấn giải pháp vật liệu phù hợp nhất và nhận bản vẽ phối cảnh 3D miễn phí.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link href="/contact">
                             <Button className="h-16 px-12 text-sm font-bold uppercase tracking-widest bg-amber-500 text-slate-900 hover:bg-white border-none shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                                Đăng Ký Tư Vấn Ngay
                             </Button>
                        </Link>
                        <Link href="/shop">
                             <Button variant="outline" className="h-16 px-12 text-sm font-bold uppercase tracking-widest border-slate-700 text-white hover:bg-white hover:text-slate-900 hover:border-white">
                                Xem Catalog Online
                             </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

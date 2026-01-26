
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
    ArrowRight, Calculator, CheckCircle2, ChevronRight, Download, HelpCircle, 
    Info, Layers, Package, PenTool, Ruler, Scissors, ShieldCheck, 
    Sparkles, UserCheck, Zap, Hammer, AlertCircle, ClipboardCheck, HardHat, ThumbsUp, Clock
} from 'lucide-react';
import { Button } from '@/components/common/UI';

// --- CONSTANTS ---
const TURNKEY_PACKAGES = [
    {
        id: 'standard',
        name: 'Tiêu Chuẩn',
        price: '350.000',
        unit: 'đ/m2',
        description: 'Giải pháp kinh tế, phù hợp cho cải tạo nhà cho thuê hoặc văn phòng cơ bản.',
        features: [
            'Tấm ốp Nano phẳng (dày 6mm)',
            'Khung xương trực tiếp (keo chuyên dụng)',
            'Phào chỉ PS cơ bản',
            'Bảo hành 5 năm'
        ],
        highlight: false,
        color: 'bg-white border-slate-200'
    },
    {
        id: 'premium',
        name: 'Cao Cấp',
        price: '550.000',
        unit: 'đ/m2',
        description: 'Lựa chọn phổ biến nhất. Đẹp sang trọng, bền bỉ cho căn hộ và nhà phố.',
        features: [
            'Tấm ốp Nano/Lam sóng (dày 9mm)',
            'Hệ khung xương sắt hộp (nếu cần)',
            'Phào chỉ Hàn Quốc cao cấp',
            'Nẹp Inox trang trí điểm nhấn',
            'Bảo hành 15 năm'
        ],
        highlight: true,
        color: 'bg-slate-900 text-white border-slate-900 ring-4 ring-slate-100 shadow-2xl'
    },
    {
        id: 'luxury',
        name: 'Thượng Hạng',
        price: '850.000',
        unit: 'đ/m2',
        description: 'Đẳng cấp 5 sao. Sử dụng vật liệu than tre uốn cong và đá xuyên sáng.',
        features: [
            'Tấm ốp Than tre / Đá xuyên sáng',
            'Thiết kế 3D độc bản (Bespoke)',
            'Uốn cong, tạo hình nghệ thuật',
            'Tích hợp đèn LED hắt sáng',
            'Bảo hành trọn đời'
        ],
        highlight: false,
        color: 'bg-white border-amber-200 bg-gradient-to-br from-amber-50 to-white'
    }
];

const ACCESSORIES = [
    { name: 'Keo dán chuyên dụng', price: '45.000đ/tuýp', img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=200&auto=format&fit=crop' },
    { name: 'Ke Inox', price: '1.000đ/chiếc', img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=200&auto=format&fit=crop' },
    { name: 'Phào cổ trần', price: '65.000đ/m', img: 'https://images.unsplash.com/photo-1620626012053-93f56b5463f0?q=80&w=200&auto=format&fit=crop' },
    { name: 'Nẹp kết thúc V', price: '35.000đ/m', img: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=200&auto=format&fit=crop' },
];

const CONSTRUCTION_STEPS = [
    {
        step: "01",
        title: "Khảo Sát & Tư Vấn",
        desc: "Kỹ thuật viên đến tận nơi đo đạc, mang mẫu thực tế và tư vấn giải pháp tối ưu chi phí.",
        icon: ClipboardCheck
    },
    {
        step: "02",
        title: "Báo Giá Chi Tiết",
        desc: "Lên bảng dự toán chính xác đến từng mét nẹp. Cam kết không phát sinh chi phí sau khi chốt.",
        icon: Calculator
    },
    {
        step: "03",
        title: "Ký Hợp Đồng",
        desc: "Rõ ràng về chủng loại vật tư, tiến độ thi công và điều khoản bảo hành.",
        icon: PenTool
    },
    {
        step: "04",
        title: "Thi Công Chuyên Nghiệp",
        desc: "Đội thợ tay nghề cao, thi công nhanh gọn, che chắn đồ đạc và dọn dẹp sạch sẽ.",
        icon: HardHat
    },
    {
        step: "05",
        title: "Nghiệm Thu & Bảo Hành",
        desc: "Khách hàng hài lòng mới thanh toán. Kích hoạt bảo hành điện tử 15 năm.",
        icon: ShieldCheck
    }
];

export default function PricingPage() {
    // Calculator State
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [waste, setWaste] = useState(10); // Default 10%
    const [estimatedCost, setEstimatedCost] = useState<{
        area: number,
        finalArea: number,
        material: number, 
        turnkey: number
    } | null>(null);

    const handleCalculate = () => {
        const w = parseFloat(width);
        const h = parseFloat(height);
        if (!w || !h) return;
        
        const area = w * h;
        const finalArea = area * (1 + waste / 100);
        
        // Mock prices: 
        // Material avg 145k/m2 * finalArea (khách phải mua dư để cắt)
        // Turnkey avg 550k/m2 * area (khách chỉ trả tiền mét vuông hoàn thiện trên tường)
        setEstimatedCost({
            area: area,
            finalArea: finalArea,
            material: finalArea * 145000, 
            turnkey: area * 550000   
        });
    };

    return (
        <div className="bg-white min-h-screen font-sans animate-fade-in">
            
            {/* 1. HERO & SMART ESTIMATOR */}
            <section className="bg-slate-50 pt-24 pb-20 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="text-brand-600 font-bold uppercase tracking-[0.2em] text-xs mb-4 block">
                            Minh Bạch & Rõ Ràng
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6">
                            Bảng Giá Niêm Yết 2024
                        </h1>
                        <p className="text-slate-500 text-lg">
                            Công cụ tính toán giúp bạn hình dung chi phí sơ bộ. Chúng tôi cam kết không có chi phí ẩn.
                        </p>
                    </div>

                    {/* SMART CALCULATOR CARD */}
                    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 via-brand-600 to-brand-400"></div>
                        <div className="p-8 md:p-10">
                            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
                                <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-600">
                                    <Calculator size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Dự Toán Nhanh Chi Phí</h3>
                                    <p className="text-xs text-slate-500">Nhập kích thước tường để xem giá ước tính chính xác tới 95%</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                {/* Inputs */}
                                <div className="lg:col-span-5 space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Chiều Rộng (m)</label>
                                            <input 
                                                type="number" 
                                                value={width} 
                                                onChange={(e) => setWidth(e.target.value)}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold text-slate-900 text-lg" 
                                                placeholder="VD: 4"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Chiều Cao (m)</label>
                                            <input 
                                                type="number" 
                                                value={height} 
                                                onChange={(e) => setHeight(e.target.value)}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold text-slate-900 text-lg" 
                                                placeholder="VD: 3"
                                            />
                                        </div>
                                    </div>

                                    {/* Waste Factor Selection */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <label className="text-xs font-bold uppercase text-slate-500">Độ hao hụt (Cắt ghép)</label>
                                            <div className="group relative">
                                                <HelpCircle size={14} className="text-slate-400 cursor-help"/>
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-lg hidden group-hover:block z-20 leading-relaxed text-center">
                                                    Hao hụt xảy ra khi cắt tấm ở góc tường, ổ điện hoặc cửa sổ. Mức trung bình là 10%.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[5, 10, 15].map((val) => (
                                                <button
                                                    key={val}
                                                    onClick={() => setWaste(val)}
                                                    className={`py-3 px-1 rounded-xl text-sm font-bold border transition-all ${
                                                        waste === val 
                                                        ? 'bg-brand-600 border-brand-600 text-white shadow-md' 
                                                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                                    }`}
                                                >
                                                    {val}% <span className={`text-[10px] font-normal block ${waste === val ? 'text-brand-100' : 'text-slate-400'}`}>{val === 5 ? 'Tường phẳng' : val === 10 ? 'Tiêu chuẩn' : 'Nhiều góc'}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <Button fullWidth onClick={handleCalculate} className="py-4 shadow-lg shadow-brand-500/30 text-base">
                                        Tính Toán Ngay
                                    </Button>
                                </div>

                                {/* Results Divider (Desktop) */}
                                <div className="hidden lg:flex lg:col-span-1 justify-center relative">
                                    <div className="absolute inset-y-0 w-px bg-slate-100"></div>
                                    <div className="relative top-1/2 -translate-y-1/2 bg-white p-2 rounded-full border border-slate-100 text-slate-300">
                                        <ArrowRight size={20} />
                                    </div>
                                </div>

                                {/* Results Display */}
                                <div className="lg:col-span-6">
                                    {estimatedCost ? (
                                        <div className="space-y-6 animate-fade-in h-full flex flex-col justify-center">
                                            
                                            {/* Option 1: DIY */}
                                            <div className="group relative p-5 bg-white rounded-2xl border border-slate-200 hover:border-brand-300 transition-all cursor-default">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 text-lg">Tự Mua Vật Tư</h4>
                                                        <p className="text-xs text-slate-500 mt-1">Dành cho thợ hoặc tự thi công</p>
                                                    </div>
                                                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Tiết kiệm</span>
                                                </div>
                                                <div className="flex justify-between items-end border-t border-dashed border-slate-100 pt-3 mt-3">
                                                    <div className="text-xs text-slate-500">
                                                        Diện tích mua: <strong>{estimatedCost.finalArea.toFixed(1)}m²</strong>
                                                        <br/>(Đã cộng {waste}% hao hụt)
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xs text-slate-400 block mb-1">Chi phí ước tính</span>
                                                        <span className="text-2xl font-bold text-slate-900">~{estimatedCost.material.toLocaleString('vi-VN')}đ</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Option 2: Turnkey */}
                                            <div className="group relative p-5 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
                                                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                                <div className="flex justify-between items-start mb-2 relative z-10">
                                                    <div>
                                                        <h4 className="font-bold text-white text-lg flex items-center gap-2">
                                                            Trọn Gói Thi Công <CheckCircle2 size={16} className="text-brand-400"/>
                                                        </h4>
                                                        <p className="text-xs text-slate-400 mt-1">Chìa khóa trao tay - Không lo phát sinh</p>
                                                    </div>
                                                    <span className="bg-brand-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide shadow-lg shadow-brand-500/40">Khuyên dùng</span>
                                                </div>
                                                <div className="flex justify-between items-end border-t border-white/10 pt-3 mt-3 relative z-10">
                                                    <div className="text-xs text-slate-400">
                                                        Diện tích nghiệm thu: <strong>{estimatedCost.area}m²</strong>
                                                        <br/>(Theo mặt tường thực tế)
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-xs text-brand-200/70 block mb-1">Chi phí trọn gói</span>
                                                        <span className="text-3xl font-bold text-amber-400">~{estimatedCost.turnkey.toLocaleString('vi-VN')}đ</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="text-[10px] text-center text-slate-400 italic">
                                                *Đơn giá trên chỉ là ước tính sơ bộ. Giá thực tế có thể thay đổi tùy thuộc vào điều kiện thi công (tường ẩm, đóng cốt) và loại vật liệu bạn chọn.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                                                <Info size={32} className="text-slate-300 opacity-80"/>
                                            </div>
                                            <p className="font-medium text-slate-500">Chưa có số liệu</p>
                                            <p className="text-sm max-w-xs mt-2">Vui lòng nhập chiều rộng và chiều cao tường để xem bảng so sánh chi phí.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. TURNKEY PACKAGES (SECTION 1) */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <span className="text-brand-600 font-bold uppercase tracking-[0.2em] text-xs mb-3 block">Dịch Vụ Nổi Bật</span>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
                                1. Báo Giá Thi Công Trọn Gói
                            </h2>
                            <p className="text-slate-500 mt-4 max-w-2xl text-lg">
                                Giải pháp tối ưu nhất cho khách hàng bận rộn. Chúng tôi lo từ A-Z: Khảo sát, Vật tư, Vận chuyển, Thi công và Dọn dẹp.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {TURNKEY_PACKAGES.map((pkg) => (
                            <div key={pkg.id} className={`relative flex flex-col rounded-3xl p-8 border transition-all duration-300 ${pkg.color} ${pkg.highlight ? 'scale-105 z-10' : 'hover:shadow-lg'}`}>
                                {pkg.highlight && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                                        Phổ biến nhất
                                    </div>
                                )}
                                <h3 className={`text-2xl font-serif font-bold mb-2 ${pkg.highlight ? 'text-white' : 'text-slate-900'}`}>{pkg.name}</h3>
                                <p className={`text-sm mb-6 min-h-[40px] ${pkg.highlight ? 'text-slate-300' : 'text-slate-500'}`}>{pkg.description}</p>
                                
                                <div className="mb-8 p-4 rounded-xl bg-opacity-10 bg-black/5">
                                    <p className={`text-xs uppercase font-bold tracking-wider mb-1 ${pkg.highlight ? 'text-slate-400' : 'text-slate-400'}`}>Đơn giá tham khảo</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-4xl font-bold ${pkg.highlight ? 'text-white' : 'text-slate-900'}`}>{pkg.price}</span>
                                        <span className={`text-sm font-medium ${pkg.highlight ? 'text-slate-400' : 'text-slate-500'}`}> {pkg.unit}</span>
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-8 flex-1">
                                    {pkg.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <CheckCircle2 size={18} className={`mt-0.5 shrink-0 ${pkg.highlight ? 'text-amber-400' : 'text-brand-600'}`} />
                                            <span className={`text-sm font-medium ${pkg.highlight ? 'text-slate-200' : 'text-slate-700'}`}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Link href="/contact">
                                    <Button fullWidth variant={pkg.highlight ? 'primary' : 'outline'} className={pkg.highlight ? 'bg-amber-500 hover:bg-amber-600 border-none text-white' : ''}>
                                        Đăng Ký Khảo Sát
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start">
                        <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
                        <p className="text-sm text-blue-800">
                            <strong>Lưu ý:</strong> Đơn giá trên áp dụng cho công trình diện tích {'>'} 20m2 tại nội thành Hà Nội. Với diện tích nhỏ hơn hoặc ở tỉnh xa, vui lòng liên hệ hotline để có báo giá chi tiết.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. CONSTRUCTION PROCESS STEPS */}
            <section className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-brand-600 font-bold uppercase tracking-[0.2em] text-xs mb-3 block">Professional Process</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
                            Quy Trình Thi Công 5 Bước
                        </h2>
                        <p className="text-slate-500 mt-4 text-lg">
                            Sự chuyên nghiệp tạo nên chất lượng. Chúng tôi tuân thủ quy trình nghiêm ngặt để đảm bảo công trình hoàn hảo nhất.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-100 -z-10"></div>

                        {CONSTRUCTION_STEPS.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center group">
                                <div className="w-24 h-24 bg-white rounded-full border-4 border-slate-50 flex items-center justify-center mb-6 group-hover:border-brand-100 group-hover:scale-110 transition-all duration-300 relative z-10 shadow-sm">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                                        <item.icon size={32} />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                                        {item.step}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-500 px-2">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. TRUST BADGES - COMMITMENT */}
            <section className="py-16 bg-slate-50 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                <ThumbsUp size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg mb-1">Cam Kết 3 KHÔNG</h4>
                                <p className="text-sm text-slate-600">Không bán thầu, không dùng vật tư kém chất lượng, không phát sinh chi phí vô lý.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg mb-1">Đúng Tiến Độ</h4>
                                <p className="text-sm text-slate-600">Thi công nhanh gọn, dọn dẹp sạch sẽ trong ngày. Bàn giao đúng hẹn 100%.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg mb-1">Bảo Hành Điện Tử</h4>
                                <p className="text-sm text-slate-600">Kích hoạt bảo hành qua số điện thoại. Bảo hành vật liệu 15 năm, thi công 2 năm.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. MATERIAL PRICE LIST (SECTION 2) */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <span className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs mb-3 block">Dành Cho Thợ / Tự Làm</span>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
                                2. Báo Giá Vật Tư Lẻ
                            </h2>
                            <p className="text-slate-500 mt-4 max-w-2xl text-lg">
                                Mua vật liệu chính hãng giá tại kho. Hỗ trợ hướng dẫn kỹ thuật thi công miễn phí.
                            </p>
                        </div>
                        <Link href="/shop" className="hidden md:flex items-center gap-2 text-brand-600 font-bold hover:underline">
                            Xem tất cả sản phẩm <ArrowRight size={16}/>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: 'Tấm Ốp Nano Phẳng', price: '135.000', unit: 'đ/m2', img: 'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?q=80&w=600' },
                            { name: 'Lam Sóng 3 Cao', price: '185.000', unit: 'đ/thanh', img: 'https://images.unsplash.com/photo-1620626012053-93f56b5463f0?q=80&w=600' },
                            { name: 'PVC Vân Đá', price: '320.000', unit: 'đ/tấm', img: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=600' },
                            { name: 'Tấm Ốp Than Tre', price: '450.000', unit: 'đ/m2', img: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=600' },
                        ].map((item, idx) => (
                            <div key={idx} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                                <div className="aspect-square relative overflow-hidden bg-gray-100">
                                    <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                                </div>
                                <div className="p-6">
                                    <h4 className="font-bold text-slate-900 mb-2 text-lg">{item.name}</h4>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <p className="text-brand-600 font-bold text-2xl">{item.price}</p>
                                        <span className="text-xs text-slate-400 font-medium">{item.unit}</span>
                                    </div>
                                    <Link href="/shop" className="flex items-center justify-center w-full py-3 rounded-xl bg-slate-50 text-slate-900 text-sm font-bold hover:bg-slate-900 hover:text-white transition-all group-hover:shadow-md">
                                        Xem Chi Tiết
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-12 text-center">
                        <Button variant="outline" className="gap-2 border-dashed border-slate-300 text-slate-600 hover:border-brand-500 hover:text-brand-600">
                            <Download size={18}/> Tải Catalog Báo Giá Đầy Đủ (PDF)
                        </Button>
                    </div>
                </div>
            </section>

            {/* 4. ACCESSORIES (SECTION 3) */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-slate-900">
                            3. Phụ Kiện Thi Công
                        </h2>
                        <p className="text-slate-500 mt-2 text-sm">
                            Các vật tư phụ cần thiết để hoàn thiện công trình đẹp và bền.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {ACCESSORIES.map((item, idx) => (
                            <div key={idx} className="flex gap-4 p-4 rounded-xl border border-slate-100 hover:border-brand-200 transition-colors bg-white">
                                <div className="w-16 h-16 bg-slate-50 rounded-lg overflow-hidden shrink-0">
                                    <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm mb-1">{item.name}</h4>
                                    <p className="text-brand-600 font-bold text-xs">{item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. FAQ */}
            <section className="bg-slate-50 py-20 border-t border-slate-200">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-serif font-bold text-slate-900 text-center mb-12">Câu Hỏi Thường Gặp</h2>
                    <div className="space-y-4">
                        {[
                            { q: "Giá trọn gói đã bao gồm vận chuyển chưa?", a: "Giá trọn gói đã bao gồm chi phí vận chuyển nội thành Hà Nội cho đơn hàng > 20m2. Các tỉnh lân cận sẽ có phụ phí nhỏ." },
                            { q: "Thời gian bảo hành là bao lâu?", a: "Chúng tôi bảo hành 15 năm cho chất lượng tấm ốp (không cong vênh, bay màu) và 2 năm cho kỹ thuật thi công." },
                            { q: "Nếu tường nhà tôi bị ẩm mốc nặng thì sao?", a: "Tấm ốp Nano và khung xương của Đại Nam Wall là giải pháp tuyệt vời để che phủ ẩm mốc. Chúng tôi sẽ xử lý chống thấm cơ bản trước khi ốp." }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                    <HelpCircle size={18} className="text-brand-500" /> {item.q}
                                </h4>
                                <p className="text-slate-500 text-sm ml-6">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. CTA */}
            <section className="py-24 bg-slate-900 text-center">
                <div className="max-w-4xl mx-auto px-4">
                    <Sparkles className="mx-auto text-amber-400 mb-6" size={40} />
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Bạn Vẫn Còn Phân Vân?</h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                        Đừng lo lắng. Hãy để chuyên gia kỹ thuật của chúng tôi đến tận nơi khảo sát và báo giá chính xác nhất cho công trình của bạn (Miễn phí).
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link href="/contact">
                             <Button className="h-14 px-10 text-sm font-bold uppercase tracking-widest bg-amber-500 text-slate-900 hover:bg-white border-none shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                                Đặt Lịch Khảo Sát
                             </Button>
                        </Link>
                        <a href="https://zalo.me/0912345678" target="_blank" rel="noreferrer">
                             <Button variant="outline" className="h-14 px-10 text-sm font-bold uppercase tracking-widest border-slate-700 text-white hover:bg-slate-800 hover:text-white hover:border-white">
                                Chat Zalo Tư Vấn
                             </Button>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

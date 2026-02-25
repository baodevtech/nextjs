'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
    ArrowRight, Calculator, CheckCircle2, HelpCircle, 
    Info, ShieldCheck, ClipboardCheck, HardHat, ThumbsUp, Clock, 
    Sparkles, Download, PenTool, Box, AlertCircle, LucideIcon,
    LayoutTemplate, Ruler, RotateCcw, MessageCircle
} from 'lucide-react';
import { Button } from '@/components/common/UI';
import { PricingPageData } from '@/types';

// 1. ICON MAPPING
const ICON_MAP: Record<string, LucideIcon> = {
    'clipboard': ClipboardCheck,
    'calculator': Calculator,
    'pen': PenTool,
    'hat': HardHat,
    'shield': ShieldCheck,
    'thumbsup': ThumbsUp,
    'clock': Clock,
    'default': Info
};

// 2. PACKAGE STYLES MAPPING
const PACKAGE_STYLES: Record<string, string> = {
    standard: 'bg-white border-slate-200',
    dark: 'bg-slate-900 border-slate-900 ring-4 ring-slate-100 shadow-2xl', 
    gold: 'bg-white border-amber-200 bg-gradient-to-br from-amber-50 to-white'
};

interface PricingClientProps {
    data: PricingPageData;
}

export default function PricingClient({ data }: PricingClientProps) {
    // --- STATE CALCULATOR ---
    const [inputMode, setInputMode] = useState<'direct_area' | 'room_dims'>('room_dims');
    const [directArea, setDirectArea] = useState('');
    const [roomL, setRoomL] = useState('');
    const [roomW, setRoomW] = useState('');
    const [roomH, setRoomH] = useState('');
    const [waste, setWaste] = useState(10);
    const [config, setConfig] = useState({
        wallFront: true, wallBack: true, wallLeft: true, wallRight: true, ceiling: true
    });
    
    const [result, setResult] = useState<{
        totalArea: number; pieces: number; materialCost: number; turnkeyCost: number;
    } | null>(null);

    // Preset
    const applyPreset = (type: 'full' | 'corner' | 'side' | 'partition') => {
        switch (type) {
            case 'full': setConfig({ wallFront: true, wallBack: true, wallLeft: true, wallRight: true, ceiling: true }); break;
            case 'corner': setConfig({ wallFront: true, wallBack: false, wallLeft: true, wallRight: false, ceiling: true }); break;
            case 'side': setConfig({ wallFront: true, wallBack: false, wallLeft: true, wallRight: true, ceiling: true }); break;
            case 'partition': setConfig({ wallFront: false, wallBack: false, wallLeft: false, wallRight: false, ceiling: false }); break;
        }
    };

    // Calculate Logic
    const handleCalculate = () => {
        if (!data.calculatorProduct) return;
        let totalArea = 0;

        if (inputMode === 'direct_area') {
            const area = parseFloat(directArea);
            if (!area || area <= 0) { alert("Vui lòng nhập diện tích hợp lệ."); return; }
            totalArea = area;
        } else {
            const l = parseFloat(roomL); const w = parseFloat(roomW); const h = parseFloat(roomH);
            if (!l || !w || !h) { alert("Vui lòng nhập đầy đủ Dài, Rộng, Cao."); return; }
            if (config.wallFront) totalArea += l * h;
            if (config.wallBack) totalArea += l * h;
            if (config.wallLeft) totalArea += w * h;
            if (config.wallRight) totalArea += w * h;
            if (config.ceiling) totalArea += l * w;
        }

        if (totalArea === 0) { alert("Vui lòng chọn ít nhất một mặt thi công."); return; }

        const pLen = data.calculatorProduct.dimensions?.length || 0;
        const pWid = data.calculatorProduct.dimensions?.width || 0;
        const pPrice = data.calculatorProduct.price?.amount || 0;
        const productAreaM2 = (pLen > 0 && pWid > 0) ? (pLen * pWid) / 1_000_000 : 0;

        if (productAreaM2 === 0) { alert("Sản phẩm mẫu thiếu kích thước trong Admin."); return; }

        const rawPieces = totalArea / productAreaM2;
        const wastePieces = rawPieces * (waste / 100);
        const totalPieces = Math.ceil(rawPieces + wastePieces);
        
        setResult({
            totalArea: totalArea, pieces: totalPieces,
            materialCost: totalPieces * pPrice, turnkeyCost: totalArea * data.basePriceTurnkey
        });
    };

    const formatCurrency = (amount: number) => 
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    return (
        <div className="bg-white min-h-screen font-sans animate-fade-in">
            {/* HERO SECTION */}
            <section className="bg-slate-50 pt-20 pb-16 md:pt-24 md:pb-20 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
                        <span className="text-brand-600 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-3 md:mb-4 block">
                            Công Cụ Dự Toán 4.0
                        </span>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 md:mb-6 leading-tight">
                            {data.heroTitle}
                        </h1>
                        <p className="text-slate-500 text-base md:text-lg">
                            {data.heroDesc}
                        </p>
                    </div>

                    {/* CALCULATOR UI */}
                    <div className="max-w-6xl mx-auto bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                        {/* Tabs */}
                        <div className="flex flex-col sm:flex-row border-b border-slate-100">
                            <button 
                                onClick={() => { setInputMode('room_dims'); setResult(null); }} 
                                className={`flex-1 py-3 md:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${inputMode === 'room_dims' ? 'bg-white text-brand-600 sm:border-b-2 border-brand-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                            >
                                <LayoutTemplate size={16} className="md:w-4 md:h-4 lg:w-5 lg:h-5"/> Tính Theo Kích Thước
                            </button>
                            <button 
                                onClick={() => { setInputMode('direct_area'); setResult(null); }} 
                                className={`flex-1 py-3 md:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${inputMode === 'direct_area' ? 'bg-white text-brand-600 sm:border-b-2 border-brand-600 border-t sm:border-t-0 border-slate-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border-t sm:border-t-0 border-slate-100'}`}
                            >
                                <Ruler size={16} className="md:w-4 md:h-4 lg:w-5 lg:h-5"/> Nhập Diện Tích (m²)
                            </button>
                        </div>

                        <div className="p-5 md:p-8 lg:p-10">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                                
                                {/* CỘT TRÁI: INPUT */}
                                <div className="lg:col-span-5 space-y-6">
                                    {inputMode === 'room_dims' && (
                                        <div className="space-y-6 animate-fade-in">
                                            <div className="grid grid-cols-3 gap-2 md:gap-3">
                                                <div>
                                                    <label className="text-[10px] md:text-xs font-bold uppercase text-slate-500 mb-1 block">Dài (m)</label>
                                                    <input type="number" value={roomL} onChange={(e) => setRoomL(e.target.value)} className="w-full px-2 py-2 md:px-3 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="5" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] md:text-xs font-bold uppercase text-slate-500 mb-1 block">Rộng (m)</label>
                                                    <input type="number" value={roomW} onChange={(e) => setRoomW(e.target.value)} className="w-full px-2 py-2 md:px-3 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="4" />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] md:text-xs font-bold uppercase text-slate-500 mb-1 block">Cao (m)</label>
                                                    <input type="number" value={roomH} onChange={(e) => setRoomH(e.target.value)} className="w-full px-2 py-2 md:px-3 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="3" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">Chọn Mẫu Phòng</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button onClick={() => applyPreset('full')} className="text-xs p-2 border border-slate-200 rounded-lg hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors text-left bg-white">
                                                        🏠 <strong>Phòng Độc Lập</strong><br/><span className="text-[9px] md:text-[10px] text-slate-400">4 Vách + 1 Trần</span>
                                                    </button>
                                                    <button onClick={() => applyPreset('corner')} className="text-xs p-2 border border-slate-200 rounded-lg hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors text-left bg-white">
                                                        📐 <strong>Góc Tường</strong><br/><span className="text-[9px] md:text-[10px] text-slate-400">Ốp 2 Vách + Trần</span>
                                                    </button>
                                                    <button onClick={() => applyPreset('side')} className="text-xs p-2 border border-slate-200 rounded-lg hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors text-left bg-white">
                                                        🧱 <strong>Dựa Tường</strong><br/><span className="text-[9px] md:text-[10px] text-slate-400">Ốp 3 Vách + Trần</span>
                                                    </button>
                                                    <button onClick={() => applyPreset('partition')} className="text-xs p-2 border border-slate-200 rounded-lg hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors text-left bg-white">
                                                        🛠️ <strong>Tùy Chọn</strong><br/><span className="text-[9px] md:text-[10px] text-slate-400">Tự chọn bên dưới</span>
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                <div className="flex justify-between items-center mb-3">
                                                    <label className="text-xs font-bold uppercase text-slate-500">Các mặt thi công</label>
                                                    <button onClick={() => setConfig({wallFront:false, wallBack:false, wallLeft:false, wallRight:false, ceiling:false})} className="text-[10px] flex items-center gap-1 text-brand-600 hover:underline">
                                                        <RotateCcw size={10}/> Reset
                                                    </button>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 cursor-pointer p-2 md:p-3 bg-white rounded-lg border border-slate-100 hover:border-brand-200">
                                                        <input type="checkbox" checked={config.ceiling} onChange={(e) => setConfig({...config, ceiling: e.target.checked})} className="rounded text-brand-600 focus:ring-brand-500"/>
                                                        <span className="text-xs md:text-sm font-bold text-slate-700">Trần nhà</span>
                                                        <span className="ml-auto text-[10px] md:text-xs text-slate-400">Dài x Rộng</span>
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-100 hover:border-brand-200">
                                                            <input type="checkbox" checked={config.wallFront} onChange={(e) => setConfig({...config, wallFront: e.target.checked})} className="rounded text-brand-600 focus:ring-brand-500"/>
                                                            <span className="text-xs md:text-sm text-slate-600">Vách Trước</span>
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-100 hover:border-brand-200">
                                                            <input type="checkbox" checked={config.wallBack} onChange={(e) => setConfig({...config, wallBack: e.target.checked})} className="rounded text-brand-600 focus:ring-brand-500"/>
                                                            <span className="text-xs md:text-sm text-slate-600">Vách Sau</span>
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-100 hover:border-brand-200">
                                                            <input type="checkbox" checked={config.wallLeft} onChange={(e) => setConfig({...config, wallLeft: e.target.checked})} className="rounded text-brand-600 focus:ring-brand-500"/>
                                                            <span className="text-xs md:text-sm text-slate-600">Vách Trái</span>
                                                        </label>
                                                        <label className="flex items-center gap-2 cursor-pointer p-2 bg-white rounded-lg border border-slate-100 hover:border-brand-200">
                                                            <input type="checkbox" checked={config.wallRight} onChange={(e) => setConfig({...config, wallRight: e.target.checked})} className="rounded text-brand-600 focus:ring-brand-500"/>
                                                            <span className="text-xs md:text-sm text-slate-600">Vách Phải</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {inputMode === 'direct_area' && (
                                        <div className="space-y-6 animate-fade-in py-4">
                                            <div>
                                                <label className="text-sm font-bold uppercase text-slate-500 mb-2 block">Tổng Diện Tích Cần Làm (m²)</label>
                                                <div className="relative">
                                                    <input type="number" value={directArea} onChange={(e) => setDirectArea(e.target.value)} className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-xl md:text-2xl focus:ring-2 focus:ring-brand-500 outline-none" placeholder="VD: 50" />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">m²</span>
                                                </div>
                                                <p className="text-[10px] md:text-xs text-slate-400 mt-2">*Dành cho khách hàng đã có số đo khảo sát hoặc bản vẽ.</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-slate-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-[10px] md:text-xs font-bold uppercase text-slate-500">Độ hao hụt (Cắt & Bo góc)</label>
                                            <div className="group relative">
                                                <HelpCircle size={14} className="text-slate-400 cursor-help"/>
                                                <div className="absolute bottom-full right-0 md:left-0 mb-2 w-56 md:w-64 bg-slate-800 text-white text-[10px] md:text-xs p-3 rounded shadow-xl hidden group-hover:block z-20 leading-relaxed">
                                                    Bù trừ cho phần vật liệu bị cắt bỏ tại các góc, ổ điện, cửa sổ và kỹ thuật uốn góc cong thẩm mỹ.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {[0, 5, 10, 15].map((val) => (
                                                <button key={val} onClick={() => setWaste(val)} className={`py-2 px-1 rounded-lg text-xs md:text-sm font-bold border transition-all ${waste === val ? 'bg-brand-600 border-brand-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:border-brand-300'}`}>
                                                    {val}%
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <Button fullWidth onClick={handleCalculate} className="py-3 md:py-4 shadow-lg shadow-brand-500/30 text-sm md:text-base mt-2">
                                        Tính Toán Ngay
                                    </Button>

                                    {data.calculatorProduct && (
                                        <div className="mt-4 pt-4 border-t border-slate-100">
                                            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase mb-2">Đơn giá áp dụng theo sản phẩm:</p>
                                            <Link href={`/product/${data.calculatorProduct.slug}`} className="flex flex-row md:flex-row gap-3 items-center p-3 md:p-4 bg-white rounded-xl border border-slate-200 hover:border-brand-400 hover:shadow-md transition-all group">
                                                <img src={data.calculatorProduct.image?.sourceUrl} className="w-10 h-10 md:w-12 md:h-12 rounded object-cover shrink-0" alt={data.calculatorProduct.name} />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-xs md:text-sm font-bold text-slate-900 truncate group-hover:text-brand-600 transition-colors">{data.calculatorProduct.name}</h4>
                                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] md:text-xs mt-1">
                                                        <span className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">{data.calculatorProduct.dimensions?.length}x{data.calculatorProduct.dimensions?.width}mm</span>
                                                        <span className="text-brand-600 font-bold">{formatCurrency(data.calculatorProduct.price?.amount || 0)}/tấm</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                {/* DIVIDER GIAO DIỆN DESKTOP */}
                                <div className="hidden lg:block lg:col-span-1 border-r border-slate-100 relative">
                                    <div className="absolute top-1/2 -right-3 bg-white border border-slate-100 p-1.5 rounded-full text-slate-300">
                                        <ArrowRight size={16}/>
                                    </div>
                                </div>

                                {/* DIVIDER GIAO DIỆN MOBILE */}
                                <div className="block lg:hidden w-full h-px bg-slate-100 relative my-2">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-slate-100 p-1.5 rounded-full text-slate-300">
                                        <ArrowRight size={14} className="rotate-90" />
                                    </div>
                                </div>

                                {/* CỘT PHẢI: KẾT QUẢ */}
                                <div className="lg:col-span-6">
                                    {result ? (
                                        <div className="h-full flex flex-col gap-4 md:gap-6 animate-fade-in">
                                            {/* Box Giá */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                                <div className="p-4 md:p-5 bg-white rounded-2xl border border-brand-100 shadow-sm relative overflow-hidden">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase">Tự Mua Vật Tư</p>
                                                            <h4 className="text-xl md:text-2xl font-bold text-slate-900 mt-1">{formatCurrency(result.materialCost)}</h4>
                                                        </div>
                                                        <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center">
                                                            <Box size={16} className="md:w-5 md:h-5"/>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 md:mt-4 pt-3 border-t border-dashed border-slate-100 flex justify-between text-[10px] md:text-xs text-slate-600">
                                                        <span>Số lượng: <strong>{result.pieces} tấm</strong></span>
                                                    </div>
                                                </div>
                                                <div className="p-4 md:p-5 bg-slate-900 rounded-2xl shadow-lg relative overflow-hidden text-white">
                                                    <div className="absolute top-0 right-0 w-20 h-20 bg-brand-500/20 rounded-full blur-xl -mr-5 -mt-5"></div>
                                                    <div className="flex justify-between items-start relative z-10">
                                                        <div>
                                                            <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase flex items-center gap-1">Trọn Gói <CheckCircle2 size={12}/></p>
                                                            <h4 className="text-xl md:text-2xl font-bold text-amber-400 mt-1">~{formatCurrency(result.turnkeyCost)}</h4>
                                                        </div>
                                                        <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 bg-white/10 text-white rounded-full flex items-center justify-center">
                                                            <HardHat size={16} className="md:w-5 md:h-5"/>
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 md:mt-4 pt-3 border-t border-white/10 flex justify-between text-[10px] md:text-xs text-slate-300 relative z-10">
                                                        <span>Nghiệm thu: <strong>{result.totalArea.toFixed(2)} m²</strong></span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Zalo Banner */}
                                            <div className="p-3 md:p-4 bg-brand-50 rounded-xl border border-brand-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                                <div>
                                                    <p className="text-xs md:text-sm font-bold text-brand-800">Cần tư vấn kỹ thuật?</p>
                                                    <p className="text-[10px] md:text-xs text-brand-600 mt-0.5">Gửi kích thước để nhận bản vẽ miễn phí</p>
                                                </div>
                                                <a href="https://zalo.me/0912345678" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                                                    <Button className="w-full sm:w-auto bg-brand-600 hover:bg-brand-700 text-white text-xs gap-2 px-4 py-2">
                                                        <MessageCircle size={14}/> Chat Zalo
                                                    </Button>
                                                </a>
                                            </div>

                                            {/* Bảng phân tích chi tiết */}
                                            <div className="bg-slate-50 rounded-2xl p-4 md:p-5 border border-slate-200 flex-1">
                                                <h5 className="font-bold text-slate-900 text-xs md:text-sm mb-3 md:mb-4 flex items-center gap-2">
                                                    <Calculator size={16} className="text-brand-500"/> Chi Tiết Cách Tính
                                                </h5>
                                                <div className="space-y-2 text-xs md:text-sm">
                                                    {inputMode === 'room_dims' ? (
                                                        <>
                                                            <div className="flex justify-between text-slate-500 pb-2 border-b border-dashed border-slate-200">
                                                                <span>Kích thước</span>
                                                                <span className="font-medium">{roomL}m x {roomW}m x {roomH}m</span>
                                                            </div>
                                                            {config.ceiling && <div className="flex justify-between pl-2 border-l-2 border-brand-200 text-[10px] md:text-xs"><span>+ Trần</span> <span>{(parseFloat(roomL)*parseFloat(roomW)).toFixed(2)} m²</span></div>}
                                                            {config.wallFront && <div className="flex justify-between pl-2 border-l-2 border-slate-200 text-[10px] md:text-xs"><span>+ Vách trước</span> <span>{(parseFloat(roomL)*parseFloat(roomH)).toFixed(2)} m²</span></div>}
                                                            {config.wallBack && <div className="flex justify-between pl-2 border-l-2 border-slate-200 text-[10px] md:text-xs"><span>+ Vách sau</span> <span>{(parseFloat(roomL)*parseFloat(roomH)).toFixed(2)} m²</span></div>}
                                                            {config.wallLeft && <div className="flex justify-between pl-2 border-l-2 border-slate-200 text-[10px] md:text-xs"><span>+ Vách trái</span> <span>{(parseFloat(roomW)*parseFloat(roomH)).toFixed(2)} m²</span></div>}
                                                            {config.wallRight && <div className="flex justify-between pl-2 border-l-2 border-slate-200 text-[10px] md:text-xs"><span>+ Vách phải</span> <span>{(parseFloat(roomW)*parseFloat(roomH)).toFixed(2)} m²</span></div>}
                                                            <div className="border-t border-slate-200 my-2"></div>
                                                        </>
                                                    ) : (
                                                        <div className="flex justify-between text-slate-500 pb-2 border-b border-dashed border-slate-200">
                                                            <span>Diện tích nhập vào</span>
                                                            <span className="font-bold text-slate-900">{result.totalArea.toFixed(2)} m²</span>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="flex justify-between items-center py-1">
                                                        <span className="text-slate-600">Tổng diện tích</span>
                                                        <span className="font-bold text-slate-900">{result.totalArea.toFixed(2)} m²</span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-1 text-[10px] md:text-xs text-slate-500">
                                                        <span>Diện tích 1 tấm</span>
                                                        <span>{((data.calculatorProduct?.dimensions?.length||0) * (data.calculatorProduct?.dimensions?.width||0)/1000000).toFixed(3)} m²</span>
                                                    </div>
                                                    <div className="flex justify-between items-center py-1 mt-1 text-amber-600 bg-amber-50 px-2 rounded">
                                                        <span>Hao hụt & Cắt góc ({waste}%)</span>
                                                        <span>+ {Math.ceil((result.totalArea / ((data.calculatorProduct?.dimensions?.length||0) * (data.calculatorProduct?.dimensions?.width||0)/1000000)) * (waste/100))} tấm</span>
                                                    </div>
                                                    <div className="flex justify-between items-center font-bold text-brand-600 text-base md:text-lg pt-3 border-t border-slate-200 mt-2">
                                                        <span>Tổng số lượng</span>
                                                        <span>{result.pieces} Tấm</span>
                                                    </div>
                                                </div>

                                                <div className="mt-4 p-2 md:p-3 bg-blue-50 rounded-lg text-[10px] md:text-xs text-blue-700 flex gap-2">
                                                    <AlertCircle size={14} className="shrink-0 mt-0.5"/>
                                                    <p>
                                                        <strong>Công thức:</strong> (Tổng diện tích / Diện tích tấm) + {waste}% hao hụt.<br/>
                                                        Số lượng được <strong>làm tròn lên</strong> đơn vị tấm nguyên để đảm bảo đủ vật tư.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-center text-slate-400 p-6 md:py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                            <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center mb-3 md:mb-4 shadow-sm">
                                                <Info size={24} className="text-slate-300 opacity-80 md:w-8 md:h-8"/>
                                            </div>
                                            <p className="font-medium text-slate-500 text-sm md:text-base">Chưa có số liệu</p>
                                            <p className="text-xs md:text-sm max-w-xs mt-1 md:mt-2">
                                                {inputMode === 'direct_area' ? 'Vui lòng nhập tổng diện tích m² cần thi công.' : 'Nhập kích thước phòng và chọn các mặt cần thi công.'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. TURNKEY PACKAGES */}
            <section className="py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 md:mb-12 text-center md:text-left">
                        <span className="text-brand-600 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-2 md:mb-3 block">Dịch Vụ Nổi Bật</span>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900">{data.pkgHeading}</h2>
                        <p className="text-slate-500 mt-3 md:mt-4 max-w-2xl text-sm md:text-lg mx-auto md:mx-0">{data.pkgDesc}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {data.turnkeyPackages.map((pkg, idx) => {
                            const safeStyle = String(pkg.styleType || 'standard').toLowerCase().trim();
                            const isDark = safeStyle === 'dark';
                            const cardClasses = PACKAGE_STYLES[safeStyle] || PACKAGE_STYLES.standard;

                            return (
                                <div 
                                    key={idx} 
                                    className={`relative flex flex-col rounded-2xl md:rounded-3xl p-6 md:p-8 border transition-all duration-300 ${cardClasses} ${pkg.isPopular ? 'scale-100 md:scale-105 z-10' : 'hover:shadow-lg'}`}
                                >
                                    {pkg.isPopular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] md:text-xs font-bold px-3 py-1 md:px-4 md:py-1.5 rounded-full uppercase tracking-widest shadow-lg whitespace-nowrap">Phổ biến nhất</div>}
                                    
                                    <h3 className={`text-xl md:text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{pkg.name}</h3>
                                    
                                    <p className={`text-xs md:text-sm mb-5 md:mb-6 min-h-[40px] ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>{pkg.description}</p>
                                    
                                    <div className="mb-6 md:mb-8 p-3 md:p-4 rounded-xl bg-opacity-10 bg-black/5">
                                        <p className={`text-[10px] md:text-xs uppercase font-bold tracking-wider mb-1 opacity-70 ${isDark ? 'text-white' : 'text-slate-900'}`}>Đơn giá tham khảo</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{pkg.price}</span>
                                            <span className={`text-xs md:text-sm font-medium opacity-70 ${isDark ? 'text-white' : 'text-slate-900'}`}> {pkg.unit}</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8 flex-1">
                                        {pkg.features.map((feature, fIdx) => (
                                            <li key={fIdx} className="flex items-start gap-2 md:gap-3">
                                                <CheckCircle2 size={16} className={`mt-0.5 md:mt-1 shrink-0 ${pkg.isPopular ? 'text-amber-400' : 'text-brand-600'} md:w-[18px] md:h-[18px]`} />
                                                <span className={`text-xs md:text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Link href="/contact" className="mt-auto">
                                        <Button fullWidth variant={pkg.isPopular ? 'primary' : 'outline'} className={`py-3 md:py-4 text-xs md:text-sm ${pkg.isPopular ? 'bg-amber-500 hover:bg-amber-600 border-none text-white' : (isDark ? 'text-white border-white hover:bg-white hover:text-slate-900' : '')}`}>
                                            Đăng Ký Khảo Sát
                                        </Button>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="mt-6 md:mt-8 bg-blue-50 p-3 md:p-4 rounded-xl border border-blue-100 flex gap-2 md:gap-3 items-start">
                        <Info className="text-blue-500 shrink-0 mt-0.5 w-4 h-4 md:w-[18px] md:h-[18px]" />
                        <p className="text-xs md:text-sm text-blue-800">
                            <strong>Lưu ý:</strong> Đơn giá trên áp dụng cho công trình diện tích {'>'} 20m² tại nội thành Hà Nội. Với diện tích nhỏ hơn hoặc ở tỉnh xa, vui lòng liên hệ hotline để có báo giá chi tiết.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. CONSTRUCTION PROCESS STEPS */}
           <section className="py-16 md:py-24 bg-white border-t border-slate-100 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
                        <span className="text-brand-600 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-2 md:mb-3 block">Professional Process</span>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900">{data.stepsHeading}</h2>
                        <p className="text-slate-500 mt-3 md:mt-4 text-sm md:text-lg">{data.stepsDesc}</p>
                    </div>

                    {/* Khung chứa Quy Trình */}
                    <div className="relative max-w-md mx-auto md:max-w-none">
                        {/* Đường kẻ ngang (Chỉ hiện trên Desktop) */}
                        <div className="hidden md:block absolute top-10 lg:top-12 left-[10%] right-[10%] h-0.5 bg-slate-100 -z-10"></div>
                        
                        {/* Đường kẻ dọc Timeline (Chỉ hiện trên Mobile) */}
                        {/* Vị trí left-6 tương ứng đúng tâm của vòng tròn w-12 (24px) */}
                        <div className="block md:hidden absolute top-4 bottom-4 left-6 sm:left-8 w-0.5 bg-slate-100 -z-10"></div>

                        <div className="flex flex-col md:grid md:grid-cols-5 gap-8 md:gap-4 relative">
                            {data.constructionSteps.map((item, idx) => {
                                const IconComp = ICON_MAP[item.icon] || Info;
                                return (
                                    <div key={idx} className="flex flex-row md:flex-col items-start md:items-center text-left md:text-center group relative">
                                        
                                        {/* Icon & Số thứ tự */}
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white rounded-full border-4 border-slate-50 flex items-center justify-center shrink-0 md:mb-4 lg:mb-6 group-hover:border-brand-100 md:group-hover:scale-110 transition-all duration-300 relative z-10 shadow-sm md:mx-auto">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 lg:w-20 lg:h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                                                <IconComp size={24} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8" />
                                            </div>
                                            <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 bg-slate-900 rounded-full flex items-center justify-center text-white text-[9px] lg:text-xs font-bold border-2 border-white">
                                                {item.step}
                                            </div>
                                        </div>
                                        
                                        {/* Nội dung text */}
                                        <div className="ml-4 sm:ml-6 md:ml-0 mt-1 md:mt-0 flex-1">
                                            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 mb-1 lg:mb-2">{item.title}</h3>
                                            <p className="text-[11px] sm:text-xs lg:text-sm text-slate-500 md:px-2 leading-relaxed">{item.desc}</p>
                                        </div>
                                        
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. TRUST BADGES - COMMITMENT */}
            <section className="py-12 md:py-16 bg-slate-50 border-y border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                        {data.commitments.map((item, idx) => {
                            const IconComp = ICON_MAP[item.icon] || ThumbsUp;
                            const bgColors = ['bg-green-100 text-green-600', 'bg-blue-100 text-blue-600', 'bg-amber-100 text-amber-600'];
                            const colorClass = bgColors[idx % 3];

                            return (
                                <div key={idx} className="flex gap-3 md:gap-4 items-start bg-white p-4 md:p-0 md:bg-transparent rounded-xl md:rounded-none shadow-sm md:shadow-none">
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                                        <IconComp size={20} className="md:w-6 md:h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm md:text-lg mb-1">{item.title}</h4>
                                        <p className="text-xs md:text-sm text-slate-600">{item.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* 5. MATERIALS LIST FOR DIY/WORKERS */}
            <section className="py-16 md:py-24 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12">
                        <div className="mb-4 md:mb-0">
                            <span className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-2 md:mb-3 block">Dành Cho Thợ / Tự Làm</span>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900">{data.materialsHeading}</h2>
                            <p className="text-slate-500 mt-2 md:mt-4 max-w-2xl text-sm md:text-lg">{data.materialsDesc}</p>
                        </div>
                        <Link href="/shop" className="inline-flex items-center gap-2 text-brand-600 font-bold hover:underline text-sm md:text-base">
                            Xem tất cả sản phẩm <ArrowRight size={16}/>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {data.materialItems.map((item, idx) => (
                            <div key={idx} className="group bg-white rounded-xl md:rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                                <div className="aspect-square relative overflow-hidden bg-gray-100">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                                </div>
                                <div className="p-4 md:p-6">
                                    <h4 className="font-bold text-slate-900 mb-1 md:mb-2 text-sm md:text-lg line-clamp-2 md:line-clamp-1">{item.name}</h4>
                                    <div className="flex flex-wrap items-baseline gap-1 mb-3 md:mb-4">
                                        <p className="text-brand-600 font-bold text-lg md:text-2xl">{item.price}</p>
                                        <span className="text-[10px] md:text-xs text-slate-400 font-medium">{item.unit}</span>
                                    </div>
                                    <Link href={item.link} className="flex items-center justify-center w-full py-2.5 md:py-3 rounded-lg md:rounded-xl bg-slate-50 text-slate-900 text-xs md:text-sm font-bold hover:bg-slate-900 hover:text-white transition-all group-hover:shadow-md">
                                        Xem Chi Tiết
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. ACCESSORIES */}
            <section className="py-12 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 md:mb-12">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900">{data.accHeading}</h2>
                        <p className="text-slate-500 mt-1 md:mt-2 text-xs md:text-sm">{data.accDesc}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {data.accessoryItems.map((item, idx) => (
                            <div key={idx} className="flex gap-3 md:gap-4 p-3 md:p-4 rounded-xl border border-slate-100 hover:border-brand-200 transition-colors bg-white">
                                <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-50 rounded-lg overflow-hidden shrink-0">
                                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-900 text-xs md:text-sm mb-1 line-clamp-2">{item.name}</h4>
                                    <p className="text-brand-600 font-bold text-xs">{item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. FAQs */}
            <section className="bg-slate-50 py-16 md:py-20 border-t border-slate-200">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-8 md:mb-12">Câu Hỏi Thường Gặp</h2>
                    <div className="space-y-3 md:space-y-4">
                        {data.faqs.map((item, idx) => (
                            <div key={idx} className="bg-white p-5 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-slate-100">
                                <h4 className="font-bold text-slate-900 mb-2 flex items-start gap-2 text-sm md:text-base">
                                    <HelpCircle size={18} className="text-brand-500 shrink-0 mt-0.5" /> 
                                    {item.question}
                                </h4>
                                <p className="text-slate-500 text-xs md:text-sm ml-6 md:ml-[26px]">{item.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. CTA SECTION */}
            <section className="py-16 md:py-24 bg-slate-900 text-center">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <Sparkles className="mx-auto text-amber-400 mb-4 md:mb-6 w-8 h-8 md:w-10 md:h-10" />
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">{data.ctaHeading}</h2>
                    <p className="text-slate-400 text-sm md:text-lg mb-8 md:mb-10 max-w-2xl mx-auto px-2">{data.ctaDesc}</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
                        <Link href="/contact" className="w-full sm:w-auto">
                            <Button className="w-full h-12 md:h-14 px-8 md:px-10 text-xs md:text-sm font-bold uppercase tracking-widest bg-amber-500 text-slate-900 hover:bg-white border-none shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                                Đặt Lịch Khảo Sát
                            </Button>
                        </Link>
                        <a href="https://zalo.me/0912345678" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full h-12 md:h-14 px-8 md:px-10 text-xs md:text-sm font-bold uppercase tracking-widest border-slate-700 text-white hover:bg-slate-800 hover:text-white hover:border-white">
                                Chat Zalo Tư Vấn
                            </Button>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}
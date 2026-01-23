import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, Sparkles, Ruler, Star, ShoppingCart, Eye, Heart, Layers, Hash, Tag } from 'lucide-react';
import { Product } from '../../types';
import { Button } from '../common/UI';
import { askProductQuestion } from '../../services/geminiService';

// --- MODERN PREMIUM PRODUCT CARD ---
export const ProductCard: React.FC<{ product: Product, onQuickAdd?: () => void }> = ({ product, onQuickAdd }) => {
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-brand-200 flex flex-col h-full">
      {/* 1. Image Area */}
      <div className="relative aspect-[4/4] overflow-hidden bg-gray-50 flex-shrink-0">
        <Link to={`/product/${product.slug}`}>
            <img 
            src={product.image.sourceUrl} 
            alt={product.image.altText} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.stockStatus === 'OUT_OF_STOCK' && (
                <span className="px-2 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wide rounded">Hết hàng</span>
            )}
            {product.price.amount > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wide rounded">-10%</span>
            )}
        </div>

        {/* Hover Actions (Desktop) */}
        <div className="absolute bottom-3 left-3 right-3 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
            <button 
                onClick={(e) => { e.preventDefault(); onQuickAdd?.(); }}
                className="flex-1 bg-slate-900 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-brand-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
                <ShoppingCart size={14} /> Thêm Nhanh
            </button>
            <Link 
                to={`/product/${product.slug}`}
                className="w-10 bg-white text-slate-900 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg border border-gray-100"
                title="Xem chi tiết"
            >
                <Eye size={16} />
            </Link>
        </div>
      </div>
      
      {/* 2. Info Area */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Rating */}
        <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{product.categories[0]}</span>
            <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                    <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                ))}
            </div>
        </div>

        {/* Brand */}
        {product.brand && (
           <div className="text-[10px] text-brand-600 font-extrabold uppercase tracking-widest mb-1 flex items-center gap-1">
             <Tag size={8} /> {product.brand}
           </div>
        )}

        <Link to={`/product/${product.slug}`} className="block mb-2">
            <h3 className="text-sm font-bold text-slate-800 line-clamp-2 min-h-[40px] group-hover:text-brand-600 transition-colors">
            {product.name}
            </h3>
        </Link>

        {/* --- SKU & STOCK STATUS ROW --- */}
        <div className="flex items-center justify-between mb-3 border-b border-dashed border-gray-100 pb-2">
            <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
               <Hash size={10} className="text-slate-400"/>
               <span className="text-[10px] font-mono font-medium">{product.sku}</span>
            </div>

            <div className={`flex items-center gap-1.5 text-[10px] font-bold ${product.stockStatus === 'IN_STOCK' ? 'text-green-600' : 'text-orange-600'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${product.stockStatus === 'IN_STOCK' ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></span>
                {product.stockStatus === 'IN_STOCK' ? 'Sẵn kho HN' : 'Đặt trước'}
            </div>
        </div>

        {/* --- SPECS INFO (Kích thước) --- */}
        {(product.dimensions.length > 0 || product.dimensions.width > 0) && (
          <div className="flex flex-wrap gap-1.5 mb-3">
             <div className="inline-flex items-center px-2 py-1 rounded bg-slate-50 border border-slate-100 text-[10px] font-medium text-slate-600" title="Kích thước (Rộng x Dài)">
                <Ruler size={10} className="mr-1 text-slate-400"/>
                {product.dimensions.width} x {product.dimensions.length}mm
             </div>
             {product.dimensions.thickness > 0 && (
               <div className="inline-flex items-center px-2 py-1 rounded bg-slate-50 border border-slate-100 text-[10px] font-medium text-slate-600" title="Độ dày">
                  <Layers size={10} className="mr-1 text-slate-400"/>
                  Dày {product.dimensions.thickness}mm
               </div>
             )}
          </div>
        )}
        
        <div className="flex items-baseline gap-2 mt-auto pt-2 border-t border-gray-50">
           {product.price.amount === 0 ? (
               <span className="text-sm font-bold text-brand-600">Liên hệ báo giá</span>
           ) : (
               <>
                <span className="text-base font-bold text-slate-900">{product.price.formatted}</span>
                <span className="text-xs text-slate-400 line-through">{(product.price.amount * 1.1).toLocaleString('vi-VN')}₫</span>
               </>
           )}
        </div>
      </div>
    </div>
  );
};

// --- CALCULATOR ---
export const MaterialCalculator: React.FC<{ product: Product, onAdd: (qty: number) => void }> = ({ product, onAdd }) => {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [result, setResult] = useState<{ boxes: number, waste: number } | null>(null);

  const calculate = () => {
    if (width <= 0 || height <= 0 || product.dimensions.area === 0) return;
    const wallArea = width * height;
    const panelArea = product.dimensions.area;
    const withWaste = (wallArea / panelArea) * 1.1; 
    const finalCount = Math.ceil(withWaste);
    setResult({ boxes: finalCount, waste: parseFloat(((finalCount * panelArea - wallArea)).toFixed(2)) });
  };

  return (
    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Calculator size={18} className="text-brand-600"/>
        <h3 className="font-bold text-slate-900 text-sm">Tính Số Lượng Tấm</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <input type="number" onChange={(e) => setWidth(parseFloat(e.target.value))} className="border-gray-200 rounded-lg text-sm" placeholder="Rộng (m)" />
        <input type="number" onChange={(e) => setHeight(parseFloat(e.target.value))} className="border-gray-200 rounded-lg text-sm" placeholder="Cao (m)" />
      </div>
      <Button onClick={calculate} variant="secondary" fullWidth className="py-2 text-xs">Tính Toán</Button>
      {result && (
        <div className="mt-3 bg-white p-3 rounded-lg border border-green-200 flex justify-between items-center animate-fade-in">
           <span className="text-sm font-bold text-slate-700">Cần: {result.boxes} tấm</span>
           <button onClick={() => onAdd(result.boxes)} className="text-xs font-bold text-brand-600 hover:underline">Thêm vào giỏ</button>
        </div>
      )}
    </div>
  );
};

// --- AI ASSISTANT ---
export const AIAssistant: React.FC<{ product: Product }> = ({ product }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    setLoading(true);
    const res = await askProductQuestion(product, question);
    setAnswer(res);
    setLoading(false);
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-indigo-500" />
            <h3 className="font-bold text-slate-900 text-sm">Tư Vấn AI</h3>
        </div>
        <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100">
             <div className="min-h-[60px] text-sm text-slate-600 mb-3">
                {answer || "Hỏi tôi bất cứ điều gì về sản phẩm này..."}
             </div>
             <form onSubmit={handleAsk} className="relative">
                <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ví dụ: Loại này có chịu nước không?"
                className="w-full pr-10 py-2 pl-3 bg-white border-transparent focus:border-indigo-500 rounded-lg text-sm shadow-sm"
                />
                <button type="submit" disabled={loading} className="absolute right-1 top-1 p-1.5 text-indigo-600 hover:bg-indigo-50 rounded">
                   <ArrowRight size={16} />
                </button>
             </form>
        </div>
    </div>
  );
};
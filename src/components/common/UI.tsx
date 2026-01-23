'use client';

import React from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CartItem } from '@/types';

// --- BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', fullWidth = false, className = '', ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    primary: "border border-transparent text-white bg-brand-600 hover:bg-brand-700 focus:ring-brand-500 shadow-sm hover:shadow",
    secondary: "border border-transparent text-brand-900 bg-brand-100 hover:bg-brand-200 focus:ring-brand-500",
    outline: "border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 focus:ring-slate-500 hover:border-slate-900",
    ghost: "text-brand-600 hover:bg-brand-50 hover:text-brand-700"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- CART DRAWER ---
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  total: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cart, onRemove, onUpdateQty, total }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-transform animate-slide-in-right">
        <div className="p-5 flex items-center justify-between border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-brand-600" />
            <h2 className="text-lg font-bold text-slate-800">Giỏ Hàng ({cart.length})</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50">
          {cart.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <ShoppingBag size={64} className="mx-auto mb-4 opacity-20" />
              <p className="text-gray-500 font-medium">Giỏ hàng đang trống</p>
              <Button variant="ghost" onClick={onClose} className="mt-2">Tiếp tục xem mẫu</Button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                  <img src={item.image.sourceUrl} alt={item.image.altText} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-semibold text-slate-800 line-clamp-2">{item.name}</h3>
                      <p className="text-sm font-bold text-brand-600 ml-2">
                          {item.price.amount > 0 ? item.price.formatted : 'Liên hệ'}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">KT: {item.dimensions.width} x {item.dimensions.length} mm</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                      <button 
                        onClick={() => onUpdateQty(item.id, -1)}
                        className="p-1.5 hover:bg-white rounded-l-lg text-gray-500 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-xs font-bold w-8 text-center bg-white h-full flex items-center justify-center border-x border-gray-200">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQty(item.id, 1)}
                        className="p-1.5 hover:bg-white rounded-r-lg text-gray-500 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Xóa"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t border-gray-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between text-base font-bold text-slate-900 mb-2">
              <p>Tạm tính</p>
              <p className="text-brand-600 text-lg">{total.toLocaleString('vi-VN')}₫</p>
            </div>
            <p className="text-xs text-gray-500 mb-4 text-center">Chưa bao gồm phí vận chuyển (nếu có)</p>
            <Link href="/checkout" onClick={onClose}>
                <Button fullWidth className="shadow-lg shadow-brand-500/30">
                  <span className="flex items-center gap-2">Xác Nhận & Báo Giá <ArrowRight size={16}/></span>
                </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
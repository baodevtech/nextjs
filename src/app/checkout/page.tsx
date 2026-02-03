'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, Send, CheckCircle, ShieldCheck, Phone, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/common/UI';
import { createOrder } from '@/services/wpService'; // Import service

export default function CheckoutPage() {
    // Lấy thêm clearCart
    const { cart, cartTotal, removeFromCart, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderInfo, setOrderInfo] = useState<{ id: string, total: string } | null>(null);
    const [errorMsg, setErrorMsg] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        note: ''
    });

    // Nếu giỏ hàng trống và chưa đặt thành công -> Hiện màn hình trống
    if (cart.length === 0 && !isSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-4">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                    <Trash2 size={40} className="text-slate-300" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Giỏ hàng trống</h1>
                <p className="text-slate-500 mb-8 max-w-md">Bạn chưa chọn sản phẩm nào. Hãy ghé cửa hàng để xem các mẫu tấm ốp mới nhất.</p>
                <Link href="/shop">
                    <Button>Quay lại Cửa Hàng</Button>
                </Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');

        // Gọi hàm tạo đơn hàng thật
        const result = await createOrder(formData, cart);

        setIsSubmitting(false);

        if (result.success && result.order) {
            setOrderInfo({
                id: result.order.orderNumber,
                total: result.order.total
            });
            setIsSuccess(true);
            clearCart(); // Xóa giỏ hàng sau khi thành công
        } else {
            setErrorMsg(result.message || 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.');
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4 animate-fade-in">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-inner animate-bounce">
                    <CheckCircle size={48} className="text-green-500" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Đặt Hàng Thành Công!</h1>
                <p className="text-slate-500 mb-2 text-lg">
                    Cảm ơn <strong>{formData.name}</strong>. Đơn hàng của bạn đã được ghi nhận.
                </p>
                {orderInfo && (
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 inline-block text-left">
                        <p className="text-sm text-slate-500">Mã đơn hàng: <strong className="text-slate-900">#{orderInfo.id}</strong></p>
                        <p className="text-sm text-slate-500">Tổng tiền: <strong className="text-brand-600">{orderInfo.total}</strong></p>
                    </div>
                )}
                <p className="text-slate-400 mb-8 max-w-lg text-sm">
                    Nhân viên kinh doanh sẽ liên hệ qua số <strong>{formData.phone}</strong> để xác nhận đơn hàng và lịch giao hàng.
                </p>
                
                <div className="flex gap-4">
                    <Link href="/">
                        <Button variant="outline">Về Trang Chủ</Button>
                    </Link>
                    <Link href="/shop">
                        <Button>Tiếp Tục Mua Sắm</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 font-sans animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 mb-8">
                    <Link href="/shop" className="text-slate-500 hover:text-brand-600 transition-colors flex items-center gap-1 text-sm font-bold uppercase tracking-wider">
                        <ArrowLeft size={16} /> Tiếp tục mua sắm
                    </Link>
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Đặt Hàng & Thanh Toán</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* LEFT COLUMN: FORM */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm">1</span>
                                Thông tin người nhận
                            </h2>
                            
                            {errorMsg && (
                                <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100">
                                    <AlertCircle size={16}/> {errorMsg}
                                </div>
                            )}

                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Họ và tên *</label>
                                        <input 
                                            required
                                            type="text" 
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                            placeholder="Nguyễn Văn A"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Số điện thoại *</label>
                                        <input 
                                            required
                                            type="tel" 
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
                                            value={formData.phone}
                                            onChange={e => setFormData({...formData, phone: e.target.value})}
                                            placeholder="0912 xxx xxx"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Email (Không bắt buộc)</label>
                                    <input 
                                        type="email" 
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        placeholder="email@example.com (để nhận thông báo đơn hàng)"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Địa chỉ giao hàng (Dự kiến)</label>
                                    <input 
                                        type="text" 
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
                                        value={formData.address}
                                        onChange={e => setFormData({...formData, address: e.target.value})}
                                        placeholder="Số nhà, đường, Quận/Huyện..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">Ghi chú thêm</label>
                                    <textarea 
                                        rows={3}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium resize-none"
                                        value={formData.note}
                                        onChange={e => setFormData({...formData, note: e.target.value})}
                                        placeholder="Ví dụ: Cần thi công trọn gói, giao hàng giờ hành chính..."
                                    ></textarea>
                                </div>
                            </form>
                        </div>

                        <div className="mt-8 bg-brand-50 rounded-xl p-6 border border-brand-100 flex gap-4 items-start">
                             <ShieldCheck className="text-brand-600 shrink-0 mt-1" />
                             <div>
                                 <h4 className="font-bold text-brand-900 mb-1">Cam kết từ Đại Nam Wall</h4>
                                 <p className="text-sm text-brand-700/80">
                                     Đơn hàng sẽ được xử lý và xác nhận qua điện thoại trước khi giao. Thanh toán linh hoạt khi nhận hàng hoặc chuyển khoản.
                                 </p>
                             </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: CART & ACTIONS */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 sticky top-24">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm">2</span>
                                Đơn hàng của bạn
                            </h2>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar mb-6">
                                {cart.map(item => (
                                    <div key={item.id} className="flex gap-4 py-4 border-b border-gray-50 last:border-0">
                                        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                            <img src={item.image.sourceUrl} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-900 text-sm line-clamp-2">{item.name}</h4>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {item.price.amount > 0 ? item.price.formatted : 'Liên hệ'} x {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-brand-600 text-sm">
                                                {item.price.amount > 0 
                                                    ? (item.price.amount * item.quantity).toLocaleString('vi-VN') + '₫'
                                                    : 'Liên hệ'}
                                            </p>
                                            <button 
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-xs text-red-500 hover:text-red-700 mt-1 font-medium"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-3">
                                <div className="flex justify-between text-slate-600">
                                    <span>Tạm tính:</span>
                                    <span className="font-bold">{cartTotal.toLocaleString('vi-VN')}₫</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Phí vận chuyển:</span>
                                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded font-bold">Tính sau</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-slate-900 pt-4 border-t border-gray-100">
                                    <span>Tổng cộng:</span>
                                    <span className="text-brand-600">{cartTotal.toLocaleString('vi-VN')}₫</span>
                                </div>
                                <p className="text-xs text-slate-400 italic text-right">Giá đã bao gồm VAT (nếu có)</p>
                            </div>

                            <Button 
                                fullWidth 
                                onClick={() => document.getElementById('checkout-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                                disabled={isSubmitting}
                                className="mt-8 h-14 text-base shadow-lg shadow-brand-500/20"
                            >
                                {isSubmitting ? 'Đang xử lý...' : <span className="flex items-center gap-2">Đặt Hàng Ngay <Send size={18}/></span>}
                            </Button>

                            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                                <p className="text-xs text-slate-500 mb-2">Cần hỗ trợ gấp?</p>
                                <a href="tel:0912345678" className="inline-flex items-center gap-2 font-bold text-slate-900 hover:text-brand-600">
                                    <Phone size={16} /> 0912.345.678
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
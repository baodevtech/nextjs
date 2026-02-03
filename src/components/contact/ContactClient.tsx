'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, ChevronDown, MessageSquare } from 'lucide-react';
import { Button } from '@/components/common/UI';
import { ContactPageData } from '@/types';
import { submitContactForm } from '@/services/wpService';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-100 last:border-0">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-4 flex items-center justify-between text-left group"
            >
                <span className={`font-bold transition-colors ${isOpen ? 'text-brand-600' : 'text-slate-800 group-hover:text-brand-600'}`}>
                    {question}
                </span>
                <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-600' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
                <p className="text-sm text-slate-500 leading-relaxed pr-8">{answer}</p>
            </div>
        </div>
    );
};

interface ContactClientProps {
    data: ContactPageData;
}

export default function ContactClient({ data }: ContactClientProps) {
    // Lấy config form cho gọn
    const { formConfig, info, faqsContact } = data; // Sử dụng faqs thay vì faqsContact

    // State form
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        phone: '',
        topic: formConfig.topics[0]?.value || 'advice', // Default lấy topic đầu tiên từ CMS
        message: ''
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    // Parallax Effect
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // 1. Lấy dữ liệu hiện tại để gửi
        const payload = {
            name: formState.name,
            phone: formState.phone,
            email: formState.email,
            topic: formState.topic,
            message: formState.message
        };

        // 2. [QUAN TRỌNG] Báo thành công NGAY LẬP TỨC cho người dùng
        // Không chờ API, không hiện loading
        setIsSuccess(true);

        // 3. Gửi API ngầm phía sau (Fire and Forget)
        // Chúng ta không dùng 'await' để chặn UI nữa
        submitContactForm(payload)
            .then(result => {
                if (!result || !result.success) {
                    // Nếu lỗi server thực sự, chỉ log ra console để dev biết
                    // Vì khách đã thấy báo thành công rồi, không nên báo lỗi lại gây hoang mang
                    console.error("Gửi API thất bại (Background):", result);
                } else {
                    console.log("Gửi API thành công (Background)");
                }
            })
            .catch(err => {
                console.error("Lỗi mạng (Background):", err);
                // Tùy chọn: Có thể lưu vào localStorage để thử gửi lại sau nếu cần
            });
            
        // Reset form state (nếu cần, mặc dù UI đã chuyển sang màn hình success)
        setFormState({
            name: '',
            email: '',
            phone: '',
            topic: formConfig.topics[0]?.value || 'advice',
            message: ''
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-white min-h-screen animate-fade-in font-sans">
            
            {/* HERO SECTION (Dynamic) */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900">
                 <div 
                    className="absolute inset-0 z-0 w-full h-[120%]"
                    style={{
                        backgroundImage: `url('${data.heroImage}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transform: `translateY(${scrollY * 0.4}px)`,
                        filter: 'brightness(0.3)'
                    }}
                 ></div>
                 
                 <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-white/5 z-0"></div>
                 
                 <div className="max-w-7xl mx-auto text-center relative z-10 px-4 mt-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-brand-300 font-bold tracking-[0.2em] uppercase text-[10px] mb-6 animate-slide-up">
                        Liên Hệ Đại Nam Wall
                    </span>
                    
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 animate-slide-up leading-tight" style={{ animationDelay: '0.1s' }}>
                        {data.heroTitle}
                    </h1>
                    
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto font-light animate-slide-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
                        {data.heroDesc}
                    </p>
                 </div>
            </section>

            {/* MAIN CONTENT */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-24 relative z-20">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                    
                    {/* LEFT: INFO (Dynamic) */}
                    <div className="lg:col-span-5 bg-slate-50 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-gray-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 ">Thông Tin Liên Hệ</h2>
                        
                        <div className="space-y-8">
                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-600 shadow-sm border border-gray-200 group-hover:scale-110 group-hover:border-brand-200 transition-all duration-300">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 mb-1">Showroom & Văn Phòng</p>
                                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                        {info.address}
                                    </p>
                                    <a href="#map" className="text-xs font-bold text-brand-600 hover:underline mt-2 inline-block">Xem bản đồ</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-600 shadow-sm border border-gray-200 group-hover:scale-110 group-hover:border-brand-200 transition-all duration-300">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 mb-1">Hotline Hỗ Trợ</p>
                                    <p className="text-lg font-bold text-brand-700">{info.hotline}</p>
                                    <p className="text-xs text-slate-500">Hỗ trợ 24/7</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-600 shadow-sm border border-gray-200 group-hover:scale-110 group-hover:border-brand-200 transition-all duration-300">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 mb-1">Email</p>
                                    <p className="text-sm text-slate-600">{info.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
                                <Clock size={18} className="text-brand-500" /> Giờ Làm Việc
                            </h3>
                            <p className="text-sm text-slate-600 whitespace-pre-line">{info.workingHours}</p>
                        </div>
                    </div>

                    {/* RIGHT: FORM (Configurable) */}
                    <div className="lg:col-span-7 p-8 md:p-12 bg-white">
                        {isSuccess ? (
                            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in p-8">
                                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6 shadow-inner">
                                    <CheckCircle size={48} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">{formConfig.successTitle}</h3>
                                <p className="text-slate-500 max-w-md mx-auto mb-8">
                                    {formConfig.successMessage}
                                </p>
                                <Button onClick={() => { setIsSuccess(false); setFormState({name: '', email: '', phone: '', topic: formConfig.topics[0]?.value, message: ''}) }}>
                                    Gửi yêu cầu khác
                                </Button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2 ">{formConfig.heading}</h2>
                                <p className="text-slate-500 text-sm mb-8">{formConfig.desc}</p>
                                
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Họ và tên <span className="text-red-500">*</span></label>
                                            <input 
                                                required type="text" name="name" id="name"
                                                value={formState.name} onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-sm font-medium placeholder:text-slate-400"
                                                placeholder={formConfig.namePlaceholder}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="phone" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Số điện thoại <span className="text-red-500">*</span></label>
                                            <input 
                                                required type="tel" name="phone" id="phone"
                                                value={formState.phone} onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-sm font-medium placeholder:text-slate-400"
                                                placeholder={formConfig.phonePlaceholder}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Email</label>
                                            <input 
                                                type="email" name="email" id="email"
                                                value={formState.email} onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-sm font-medium placeholder:text-slate-400"
                                                placeholder={formConfig.emailPlaceholder}
                                            />
                                        </div>
                                        
                                        {/* Dynamic Topic Dropdown */}
                                        <div className="space-y-2">
                                            <label htmlFor="topic" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Chủ đề quan tâm</label>
                                            <div className="relative">
                                                <select 
                                                    name="topic" id="topic"
                                                    value={formState.topic} onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-sm font-medium appearance-none cursor-pointer"
                                                >
                                                    {formConfig.topics.map((item, idx) => (
                                                        <option key={idx} value={item.value}>{item.label}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Nội dung chi tiết</label>
                                        <textarea 
                                            name="message" id="message" rows={4}
                                            value={formState.message} onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-sm font-medium placeholder:text-slate-400 resize-none"
                                            placeholder={formConfig.messagePlaceholder}
                                        ></textarea>
                                    </div>

                                    <Button 
                                        type="submit" fullWidth 
                                        disabled={isSubmitting}
                                        className={`h-14 text-sm uppercase tracking-widest font-bold transition-all shadow-lg hover:shadow-brand-500/30 ${isSubmitting ? 'opacity-80' : ''}`}
                                    >
                                        {isSubmitting ? 'Đang gửi...' : (
                                            <span className="flex items-center gap-2">{formConfig.btnText} <Send size={16}/></span>
                                        )}
                                    </Button>
                                    <p className="text-[10px] text-slate-400 text-center mt-4">
                                        Bằng cách gửi form, bạn đồng ý với chính sách bảo mật thông tin của Đại Nam Wall.
                                    </p>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* MAP SECTION */}
            {data.mapUrl && (
                <section id="map" className="h-96 w-full bg-slate-100 relative group overflow-hidden">
                    <iframe 
                        src={data.mapUrl} 
                        width="100%" 
                        height="100%" 
                        style={{border:0, filter: 'grayscale(100%) invert(0%)'}} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full"
                    ></iframe>
                </section>
            )}

            {/* FAQ SECTION (DYNAMIC) */}
            {faqsContact.length > 0 && (
                <section className="py-20 bg-slate-50">
                    <div className="max-w-3xl mx-auto px-4">
                        <div className="text-center mb-12">
                             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm mx-auto mb-4 border border-gray-100">
                                 <MessageSquare size={24} />
                             </div>
                             <h2 className="text-3xl font-bold text-slate-900 mb-4 ">Câu Hỏi Thường Gặp</h2>
                             <p className="text-slate-500">Giải đáp nhanh các thắc mắc phổ biến về sản phẩm và dịch vụ.</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                            {/* Render danh sách câu hỏi từ Admin */}
                            {faqsContact.map((item, idx) => (
                                <FAQItem 
                                    key={idx} 
                                    question={item.question} 
                                    answer={item.answer} 
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};
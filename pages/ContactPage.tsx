import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, ChevronDown, MessageSquare } from 'lucide-react';
import { Button } from '../components/common/UI';

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

export const ContactPage: React.FC = () => {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        phone: '',
        topic: 'advice',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    // Parallax Effect Logic
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setIsSuccess(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-white min-h-screen animate-fade-in font-sans">
            {/* 1. HERO HEADER WITH PARALLAX */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900">
                 {/* Parallax Background Image */}
                 <div 
                    className="absolute inset-0 z-0 w-full h-[120%]"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        transform: `translateY(${scrollY * 0.4}px)`, // Parallax speed factor
                        filter: 'brightness(0.3)' // Darken for text contrast
                    }}
                 ></div>
                 
                 {/* Decorative Elements */}
                 <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-white/5 z-0"></div>
                 
                 <div className="max-w-7xl mx-auto text-center relative z-10 px-4 mt-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-brand-300 font-bold tracking-[0.2em] uppercase text-[10px] mb-6 animate-slide-up">
                        Liên Hệ Đại Nam Wall
                    </span>
                    
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-8 animate-slide-up leading-tight" style={{ animationDelay: '0.1s' }}>
                        Chúng tôi luôn lắng nghe <br/>
                        <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 decoration-clone">
                            câu chuyện của bạn.
                        </span>
                    </h1>
                    
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto font-light animate-slide-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
                        Dù bạn cần tư vấn về sản phẩm, báo giá dự án hay hợp tác đại lý, chúng tôi luôn sẵn sàng hỗ trợ 24/7 với sự tận tâm cao nhất.
                    </p>
                 </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-24 relative z-20">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                    
                    {/* 2. CONTACT INFO (LEFT) */}
                    <div className="lg:col-span-5 bg-slate-50 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-gray-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 font-serif">Thông Tin Liên Hệ</h2>
                        
                        <div className="space-y-8">
                            {/* Address */}
                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-600 shadow-sm border border-gray-200 group-hover:scale-110 group-hover:border-brand-200 transition-all duration-300">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 mb-1">Showroom & Văn Phòng</p>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        123 Đường Nguyễn Văn Linh,<br/> 
                                        Quận Long Biên, Hà Nội
                                    </p>
                                    <a href="#map" className="text-xs font-bold text-brand-600 hover:underline mt-2 inline-block">Xem bản đồ</a>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-600 shadow-sm border border-gray-200 group-hover:scale-110 group-hover:border-brand-200 transition-all duration-300">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 mb-1">Hotline Hỗ Trợ</p>
                                    <p className="text-lg font-bold text-brand-700">0912.345.678</p>
                                    <p className="text-xs text-slate-500">Hỗ trợ 24/7 (Cả T7 & CN)</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4 group">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand-600 shadow-sm border border-gray-200 group-hover:scale-110 group-hover:border-brand-200 transition-all duration-300">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 mb-1">Email</p>
                                    <p className="text-sm text-slate-600">sale@dainamwall.com</p>
                                    <p className="text-sm text-slate-600">support@dainamwall.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Working Hours Box */}
                        <div className="mt-12 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
                                <Clock size={18} className="text-brand-500" /> Giờ Làm Việc
                            </h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="text-slate-500">Thứ 2 - Thứ 6</span>
                                    <span className="font-semibold text-slate-800">8:00 - 17:30</span>
                                </li>
                                <li className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="text-slate-500">Thứ 7</span>
                                    <span className="font-semibold text-slate-800">8:00 - 12:00</span>
                                </li>
                                <li className="flex justify-between pt-1">
                                    <span className="text-slate-500">Chủ Nhật</span>
                                    <span className="text-brand-600 font-bold bg-brand-50 px-2 rounded text-xs py-0.5">Đặt lịch hẹn</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 3. CONTACT FORM (RIGHT) */}
                    <div className="lg:col-span-7 p-8 md:p-12 bg-white">
                        {isSuccess ? (
                            <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in p-8">
                                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6 shadow-inner">
                                    <CheckCircle size={48} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Gửi thành công!</h3>
                                <p className="text-slate-500 max-w-md mx-auto mb-8">
                                    Cảm ơn bạn đã liên hệ với Đại Nam Wall. Đội ngũ tư vấn sẽ phản hồi lại yêu cầu của bạn trong vòng 30 phút làm việc.
                                </p>
                                <Button onClick={() => { setIsSuccess(false); setFormState({name: '', email: '', phone: '', topic: 'advice', message: ''}) }}>
                                    Gửi yêu cầu khác
                                </Button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2 font-serif">Gửi Tin Nhắn</h2>
                                <p className="text-slate-500 text-sm mb-8">Vui lòng điền thông tin bên dưới, chúng tôi sẽ liên hệ lại ngay.</p>
                                
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Họ và tên <span className="text-red-500">*</span></label>
                                            <input 
                                                required
                                                type="text" 
                                                name="name"
                                                id="name"
                                                value={formState.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-sm font-medium placeholder:text-slate-400"
                                                placeholder="Nguyễn Văn A"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="phone" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Số điện thoại <span className="text-red-500">*</span></label>
                                            <input 
                                                required
                                                type="tel" 
                                                name="phone"
                                                id="phone"
                                                value={formState.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-sm font-medium placeholder:text-slate-400"
                                                placeholder="0912 xxx xxx"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Email</label>
                                            <input 
                                                type="email" 
                                                name="email"
                                                id="email"
                                                value={formState.email}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-sm font-medium placeholder:text-slate-400"
                                                placeholder="example@gmail.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="topic" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Chủ đề quan tâm</label>
                                            <div className="relative">
                                                <select 
                                                    name="topic" 
                                                    id="topic"
                                                    value={formState.topic}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-sm font-medium appearance-none cursor-pointer"
                                                >
                                                    <option value="advice">Tư vấn sản phẩm</option>
                                                    <option value="quote">Yêu cầu báo giá thi công</option>
                                                    <option value="partner">Hợp tác đại lý / KTS</option>
                                                    <option value="warranty">Bảo hành & Khiếu nại</option>
                                                </select>
                                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Nội dung chi tiết</label>
                                        <textarea 
                                            name="message"
                                            id="message"
                                            rows={4}
                                            value={formState.message}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all text-sm font-medium placeholder:text-slate-400 resize-none"
                                            placeholder="Bạn cần tư vấn cho công trình nhà phố hay chung cư? Diện tích khoảng bao nhiêu?"
                                        ></textarea>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        fullWidth 
                                        disabled={isSubmitting}
                                        className={`h-14 text-sm uppercase tracking-widest font-bold transition-all shadow-lg hover:shadow-brand-500/30 ${isSubmitting ? 'opacity-80' : ''}`}
                                    >
                                        {isSubmitting ? 'Đang gửi...' : (
                                            <span className="flex items-center gap-2">Gửi Yêu Cầu <Send size={16}/></span>
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

            {/* 4. MAP SECTION (Static Placeholder with Link) */}
            <section id="map" className="h-96 w-full bg-slate-100 relative group overflow-hidden">
                {/* Simulated Map Appearance */}
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/105.85,21.02,12/1200x600?access_token=pk.xxx')] bg-cover bg-center grayscale opacity-60">
                     {/* Note: In a real app, embed a Google Maps Iframe here */}
                     <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8953153578335!2d105.854444!3d21.028511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab9bd9861ca1%3A0xe7887f7b72ca17a9!2zSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1709228832560!5m2!1svi!2s" 
                        width="100%" 
                        height="100%" 
                        style={{border:0, filter: 'grayscale(100%) invert(0%)'}} 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full"
                    ></iframe>
                </div>
                
                {/* Floating Map Card */}
                <div className="absolute bottom-6 left-6 md:left-1/2 md:-translate-x-1/2 bg-white p-4 rounded-xl shadow-2xl flex items-center gap-4 animate-fade-in z-10 border border-gray-200">
                     <div className="w-10 h-10 bg-brand-600 rounded-full flex items-center justify-center text-white animate-bounce">
                        <MapPin size={20} />
                     </div>
                     <div>
                        <p className="font-bold text-slate-900 text-sm">Đại Nam Wall Showroom</p>
                        <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-xs text-brand-600 font-semibold hover:underline">Chỉ đường trên Google Maps</a>
                     </div>
                </div>
            </section>

            {/* 5. FAQ SECTION */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="text-center mb-12">
                         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 shadow-sm mx-auto mb-4 border border-gray-100">
                             <MessageSquare size={24} />
                         </div>
                         <h2 className="text-3xl font-bold text-slate-900 mb-4 font-serif">Câu Hỏi Thường Gặp</h2>
                         <p className="text-slate-500">Giải đáp nhanh các thắc mắc phổ biến về sản phẩm và dịch vụ.</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                        <FAQItem 
                            question="Đại Nam Wall có nhận thi công trọn gói không?" 
                            answer="Có. Chúng tôi cung cấp dịch vụ trọn gói từ khảo sát, thiết kế 3D đến thi công hoàn thiện. Đội ngũ kỹ thuật của Đại Nam được đào tạo bài bản để đảm bảo chất lượng tốt nhất."
                        />
                        <FAQItem 
                            question="Chính sách bảo hành sản phẩm như thế nào?" 
                            answer="Tất cả sản phẩm tấm ốp của Đại Nam Wall đều được bảo hành chính hãng 15 năm về độ bền màu và kết cấu vật liệu. Bảo hành thi công 2 năm."
                        />
                        <FAQItem 
                            question="Tôi có thể xem mẫu thực tế ở đâu?" 
                            answer="Quý khách có thể ghé thăm Showroom tại Hà Nội hoặc liên hệ Hotline để nhân viên kinh doanh mang mẫu catalog đến tư vấn trực tiếp tại nhà."
                        />
                        <FAQItem 
                            question="Sản phẩm có chịu được nước và mối mọt không?" 
                            answer="Tuyệt đối có. Tấm ốp Đại Nam sử dụng công nghệ Nano và cốt nhựa nguyên sinh, cho khả năng kháng nước 100% và chống mối mọt vĩnh viễn, phù hợp khí hậu nóng ẩm Việt Nam."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
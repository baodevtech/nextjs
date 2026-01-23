import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/UI';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-sans px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gray-50 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-50 rounded-full blur-3xl -ml-32 -mb-32"></div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <h1 className="text-[12rem] md:text-[16rem] font-serif font-bold text-slate-50 leading-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
            404
        </h1>
        
        <div className="mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-red-500 font-bold uppercase tracking-widest text-xs mb-4">
                Lỗi Không Tìm Thấy Trang
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
                Bức Tường Này <br/> Chưa Được Xây Dựng
            </h2>
            <p className="text-slate-500 text-lg font-light leading-relaxed max-w-lg mx-auto">
                Rất tiếc, trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
            </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
                <Button className="h-12 px-8">
                    <span className="flex items-center gap-2"><Home size={18}/> Về Trang Chủ</span>
                </Button>
            </Link>
            <Link to="/shop">
                <Button variant="outline" className="h-12 px-8">
                    <span className="flex items-center gap-2"><Search size={18}/> Xem Sản Phẩm</span>
                </Button>
            </Link>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-100">
            <p className="text-slate-400 text-sm mb-4">Có thể bạn quan tâm:</p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-bold text-slate-900">
                <Link to="/shop?cat=lam-song" className="hover:text-brand-600 transition-colors">Lam Sóng</Link>
                <Link to="/shop?cat=pvc-stone" className="hover:text-brand-600 transition-colors">PVC Vân Đá</Link>
                <Link to="/blog" className="hover:text-brand-600 transition-colors">Tin Tức</Link>
                <Link to="/contact" className="hover:text-brand-600 transition-colors">Liên Hệ</Link>
            </div>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Metadata } from 'next';
import { getAboutPageData } from '@/services/wpService';
import AboutClient from '@/components/about/AboutClient';

export const metadata: Metadata = {
  title: 'Về Chúng Tôi | Đại Nam Wall',
  description: 'Tìm hiểu về lịch sử, sứ mệnh và giá trị cốt lõi của Đại Nam Wall.',
};

export default async function AboutPage() {
  const data = await getAboutPageData();

  if (!data) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <p className="text-slate-500">Đang cập nhật thông tin giới thiệu...</p>
        </div>
    );
  }

  return <AboutClient data={data} />;
}
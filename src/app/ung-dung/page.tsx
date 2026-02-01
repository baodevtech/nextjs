import React from 'react';
import { Metadata } from 'next';
import { getApplicationsPageData } from '@/services/wpService';
import ApplicationsClient from '@/components/applications/ApplicationsClient';

export const metadata: Metadata = {
  title: 'Ứng Dụng Thực Tế | Đại Nam Wall',
  description: 'Khám phá giải pháp vật liệu ốp tường cao cấp cho từng không gian sống.',
};

export default async function ApplicationsPage() {
  // Fetch dữ liệu từ ACF Options Page
  const data = await getApplicationsPageData();

  // Kiểm tra dữ liệu
  if (!data || !data.spaces.length) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <p>Đang cập nhật dữ liệu ứng dụng...</p>
      </div>
    );
  }

  // Truyền data xuống Client Component
  return <ApplicationsClient data={data} />;
}
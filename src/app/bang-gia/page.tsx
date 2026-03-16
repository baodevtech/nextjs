import React from 'react';
import { Metadata } from 'next';
import { getPricingPageData } from '@/services/wpService';
import PricingClient from '@/components/pricing/PricingClient';

export const metadata: Metadata = {
  title: 'Bảng Giá Niêm Yết | Đại Nam Wall',
  description: 'Tra cứu bảng giá thi công tấm ốp tường trọn gói và giá vật tư lẻ.',
};

export default async function PricingPage() {
  const data = await getPricingPageData();

  if (!data) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <p className="text-slate-500">Đang cập nhật bảng giá...</p>
        </div>
    );
  }

  return (
    <PricingClient data={data} />
  );
}
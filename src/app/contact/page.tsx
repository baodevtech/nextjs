import React from 'react';
import { Metadata } from 'next';
import { getContactPageData } from '@/services/wpService';
import ContactClient from '@/components/contact/ContactClient';

export const metadata: Metadata = {
  title: 'Liên Hệ | Đại Nam Wall',
  description: 'Liên hệ với chúng tôi để được tư vấn thiết kế và thi công tấm ốp tường miễn phí.',
};

export default async function ContactPage() {
  const data = await getContactPageData();

  if (!data) {
    return <div className="text-center py-20">Đang tải dữ liệu...</div>;
  }

  return (
    <ContactClient data={data} />
  );
}
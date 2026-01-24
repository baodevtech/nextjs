import React from 'react';
import { getProducts, getCategories } from '@/services/wpService';
import HomePageClient from '@/components/home/HomePageClient';

// Đây là Server Component (Mặc định trong Next.js App Router)
// Nó cho phép dùng async/await để fetch data trực tiếp
export default async function HomePage() {
  // 1. Fetch dữ liệu song song để tiết kiệm thời gian
  // Data sẽ được lấy trên server trước khi trả HTML về trình duyệt -> Tốt cho SEO
  const [products, categories] = await Promise.all([
    getProducts(), 
    getCategories()
  ]);

  // 2. Truyền dữ liệu xuống Client Component
  return (
    <HomePageClient 
      initialProducts={products} 
      initialCategories={categories} 
    />
  );
}
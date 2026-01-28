// src/app/page.tsx
import React from 'react';
import { getProducts, getCategories, getHomeData } from '@/services/wpService'; // Import thêm getHomeData
import HomePageClient from '@/components/home/HomePageClient';

export default async function HomePage() {
  // 1. Fetch dữ liệu song song
  const [products, categories, homeData] = await Promise.all([
    getProducts(), 
    getCategories(),
    getHomeData(), // Fetch dữ liệu ACF Home
  ]);

  // 2. Truyền dữ liệu xuống Client Component
  return (
    <HomePageClient 
      initialProducts={products} 
      initialCategories={categories}
      initialHomeData={homeData} // Truyền props mới
    />
  );
}
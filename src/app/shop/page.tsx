// src/app/shop/page.tsx
import React, { Suspense } from "react";
import {
  getProducts,
  getCategories,
  getShopSettings,
} from "@/services/wpService";
import ShopClient from "./ShopClient";

export default async function ShopPage() {
  // Lấy dữ liệu trên Server (Sẽ được Next.js tự động cache vô thời hạn theo cấu hình trong wpService)
  const [products, categories, shopSettings] = await Promise.all([
    getProducts(),
    getCategories(),
    getShopSettings(),
  ]);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-slate-500">Đang tải cửa hàng...</div>}>
      <ShopClient 
        initialProducts={products}
        initialCategories={categories}
        initialShopSettings={shopSettings}
      />
    </Suspense>
  );
}
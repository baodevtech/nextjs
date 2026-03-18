// src/app/api/shop/route.ts
import { NextResponse } from 'next/server';
import { getPaginatedShopProducts } from '@/services/wpService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { first, after, category, search, brand, inStockOnly, isPromotion, sortBy } = body;

    const data = await getPaginatedShopProducts(
      first || 12,
      after || "",
      category || "all",
      search || "",
      brand || "all",
      inStockOnly || false,
      isPromotion || false,
      sortBy || "Mới nhất"
    );

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API Shop Error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi tải sản phẩm' },
      { status: 500 }
    );
  }
}
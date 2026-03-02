// src/app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  console.log('--- 🚀 BẮT ĐẦU NHẬN WEBHOOK TỪ WORDPRESS ---');

  const secret = request.nextUrl.searchParams.get('secret');
  const tag = request.nextUrl.searchParams.get('tag');
  const path = request.nextUrl.searchParams.get('path'); // Nhận thêm URL path

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Lỗi: Secret Key không hợp lệ!' }, { status: 401 });
  }

  // Chấp nhận nếu có ít nhất tag hoặc path
  if (!tag && !path) {
    return NextResponse.json({ message: 'Lỗi: Bị thiếu Tag và Path!' }, { status: 400 });
  }

  try {
    // 1. XÓA CACHE DỮ LIỆU (DATA CACHE) THEO TAG
    if (tag) {
      const tagsToRevalidate = tag.split(',');
      tagsToRevalidate.forEach(t => {
        const cleanTag = t.trim();
        if (cleanTag) {
          revalidateTag(cleanTag);
          console.log(`✅ Đã xóa Data Cache cho tag: [${cleanTag}]`);
        }
      });
    }

    // 2. XÓA HTML CACHE (FULL ROUTE CACHE) THEO ĐƯỜNG DẪN URL
    if (path) {
      const pathsToRevalidate = path.split(',');
      pathsToRevalidate.forEach(p => {
        const cleanPath = p.trim();
        if (cleanPath) {
          revalidatePath(cleanPath); // Ép buộc xóa cache của trang
          console.log(`✅ Đã xóa Route Cache cho path: [${cleanPath}]`);
        }
      });
    }

    console.log('---------------------------------------------------\n');
    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(), 
      message: 'Đã xóa cache thành công' 
    });
  } catch (err) {
    console.error('❌ LỖI HỆ THỐNG KHI XÓA CACHE:', err);
    return NextResponse.json({ message: 'Lỗi hệ thống khi revalidate' }, { status: 500 });
  }
}
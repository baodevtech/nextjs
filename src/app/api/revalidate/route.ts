// src/app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  console.log('--- 🚀 BẮT ĐẦU NHẬN WEBHOOK TỪ WORDPRESS ---');

  // 1. Ghi log các tham số trên URL (Query Parameters)
  const secret = request.nextUrl.searchParams.get('secret');
  const tag = request.nextUrl.searchParams.get('tag');
  
  console.log('📌 Query Parameters:');
  console.log(` - Secret: ${secret ? 'Đã nhận (Được ẩn để bảo mật)' : 'Không có'}`);
  console.log(` - Tag cần xóa cache: ${tag || 'Không có'}`);

  // 2. Thử đọc và ghi log dữ liệu Body (nếu WordPress có gửi kèm Body)
  try {
    // Clone request để đọc text mà không làm hỏng request gốc
    const bodyText = await request.clone().text(); 
    if (bodyText) {
      // Cố gắng parse JSON nếu có thể
      try {
        const bodyJson = JSON.parse(bodyText);
        console.log('📦 Dữ liệu Body (JSON):', bodyJson);
      } catch (e) {
        console.log('📦 Dữ liệu Body (Text raw):', bodyText);
      }
    } else {
      console.log('📦 Dữ liệu Body: Trống (Không gửi kèm nội dung)');
    }
  } catch (err) {
    console.log('⚠️ Không thể đọc Body của request');
  }

  // 3. Kiểm tra Secret Key để chống spam
  if (secret !== process.env.REVALIDATION_SECRET) {
    console.log('❌ LỖI: Secret Key không khớp! Từ chối Revalidate.');
    console.log('---------------------------------------------------\n');
    return NextResponse.json({ message: 'Lỗi: Secret Key không hợp lệ!' }, { status: 401 });
  }

  // 4. Kiểm tra xem có tag nào được truyền lên không
  if (!tag) {
    console.log('❌ LỖI: Không tìm thấy Tag cần xóa!');
    console.log('---------------------------------------------------\n');
    return NextResponse.json({ message: 'Lỗi: Bị thiếu Tag!' }, { status: 400 });
  }

  // 5. Thực hiện xóa bộ nhớ đệm
  try {
    // Tách chuỗi tag thành mảng (phòng khi WP gửi "products,product-slug-abc")
   const tagsToRevalidate = tag.split(',');
    
    tagsToRevalidate.forEach(t => {
      const cleanTag = t.trim();
      if (cleanTag) {
        // @ts-ignore: Bỏ qua cảnh báo TS đòi 2 tham số (Do typings local bị sai)
        revalidateTag(cleanTag);
        
        console.log(`✅ Đã trigger xóa cache cho tag: [${cleanTag}]`);
      }
    });

    console.log('---------------------------------------------------\n');
    
    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(), 
      message: `Đã xóa cache thành công cho tag: ${tag}` 
    });
  } catch (err) {
    console.error('❌ LỖI HỆ THỐNG KHI XÓA CACHE:', err);
    console.log('---------------------------------------------------\n');
    return NextResponse.json({ message: 'Lỗi hệ thống khi revalidate' }, { status: 500 });
  }
}
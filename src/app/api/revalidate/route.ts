// src/app/api/revalidate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache'; // Thêm revalidatePath
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs'; // BẮT BUỘC để dùng fs

async function logErrorToFile(error: unknown) {
  try {
    const logDir = path.join(process.cwd(), 'logs');
    const logFile = path.join(logDir, 'revalidate-errors.log');

    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    const errorMessage =
      `[${new Date().toISOString()}]\n` +
      (error instanceof Error ? error.stack : JSON.stringify(error)) +
      '\n--------------------------------------------------\n';

    fs.appendFileSync(logFile, errorMessage);
  } catch {
    // Không throw tiếp để tránh crash API
  }
}

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const tag = request.nextUrl.searchParams.get('tag');
  const pathParam = request.nextUrl.searchParams.get('path'); // Đọc thêm biến path từ WP

  try {
    await request.clone().text();
  } catch (err) {
    await logErrorToFile(err);
  }

  if (secret !== process.env.REVALIDATION_SECRET) { // Lưu ý: process.env.REVALIDATION_SECRET của bạn phải là '123' cho khớp với PHP nhé
    const error = new Error('Secret Key không hợp lệ');
    await logErrorToFile(error);
    return NextResponse.json({ message: 'Lỗi: Secret Key không hợp lệ!' }, { status: 401 });
  }

  if (!tag && !pathParam) {
    const error = new Error('Thiếu Tag hoặc Path revalidate');
    await logErrorToFile(error);
    return NextResponse.json({ message: 'Lỗi: Bị thiếu Tag hoặc Path!' }, { status: 400 });
  }

  try {
    // 1. Xóa cache theo Tags
    if (tag) {
      const tagsToRevalidate = tag.split(',');
      tagsToRevalidate.forEach((t) => {
        const cleanTag = t.trim();
        if (cleanTag) {
          // Bỏ qua cảnh báo báo đỏ của TypeScript
          // @ts-ignore
          revalidateTag(cleanTag);
        }
      });
    }

    // 2. Xóa cache theo Path
    if (pathParam) {
      const pathsToRevalidate = pathParam.split(',');
      pathsToRevalidate.forEach((p) => {
        const cleanPath = p.trim();
        if (cleanPath) {
          // Bỏ qua cảnh báo báo đỏ của TypeScript
          // @ts-ignore
          revalidatePath(cleanPath, 'page'); 
        }
      });
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: `Đã xóa cache thành công cho tag: [${tag}] và path: [${pathParam}]`,
    });
  } catch (err) {
    await logErrorToFile(err);
    return NextResponse.json({ message: 'Lỗi hệ thống khi revalidate' }, { status: 500 });
  }
}
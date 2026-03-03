// src/app/api/revalidate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs'; // BẮT BUỘC để dùng fs

// Hàm ghi log lỗi
async function logErrorToFile(error: unknown) {
  try {
    const logDir = path.join(process.cwd(), 'logs');
    const logFile = path.join(logDir, 'revalidate-errors.log');

    // Tạo thư mục nếu chưa tồn tại
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

  try {
    await request.clone().text();
  } catch (err) {
    await logErrorToFile(err);
  }

  if (secret !== process.env.REVALIDATION_SECRET) {
    const error = new Error('Secret Key không hợp lệ');
    await logErrorToFile(error);

    return NextResponse.json(
      { message: 'Lỗi: Secret Key không hợp lệ!' },
      { status: 401 }
    );
  }

  if (!tag) {
    const error = new Error('Thiếu Tag revalidate');
    await logErrorToFile(error);

    return NextResponse.json(
      { message: 'Lỗi: Bị thiếu Tag!' },
      { status: 400 }
    );
  }

  try {
    const tagsToRevalidate = tag.split(',');

    tagsToRevalidate.forEach((t) => {
      const cleanTag = t.trim();
      if (cleanTag) {
        // @ts-ignore
        revalidateTag(cleanTag);
      }
    });

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      message: `Đã xóa cache thành công cho tag: ${tag}`,
    });
  } catch (err) {
    await logErrorToFile(err);

    return NextResponse.json(
      { message: 'Lỗi hệ thống khi revalidate' },
      { status: 500 }
    );
  }
}
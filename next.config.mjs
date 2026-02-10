/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Tối ưu Image (Giữ nguyên phần này vì rất quan trọng cho PageSpeed)
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: 'www.transparenttextures.com' },
      { protocol: 'https', hostname: 'portal.khopanel.com' },
    ],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 2. Tối ưu Compiler (Giữ nguyên)
  compiler: {
    removeConsole: process.env.NODE_ENV === "production", // Xóa console.log khi build production
  },

  // [ĐÃ XÓA] Phần cấu hình webpack thủ công gây lỗi. 
  // Next.js 16 tự động xử lý việc splitChunks tối ưu hơn code cũ.

  // 3. Bật nén Gzip/Brotli
  compress: true,
  
  // 4. (Tùy chọn) Nếu bạn vẫn muốn chạy Webpack thay vì Turbopack để dùng các plugin cũ
  // thì bỏ comment dòng dưới, nhưng khuyến nghị không nên dùng nếu không bắt buộc.
  // webpack: (config) => { return config; },
};

export default nextConfig;
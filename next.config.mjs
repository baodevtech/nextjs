/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Ưu tiên AVIF trước, nếu trình duyệt không hỗ trợ mới dùng WebP
    formats: ['image/avif', 'image/webp'], 
    qualities: [75, 85, 90],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: 'www.transparenttextures.com' },
      { protocol: 'https', hostname: 'portal.khopanel.com' },
    ],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
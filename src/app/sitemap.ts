// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { 
  getProducts, 
  getCategories, 
  getAllPosts, 
  getAllProjects 
} from '@/services/wpService';

const BASE_URL = 'https://khopanel.com';

// HÀM HELPER: Xử lý chuỗi ngày tháng bị lỗi (dd/mm/yyyy -> ISO)
const safeDateIso = (dateStr?: string) => {
  if (!dateStr) return new Date().toISOString();
  try {
    // Tách chuỗi theo dấu "/"
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // JS đếm tháng từ 0
      const year = parseInt(parts[2], 10);
      
      const parsedDate = new Date(year, month, day);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString();
      }
    }
    // Dự phòng trường hợp là ngày chuẩn
    const fallback = new Date(dateStr);
    if (!isNaN(fallback.getTime())) return fallback.toISOString();
    
    return new Date().toISOString();
  } catch (error) {
    return new Date().toISOString();
  }
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, posts, projects] = await Promise.all([
    getProducts(),
    getCategories(),
    getAllPosts(),
    getAllProjects(),
  ]);

  // 1. Các trang tĩnh (Static Routes)
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/pricing',
    '/ung-dung',
    '/shop',
    '/blog',
    '/projects',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Các trang Sản phẩm
  const productRoutes = products.map((product) => ({
    url: `${BASE_URL}/product/${product.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  // 3. Các trang Danh mục (Thay 'danh-muc' bằng đường dẫn thực tế nếu cần)
  const categoryRoutes = categories.map((category) => ({
    url: `${BASE_URL}/danh-muc/${category.slug}`, 
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 4. Các trang Bài viết Blog (ĐÃ SỬA LỖI NGÀY THÁNG)
  const postRoutes = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: safeDateIso(post.date), // Sử dụng helper an toàn
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // 5. Các trang Chi tiết Dự án
  const projectRoutes = projects.map((project) => ({
    url: `${BASE_URL}/projects/${project.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...categoryRoutes,
    ...postRoutes,
    ...projectRoutes,
  ];
}
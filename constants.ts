import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  { 
    id: 'cat_1', 
    name: 'Panel Cách Nhiệt PU', 
    slug: 'panel-pu', 
    count: 12, 
    image: 'https://picsum.photos/seed/panelpu/600/600', // Placeholder
    headerImage: 'https://images.unsplash.com/photo-1620626012053-93f56b5463f0?q=80&w=2070&auto=format&fit=crop',
    description: 'Tấm panel a cách nhiệt (Sandwich Panel) là vật liệu xây dựng 3 lớp gồm 2 mặt tôn và lớp lõi xốp (PU, EPS, XPS...). Dùng làm vách, trần, mái nhà, có khả năng cách nhiệt, cách âm, chống cháy hiệu quả.',
    bottomContent: `
      <div class="space-y-6 text-slate-700">
        <h2 class="text-2xl font-bold text-slate-900">Các loại tấm panel phổ biến năm 2026</h2>
        <p>Tấm ốp panel (hay còn gọi là sandwich panel) <span class="bg-yellow-200 px-1">là vật liệu xây dựng nhẹ gồm hai lớp mặt ngoài (thường là tôn mạ kẽm sơn tĩnh điện) và lớp lõi cách nhiệt ở giữa.</span></p>
        
        <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1000&auto=format&fit=crop" class="w-full rounded-xl my-4" alt="Thi công panel" />

        <h3 class="text-xl font-bold text-slate-900">1. Các loại tấm panel phổ biến năm 2026</h3>
        <p>Dựa trên vật liệu lõi, thị trường hiện nay có các dòng chính:</p>
        <ul class="list-disc pl-5 space-y-2">
           <li><strong>Panel EPS:</strong> Lõi xốp kích thích, giá thành rẻ nhất, trọng lượng siêu nhẹ.</li>
           <li><strong>Panel PU/PIR:</strong> Khả năng cách nhiệt và chống cháy vượt trội. Panel PIR là dòng cao cấp được ưu tiên.</li>
           <li><strong>Panel Rockwool/Glasswool:</strong> Lõi bông khoáng hoặc bông thủy tinh, có khả năng chống cháy tuyệt đối.</li>
        </ul>

        <h3 class="text-xl font-bold text-slate-900">2. Ưu điểm nổi bật</h3>
        <ul class="list-disc pl-5 space-y-2">
           <li><strong>Thi công siêu tốc:</strong> Lắp đặt theo hình thức lắp ghép, giúp rút ngắn 50% thời gian.</li>
           <li><strong>Tiết kiệm điện năng:</strong> Khả năng giữ nhiệt tốt giúp giảm chi phí điều hòa lên đến 30-40%.</li>
        </ul>
      </div>
    `
  },
  { 
    id: 'cat_2', 
    name: 'Tấm Ốp Lam Sóng', 
    slug: 'lam-song', 
    count: 18, 
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=600&auto=format&fit=crop',
    headerImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    description: 'Vẻ đẹp kiến trúc hiện đại với những đường vân sóng tinh tế. Giải pháp hoàn hảo cho vách tivi, trần nhà và không gian điểm nhấn.',
    bottomContent: `<p>Nội dung chi tiết cho Lam sóng...</p>`
  },
  { 
    id: 'cat_3', 
    name: 'PVC Vân Đá', 
    slug: 'pvc-stone', 
    count: 8, 
    image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=600&auto=format&fit=crop',
    headerImage: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=2070&auto=format&fit=crop',
    description: 'Sang trọng như đá tự nhiên, nhẹ hơn và tiết kiệm chi phí. Sự lựa chọn số 1 cho sảnh khách sạn, thang máy và vách tivi.',
    bottomContent: `<p>Nội dung chi tiết cho PVC Vân Đá...</p>`
  },
  { 
    id: 'cat_4', 
    name: 'Phụ Kiện Thi Công', 
    slug: 'accessories', 
    count: 25, 
    image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=600&auto=format&fit=crop',
    headerImage: 'https://images.unsplash.com/photo-1594222079361-9e6b3eb1cb64?q=80&w=2070&auto=format&fit=crop',
    description: 'Hệ thống phào chỉ, nẹp inox, keo dán chuyên dụng giúp hoàn thiện công trình.',
    bottomContent: `<p>Nội dung chi tiết cho phụ kiện...</p>`
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    databaseId: 101,
    slug: 'tam-panel-eps-sao-chep-1',
    name: 'Tấm Panel EPS (Sao chép)',
    brand: 'Đại Nam Premium',
    description: '',
    shortDescription: '',
    image: {
      sourceUrl: 'https://picsum.photos/seed/eps1/600/600',
      altText: 'Panel EPS',
    },
    galleryImages: [],
    price: { amount: 0, formatted: 'Liên hệ' },
    stockStatus: 'IN_STOCK',
    sku: 'EPS-001',
    categories: ['panel-pu'],
    dimensions: { length: 2000, width: 1000, thickness: 50, area: 2 }
  },
  {
    id: 'prod_2',
    databaseId: 102,
    slug: 'tam-panel-eps-sao-chep-2',
    name: 'Tấm Panel PU Cách Nhiệt',
    brand: 'Đại Nam Premium',
    description: '',
    shortDescription: '',
    image: {
      sourceUrl: 'https://picsum.photos/seed/eps2/600/600',
      altText: 'Panel PU',
    },
    galleryImages: [],
    price: { amount: 0, formatted: 'Liên hệ' },
    stockStatus: 'IN_STOCK',
    sku: 'PU-002',
    categories: ['panel-pu'],
    dimensions: { length: 2400, width: 1150, thickness: 75, area: 2.76 }
  },
  {
    id: 'prod_3',
    databaseId: 103,
    slug: 'tam-op-lam-song-3-song-thap',
    name: 'Lam Sóng 3 Sóng Thấp - Vân Gỗ',
    brand: 'Kosmos',
    description: '',
    shortDescription: '',
    image: {
      sourceUrl: 'https://picsum.photos/seed/woodpanel1/600/600',
      altText: 'Lam sóng',
    },
    galleryImages: [],
    price: { amount: 145000, formatted: '145.000₫' },
    stockStatus: 'IN_STOCK',
    sku: 'LS-001',
    categories: ['lam-song'],
    dimensions: { length: 3000, width: 200, thickness: 9, area: 0.6 }
  },
    {
    id: 'prod_4',
    databaseId: 104,
    slug: 'pvc-van-da',
    name: 'PVC Vân Đá Cẩm Thạch',
    brand: 'EuroMoulding',
    description: '',
    shortDescription: '',
    image: {
      sourceUrl: 'https://picsum.photos/seed/marble/600/600',
      altText: 'PVC Stone',
    },
    galleryImages: [],
    price: { amount: 320000, formatted: '320.000₫' },
    stockStatus: 'IN_STOCK',
    sku: 'PVC-001',
    categories: ['pvc-stone'],
    dimensions: { length: 2440, width: 1220, thickness: 3, area: 2.97 }
  },
];
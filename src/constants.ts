
import { Product, Category, BlogPost } from './types';

export const CATEGORIES: Category[] = [
  { 
    id: 'cat_1', 
    name: 'Panel Cách Nhiệt PU', 
    slug: 'panel-pu', 
    count: 12, 
    image: 'https://images.unsplash.com/photo-1620626012053-93f56b5463f0?q=80&w=600&auto=format&fit=crop',
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
      sourceUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=600&auto=format&fit=crop',
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
      sourceUrl: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=600&auto=format&fit=crop',
      altText: 'PVC Stone',
    },
    galleryImages: [],
    price: { amount: 320000, formatted: '320.000₫' },
    stockStatus: 'IN_STOCK',
    sku: 'PVC-001',
    categories: ['pvc-stone'],
    dimensions: { length: 2440, width: 1220, thickness: 3, area: 2.97 }
  },
  {
    id: 'prod_7',
    databaseId: 107,
    slug: 'phao-chi-ps-han-quoc',
    name: 'Phào Chỉ PS Hàn Quốc - Dát Vàng',
    brand: 'Younglim',
    description: '<p>Phào chỉ nhựa PS cốt đặc, họa tiết hoa văn dát vàng cổ điển.</p>',
    shortDescription: 'Cốt đặc, không mối mọt.',
    image: {
      sourceUrl: 'https://images.unsplash.com/photo-1594222079361-9e6b3eb1cb64?q=80&w=600&auto=format&fit=crop',
      altText: 'Moulding',
    },
    galleryImages: [],
    price: { amount: 85000, formatted: '85.000₫' },
    stockStatus: 'IN_STOCK',
    sku: 'PS-V02',
    categories: ['accessories'],
    dimensions: { length: 2400, width: 80, thickness: 20, area: 0 }
  },
  {
    id: 'prod_8',
    databaseId: 108,
    slug: 'nep-inox-304-vang-guong',
    name: 'Nẹp Inox 304 Chữ T - Vàng Gương',
    brand: 'Đại Nam Accessories',
    description: '<p>Nẹp trang trí Inox 304 mạ PVD cao cấp, dùng che khe nối tấm ốp.</p>',
    shortDescription: 'Inox 304 bền màu vĩnh viễn.',
    image: {
      sourceUrl: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=600&auto=format&fit=crop',
      altText: 'Stainless Steel Profile',
    },
    galleryImages: [],
    price: { amount: 45000, formatted: '45.000₫' },
    stockStatus: 'IN_STOCK',
    sku: 'INOX-T10',
    categories: ['accessories'],
    dimensions: { length: 2440, width: 10, thickness: 1, area: 0 }
  },
  {
    id: 'prod_9',
    databaseId: 109,
    slug: 'keo-dan-chuyen-dung-xbond',
    name: 'Keo Dán Đa Năng X-Bond',
    brand: 'Đại Nam Accessories',
    description: '<p>Keo dán xây dựng đa năng, độ bám dính cực cao, dùng dán tấm ốp lên tường.</p>',
    shortDescription: 'Siêu dính, chịu lực tốt.',
    image: {
      sourceUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600&auto=format&fit=crop',
      altText: 'Construction Adhesive',
    },
    galleryImages: [],
    price: { amount: 45000, formatted: '45.000₫' },
    stockStatus: 'IN_STOCK',
    sku: 'KEO-XB01',
    categories: ['accessories'],
    dimensions: { length: 0, width: 0, thickness: 0, area: 0 }
  },
  {
    id: 'prod_10',
    databaseId: 110,
    slug: 'nep-v-inox-vang-xuoc',
    name: 'Nẹp Góc V Inox - Vàng Xước',
    brand: 'Đại Nam Accessories',
    description: '<p>Nẹp V ốp góc tường, bảo vệ cạnh và tạo điểm nhấn sang trọng.</p>',
    shortDescription: 'Inox 304, chống va đập.',
    image: {
      sourceUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=600&auto=format&fit=crop',
      altText: 'V Profile Stainless Steel',
    },
    galleryImages: [],
    price: { amount: 65000, formatted: '65.000₫' },
    stockStatus: 'IN_STOCK',
    sku: 'INOX-V20',
    categories: ['accessories'],
    dimensions: { length: 2440, width: 20, thickness: 1, area: 0 }
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post_1',
    title: "5 Xu Hướng Ốp Tường Phòng Khách 'Lên Ngôi' Năm 2024",
    slug: "xu-huong-op-tuong-2024",
    excerpt: "Khám phá các phong cách thiết kế nội thất sử dụng tấm ốp than tre và lam sóng đang được các kiến trúc sư hàng đầu ưa chuộng.",
    content: `
      <p>Năm 2024 đánh dấu sự lên ngôi của các vật liệu thân thiện môi trường và có tính thẩm mỹ cao. Phòng khách không chỉ là nơi sinh hoạt chung mà còn là bộ mặt của gia chủ.</p>
      <h3>1. Phong cách Minimalist với Lam Sóng Trắng</h3>
      <p>Sự tối giản luôn có chỗ đứng vững chắc. Lam sóng trắng kết hợp với hệ thống đèn LED âm trần tạo nên không gian rộng mở, tinh tế.</p>
      <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200" alt="Minimalist Interior" class="rounded-xl w-full my-6" />
      <h3>2. Sang trọng với PVC Vân Đá Đối Xứng</h3>
      <p>Xu hướng Bookmatch (vân đá đối xứng) trước đây chỉ dành cho đá tự nhiên đắt đỏ nay đã có thể thực hiện dễ dàng với tấm ốp PVC tráng gương.</p>
      <h3>3. Vật liệu Than Tre - Bước tiến công nghệ</h3>
      <p>Khả năng uốn cong của tấm ốp đa năng sợi than tre cho phép tạo ra các góc bo tròn mềm mại, xóa bỏ sự cứng nhắc của các góc tường truyền thống.</p>
    `,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=1200&auto=format&fit=crop",
    category: "Xu Hướng",
    date: "15 Tháng 5, 2024",
    readTime: "5 phút đọc",
    author: {
      name: "KTS. Minh Hoàng",
      avatar: "https://ui-avatars.com/api/?name=Minh+Hoang&background=0284c7&color=fff",
      role: "Lead Architect"
    },
    tags: ["Nội thất", "Phòng khách", "2024"]
  },
  {
    id: 'post_2',
    title: "Hướng Dẫn Thi Công Tấm Ốp Nano Phẳng Chuẩn Kỹ Thuật",
    slug: "huong-dan-thi-cong-nano",
    excerpt: "Quy trình 6 bước thi công tấm ốp tường Nano giúp đảm bảo độ bền trên 20 năm, không bị bong tróc hay ẩm mốc.",
    content: "<p>Chi tiết hướng dẫn đang cập nhật...</p>",
    image: "https://images.unsplash.com/photo-1620626012053-93f56b5463f0?q=80&w=1200&auto=format&fit=crop",
    category: "Kỹ Thuật",
    date: "10 Tháng 5, 2024",
    readTime: "8 phút đọc",
    author: {
      name: "Trần Văn A",
      avatar: "https://ui-avatars.com/api/?name=Tran+A&background=eab308&color=fff",
      role: "Kỹ thuật viên"
    },
    tags: ["Thi công", "Tấm ốp Nano", "DIY"]
  },
  {
    id: 'post_3',
    title: "So Sánh Tấm Ốp Nhựa Và Gỗ Công Nghiệp: Nên Chọn Loại Nào?",
    slug: "so-sanh-nhua-va-go",
    excerpt: "Phân tích ưu nhược điểm về giá thành, độ bền, khả năng chống nước của hai loại vật liệu phổ biến nhất hiện nay.",
    content: "<p>Nội dung chi tiết...</p>",
    image: "https://images.unsplash.com/photo-1594222079361-9e6b3eb1cb64?q=80&w=1200&auto=format&fit=crop",
    category: "Tư Vấn",
    date: "02 Tháng 5, 2024",
    readTime: "6 phút đọc",
    author: {
      name: "Nguyễn Thu Hà",
      avatar: "https://ui-avatars.com/api/?name=Thu+Ha&background=f472b6&color=fff",
      role: "Content Writer"
    },
    tags: ["So sánh", "Vật liệu", "Tư vấn"]
  },
   {
    id: 'post_4',
    title: "Đại Nam Wall Vinh Dự Nhận Giải Thưởng Sao Vàng Đất Việt",
    slug: "dai-nam-nhan-giai-thuong",
    excerpt: "Cột mốc quan trọng khẳng định vị thế thương hiệu Việt trên thị trường vật liệu xây dựng nội địa và quốc tế.",
    content: "<p>Nội dung chi tiết...</p>",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop",
    category: "Tin Công Ty",
    date: "28 Tháng 4, 2024",
    readTime: "3 phút đọc",
    author: {
      name: "Ban Biên Tập",
      avatar: "https://ui-avatars.com/api/?name=BBT&background=0f172a&color=fff",
      role: "Admin"
    },
    tags: ["Sự kiện", "Giải thưởng"]
  }
];

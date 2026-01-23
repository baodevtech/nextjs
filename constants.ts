import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'cat_1', name: 'Tấm Ốp Lam Sóng', slug: 'lam-song', count: 12, image: 'https://picsum.photos/seed/fluted/400/500' },
  { id: 'cat_2', name: 'Tấm Ốp Nano', slug: 'nano', count: 18, image: 'https://picsum.photos/seed/nano/400/500' },
  { id: 'cat_3', name: 'PVC Vân Đá', slug: 'pvc-stone', count: 8, image: 'https://picsum.photos/seed/stone/400/500' },
  { id: 'cat_4', name: 'Phào Chỉ & Nẹp', slug: 'accessories', count: 25, image: 'https://picsum.photos/seed/molding/400/500' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    databaseId: 101,
    slug: 'tam-op-lam-song-3-song-thap-van-go',
    name: 'Lam Sóng 3 Sóng Thấp - Vân Gỗ Sồi',
    description: '<p><strong>Tấm ốp lam sóng 3 sóng thấp</strong> mang lại vẻ đẹp hiện đại, sang trọng cho không gian nội thất. Sản phẩm được sản xuất từ nhựa nguyên sinh cốt trắng, an toàn cho sức khỏe.</p><ul><li>Chống ẩm mốc, mối mọt tuyệt đối</li><li>Dễ dàng thi công lắp đặt</li><li>Bề mặt phủ film Nano chống trầy xước</li></ul>',
    shortDescription: 'Lam sóng 3 sóng thấp, vân gỗ tự nhiên, cốt nhựa nguyên sinh.',
    image: {
      sourceUrl: 'https://picsum.photos/seed/woodpanel1/600/600',
      altText: 'Lam sóng 3 sóng thấp vân gỗ',
    },
    galleryImages: [
      { sourceUrl: 'https://picsum.photos/seed/woodpanel2/600/600', altText: 'Chi tiết vân gỗ' },
      { sourceUrl: 'https://picsum.photos/seed/woodpanel3/600/600', altText: 'Phối cảnh phòng khách' },
    ],
    price: { amount: 145000, formatted: '145.000₫' }, // Giá theo thanh
    stockStatus: 'IN_STOCK',
    sku: 'LS-3S-001',
    categories: ['lam-song'],
    dimensions: { length: 3000, width: 200, thickness: 9, area: 0.6 } // 0.6 m2 per panel
  },
  {
    id: 'prod_2',
    databaseId: 102,
    slug: 'tam-op-nano-phang-van-da-may',
    name: 'Tấm Ốp Nano Phẳng - Vân Đá Mây',
    description: '<p>Tấm ốp Nano dạng phẳng với họa tiết vân đá mây nhẹ nhàng, tinh tế. Giải pháp thay thế hoàn hảo cho đá tự nhiên với chi phí thấp hơn và trọng lượng nhẹ hơn.</p>',
    shortDescription: 'Tấm ốp phẳng Nano, họa tiết vân đá mây sang trọng.',
    image: {
      sourceUrl: 'https://picsum.photos/seed/nanostone/600/600',
      altText: 'Tấm ốp Nano vân đá',
    },
    galleryImages: [],
    price: { amount: 120000, formatted: '120.000₫' },
    stockStatus: 'IN_STOCK',
    sku: 'NANO-002',
    categories: ['nano'],
    dimensions: { length: 3000, width: 400, thickness: 9, area: 1.2 }
  },
  {
    id: 'prod_3',
    databaseId: 103,
    slug: 'pvc-van-da-cam-thach',
    name: 'Tấm PVC Vân Đá Cẩm Thạch Trắng',
    description: '<p>Tấm nhựa PVC vân đá cẩm thạch tráng gương. Độ bóng cao, bề mặt cứng cáp, chịu lực tốt. Phù hợp ốp vách tivi, sảnh khách sạn, quầy lễ tân.</p>',
    shortDescription: 'PVC vân đá tráng gương, độ bóng cao.',
    image: {
      sourceUrl: 'https://picsum.photos/seed/marble/600/600',
      altText: 'PVC vân đá cẩm thạch',
    },
    galleryImages: [],
    price: { amount: 350000, formatted: '350.000₫' }, // Giá theo tấm
    stockStatus: 'IN_STOCK',
    sku: 'PVC-003',
    categories: ['pvc-stone'],
    dimensions: { length: 2440, width: 1220, thickness: 3, area: 2.97 } // Kích thước tiêu chuẩn 1.22x2.44m
  },
  {
    id: 'prod_4',
    databaseId: 104,
    slug: 'lam-song-4-song-cao-go-oc-cho',
    name: 'Lam Sóng 4 Sóng Cao - Gỗ Óc Chó',
    description: '<p>Lam sóng 4 sóng cao tạo hiệu ứng 3D mạnh mẽ. Màu gỗ óc chó trầm ấm, đẳng cấp, phù hợp với phong cách nội thất Luxury.</p>',
    shortDescription: 'Lam 4 sóng cao, màu gỗ óc chó trầm ấm.',
    image: {
      sourceUrl: 'https://picsum.photos/seed/walnut/600/600',
      altText: 'Lam sóng 4 sóng cao',
    },
    galleryImages: [],
    price: { amount: 165000, formatted: '165.000₫' },
    stockStatus: 'IN_STOCK',
    sku: 'LS-4S-004',
    categories: ['lam-song'],
    dimensions: { length: 3000, width: 160, thickness: 25, area: 0.48 }
  },
  {
    id: 'prod_5',
    databaseId: 105,
    slug: 'nep-v-inox-vang-guong',
    name: 'Nẹp V Inox 304 - Vàng Gương',
    description: '<p>Nẹp V Inox 304 mạ PVD màu vàng gương cao cấp. Dùng để bo góc cột, góc tường, bảo vệ mép tấm ốp và tạo điểm nhấn trang trí.</p>',
    shortDescription: 'Nẹp V Inox 304 mạ vàng gương cao cấp.',
    image: {
      sourceUrl: 'https://picsum.photos/seed/goldtrim/600/600',
      altText: 'Nẹp V Inox vàng',
    },
    galleryImages: [],
    price: { amount: 85000, formatted: '85.000₫' },
    stockStatus: 'IN_STOCK',
    sku: 'NEP-V-005',
    categories: ['accessories'],
    dimensions: { length: 2440, width: 20, thickness: 1, area: 0 } // Area 0 for accessories
  },
  {
    id: 'prod_6',
    databaseId: 106,
    slug: 'tam-op-da-nang-soi-than-tre',
    name: 'Tấm Ốp Đa Năng Sợi Than Tre - Vân Kim Loại',
    description: '<p>Dòng sản phẩm cao cấp nhất hiện nay. Cốt sợi than tre an toàn tuyệt đối, có khả năng uốn cong, soi rãnh gấp góc. Bề mặt vân kim loại xước hiện đại.</p>',
    shortDescription: 'Cốt than tre uốn cong, vân kim loại xước.',
    image: {
      sourceUrl: 'https://picsum.photos/seed/bamboo/600/600',
      altText: 'Tấm ốp than tre',
    },
    galleryImages: [],
    price: { amount: 450000, formatted: '450.000₫' },
    stockStatus: 'OUT_OF_STOCK',
    sku: 'TT-006',
    categories: ['nano'],
    dimensions: { length: 2800, width: 1220, thickness: 8, area: 3.41 }
  }
];
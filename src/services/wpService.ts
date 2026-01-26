import { Product, Category } from '../types';
import { PRODUCTS, CATEGORIES } from '../constants'; // Import Mock data làm fallback

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://demo.vietpanel.com/graphql';

/**
 * FETCH HELPER
 * Hàm dùng chung để gọi API có xử lý lỗi (try-catch)
 */
async function fetchAPI(query: string, { variables }: { variables?: any } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 } // Revalidate mỗi 60s
    });

    const json = await res.json();
    if (json.errors) {
      console.error("❌ WP GraphQL Error:", json.errors);
      // Trả về null thay vì throw error để tránh sập toàn bộ trang
      return null;
    }
    return json.data;
  } catch (error) {
    console.error("❌ Fetch API Error:", error);
    return null;
  }
}

// --- 1. PRODUCT QUERIES & TRANSFORMERS ---

// Query phiên bản rút gọn: Bỏ bớt các field ACF ảnh dễ gây lỗi
const PRODUCT_FIELDS = `
  fragment ProductFields on Product {
    id
    databaseId
    slug
    name
    sku
    shortDescription
    description
    ... on SimpleProduct {
      price(format: RAW)
      regularPrice(format: RAW)
      stockStatus
    }
    ... on VariableProduct {
      price(format: RAW)
      regularPrice(format: RAW)
      stockStatus
    }
    # Lấy ảnh đại diện native của Woo (Thường an toàn)
    image {
      sourceUrl
      altText
    }
    # Lấy gallery native của Woo
    galleryImages {
      nodes {
        sourceUrl
        altText
      }
    }
    productCategories {
      nodes {
        slug
        name
      }
    }
    # ACF Text/Number Fields (Thường an toàn)
    productSpecifications {
      brand
      length
      width
      thickness
      area
    }
  }
`;

// Hàm chuyển đổi dữ liệu từ WP sang cấu trúc Frontend
const mapProduct = (node: any): Product => {
  if (!node) return {} as Product;
  
  const rawPrice = node.price ? parseFloat(node.price.replace(/[^0-9.]/g, '')) : 0;
  
  return {
    id: node.id,
    databaseId: node.databaseId,
    slug: node.slug,
    name: node.name,
    // Fallback giá trị mặc định nếu ACF chưa có dữ liệu
    brand: node.productSpecifications?.brand || 'Đại Nam Wall',
    description: node.description || '',
    shortDescription: node.shortDescription || '',
    image: {
      sourceUrl: node.image?.sourceUrl || 'https://via.placeholder.com/600x600?text=No+Image',
      altText: node.image?.altText || node.name,
    },
    galleryImages: node.galleryImages?.nodes?.map((img: any) => ({
      sourceUrl: img.sourceUrl,
      altText: img.altText || node.name
    })) || [],
    price: {
      amount: rawPrice,
      formatted: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rawPrice)
    },
    stockStatus: node.stockStatus === 'IN_STOCK' ? 'IN_STOCK' : 'OUT_OF_STOCK',
    sku: node.sku || '',
    categories: node.productCategories?.nodes?.map((c: any) => c.slug) || [],
    dimensions: {
      length: Number(node.productSpecifications?.length) || 0,
      width: Number(node.productSpecifications?.width) || 0,
      thickness: Number(node.productSpecifications?.thickness) || 0,
      area: Number(node.productSpecifications?.area) || 0,
    }
  };
};

export const getProducts = async (): Promise<Product[]> => {
  const data = await fetchAPI(`
    ${PRODUCT_FIELDS}
    query GetProducts {
      products(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          ...ProductFields
        }
      }
    }
  `);
  
  // Nếu API lỗi hoặc không có dữ liệu, trả về Mock Data để UI không bị trống
  if (!data || !data.products) {
      console.warn("⚠️ Không lấy được Products từ API, đang dùng Mock Data.");
      return PRODUCTS; 
  }
  
  return data.products.nodes.map(mapProduct);
};

export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  const data = await fetchAPI(`
    ${PRODUCT_FIELDS}
    query GetProductBySlug($slug: ID!) {
      product(id: $slug, idType: SLUG) {
        ...ProductFields
      }
    }
  `, { variables: { slug } });

  if (!data?.product) return undefined;
  return mapProduct(data.product);
};

// --- 2. CATEGORY QUERIES & TRANSFORMERS ---

const mapCategory = (node: any): Category => {
  return {
    id: node.id,
    name: node.name,
    slug: node.slug,
    count: node.count || 0,
    image: node.image?.sourceUrl || 'https://via.placeholder.com/400x400?text=Category',
    description: node.description,
    // Tạm thời comment phần ACF Image của Category để tránh lỗi ConnectionEdge
    // headerImage: node.categoryExtras?.headerImage?.sourceUrl, 
    // bottomContent: node.categoryExtras?.bottomContent,
  };
};

export const getCategories = async (): Promise<Category[]> => {
  const data = await fetchAPI(`
    query GetCategories {
      productCategories(first: 20, where: { hideEmpty: true, parent: 0 }) {
        nodes {
          id
          name
          slug
          count
          description
          image {
            sourceUrl
          }
          # Tạm thời bỏ categoryExtras.headerImage ở đây để fix lỗi
          # categoryExtras {
          #   bottomContent
          # }
        }
      }
    }
  `);

  if (!data || !data.productCategories) {
      console.warn("⚠️ Không lấy được Categories từ API, đang dùng Mock Data.");
      return CATEGORIES;
  }

  return data.productCategories.nodes.map(mapCategory);
};
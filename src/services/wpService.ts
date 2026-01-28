import { Product, Category } from '../types';
import { PRODUCTS, CATEGORIES } from '../constants'; // Import Mock data làm fallback

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://portal.khopanel.com/graphql';

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
      return null;
    }
    return json.data;
  } catch (error) {
    console.error("❌ Fetch API Error:", error);
    return null;
  }
}

// --- 1. PRODUCT QUERIES & TRANSFORMERS ---

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
    image {
      sourceUrl
      altText
    }
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
    # --- CẬP NHẬT: Taxonomy product_brand ---
    # Trong WPGraphQL, product_brand thường chuyển thành productBrands
    productBrands {
      nodes {
        name
        slug
      }
    }
    # --- ACF Fields ---
    productSpecifications {
      length
      width
      thickness
      area
      origin
      surface
      warranty
    }
  }
`;

// Hàm chuyển đổi dữ liệu từ WP sang cấu trúc Frontend
const mapProduct = (node: any): Product => {
  if (!node) return {} as Product;
  
  const rawPrice = node.price ? parseFloat(node.price.replace(/[^0-9.]/g, '')) : 0;
  
  // Xử lý Brand: Lấy item đầu tiên từ productBrands
  const brandName = node.productBrands?.nodes && node.productBrands.nodes.length > 0 
    ? node.productBrands.nodes[0].name 
    : 'Đại Nam Wall'; // Fallback nếu không có brand

  return {
    id: node.id,
    databaseId: node.databaseId,
    slug: node.slug,
    name: node.name,
    brand: brandName, // Dữ liệu từ Taxonomy product_brand
    origin: node.productSpecifications?.origin || '',
    surface: node.productSpecifications?.surface || '',
    warranty: node.productSpecifications?.warranty || '',
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
  
  // Nếu API lỗi hoặc không có dữ liệu, dùng Mock Data để không sập trang
  if (!data || !data.products) {
      console.warn("⚠️ Không lấy được Products từ API (đang dùng Mock Data). Hãy kiểm tra lại tên trường trong GraphiQL.");
      return PRODUCTS as unknown as Product[]; 
  }
  
  return data.products.nodes.map(mapProduct);
};
// 1. Interface cho Shop Settings
export interface ShopSettings {
  description: string;
  benefits: {
    warranty: { icon: string; heading: string; subHeading: string };
    shipping: { icon: string; heading: string; subHeading: string };
    variety:  { icon: string; heading: string; subHeading: string };
  }
}

// 2. Hàm lấy dữ liệu trang Shop (Giả sử trang Shop có slug là 'cua-hang' hoặc 'shop')
export const getShopSettings = async (): Promise<ShopSettings | null> => {
  const data = await fetchAPI(`
    query GetShopSettings {
      options {
        shopSettings {
          shopDescription
          benefitWarranty {
            heading
            subHeading
            icon { node { sourceUrl } }
          }
          benefitShipping {
            heading
            subHeading
            icon { node { sourceUrl } }
          }
          benefitVariety {
            heading
            subHeading
            icon { node { sourceUrl } }
          }
        }
      }
    }
  `);

  const settings = data?.options?.shopSettings;
  if (!settings) return null;

  return {
    description: settings.shopDescription || '',
    benefits: {
      warranty: {
        heading: settings.benefitWarranty?.heading || '',
        subHeading: settings.benefitWarranty?.subHeading || '',
        icon: settings.benefitWarranty?.icon?.node?.sourceUrl || '',
      },
      shipping: {
        heading: settings.benefitShipping?.heading || '',
        subHeading: settings.benefitShipping?.subHeading || '',
        icon: settings.benefitShipping?.icon?.node?.sourceUrl || '',
      },
      variety: {
        heading: settings.benefitVariety?.heading || '',
        subHeading: settings.benefitVariety?.subHeading || '',
        icon: settings.benefitVariety?.icon?.node?.sourceUrl || '',
      },
    },
  };
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

// --- 2. CATEGORY QUERIES (Giữ nguyên, tạm ẩn ACF Image để an toàn) ---

// 1. Cập nhật hàm mapCategory
const mapCategory = (node: any): Category => {
  return {
    id: node.id,
    name: node.name,
    slug: node.slug,
    count: node.count || 0,
    image:
      node.image?.sourceUrl ||
      'https://via.placeholder.com/400x400?text=Category',
    description: node.description,
    headerImage:
      node.categoryExtras?.headerImage?.node?.sourceUrl ||
      node.image?.sourceUrl ||
      '',
    bottomContent: node.categoryExtras?.bottomContent || '',
    trendHeader: node.categoryExtras?.trendHeader || '',
    trendContent: node.categoryExtras?.trendContent || '',
    warrantyMonths: node.categoryExtras?.warrantyMonths || 0,
  };
};


// 2. Cập nhật câu Query GetCategories
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
          # --- THÊM PHẦN NÀY (Yêu cầu cài WPGraphQL ACF) ---
          categoryExtras {
            headerImage {
              node {
                sourceUrl
              }
            }
            bottomContent
            trendHeader
            trendContent
            warrantyMonths
          }
        }
      }
    }
  `);

  if (!data || !data.productCategories) {
      console.warn("⚠️ Không lấy được Categories từ API (đang dùng Mock Data).");
      return CATEGORIES;
  }

  return data.productCategories.nodes.map(mapCategory);
};
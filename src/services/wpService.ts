import {
  Product,
  Category,
  HomeSettings,
  HeroSlide,
  SignatureTab,
  ShopLookItem,
  AccessoryHighlight,
  QualityLargeCard,
  QualitySmallCard,
  BlogPost,
  Project,
} from "../types";
import { PRODUCTS, CATEGORIES } from "../constants"; // Import Mock data làm fallback

const API_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://portal.khopanel.com/graphql";

/**
 * FETCH HELPER
 * Hàm dùng chung để gọi API có xử lý lỗi (try-catch)
 */
async function fetchAPI(
  query: string,
  { variables }: { variables?: any } = {},
) {
  const headers = { "Content-Type": "application/json" };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 }, // Revalidate mỗi 60s
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

  const rawPrice = node.price
    ? parseFloat(node.price.replace(/[^0-9.]/g, ""))
    : 0;

  // Xử lý Brand: Lấy item đầu tiên từ productBrands
  const brandName =
    node.productBrands?.nodes && node.productBrands.nodes.length > 0
      ? node.productBrands.nodes[0].name
      : "Đại Nam Wall"; // Fallback nếu không có brand

  return {
    id: node.id,
    databaseId: node.databaseId,
    slug: node.slug,
    name: node.name,
    brand: brandName, // Dữ liệu từ Taxonomy product_brand
    origin: node.productSpecifications?.origin || "",
    surface: node.productSpecifications?.surface || "",
    warranty: node.productSpecifications?.warranty || "",
    description: node.description || "",
    shortDescription: node.shortDescription || "",
    image: {
      sourceUrl:
        node.image?.sourceUrl ||
        "https://via.placeholder.com/600x600?text=No+Image",
      altText: node.image?.altText || node.name,
    },
    galleryImages:
      node.galleryImages?.nodes?.map((img: any) => ({
        sourceUrl: img.sourceUrl,
        altText: img.altText || node.name,
      })) || [],
    price: {
      amount: rawPrice,
      formatted: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(rawPrice),
    },
    stockStatus: node.stockStatus === "IN_STOCK" ? "IN_STOCK" : "OUT_OF_STOCK",
    sku: node.sku || "",
    categories: node.productCategories?.nodes?.map((c: any) => c.slug) || [],
    dimensions: {
      length: Number(node.productSpecifications?.length) || 0,
      width: Number(node.productSpecifications?.width) || 0,
      thickness: Number(node.productSpecifications?.thickness) || 0,
      area: Number(node.productSpecifications?.area) || 0,
    },
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
    console.warn(
      "⚠️ Không lấy được Products từ API (đang dùng Mock Data). Hãy kiểm tra lại tên trường trong GraphiQL.",
    );
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
    variety: { icon: string; heading: string; subHeading: string };
  };
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
    description: settings.shopDescription || "",
    benefits: {
      warranty: {
        heading: settings.benefitWarranty?.heading || "",
        subHeading: settings.benefitWarranty?.subHeading || "",
        icon: settings.benefitWarranty?.icon?.node?.sourceUrl || "",
      },
      shipping: {
        heading: settings.benefitShipping?.heading || "",
        subHeading: settings.benefitShipping?.subHeading || "",
        icon: settings.benefitShipping?.icon?.node?.sourceUrl || "",
      },
      variety: {
        heading: settings.benefitVariety?.heading || "",
        subHeading: settings.benefitVariety?.subHeading || "",
        icon: settings.benefitVariety?.icon?.node?.sourceUrl || "",
      },
    },
  };
};

export const getProductBySlug = async (
  slug: string,
): Promise<Product | undefined> => {
  const data = await fetchAPI(
    `
    ${PRODUCT_FIELDS}
    query GetProductBySlug($slug: ID!) {
      product(id: $slug, idType: SLUG) {
        ...ProductFields
      }
    }
  `,
    { variables: { slug } },
  );

  if (!data?.product) return undefined;
  return mapProduct(data.product);
};

// 1. Cập nhật hàm mapCategory
const mapCategory = (node: any): Category => {
  return {
    id: node.id,
    name: node.name,
    slug: node.slug,
    count: node.count || 0,
    image:
      node.image?.sourceUrl ||
      "https://via.placeholder.com/400x400?text=Category",
    description: node.description,
    headerImage:
      node.categoryExtras?.headerImage?.node?.sourceUrl ||
      node.image?.sourceUrl ||
      "",
    bottomContent: node.categoryExtras?.bottomContent || "",
    trendHeader: node.categoryExtras?.trendHeader || "",
    trendContent: node.categoryExtras?.trendContent || "",
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

// Hàm map dữ liệu từ Raw GraphQL sang Interface
const mapHeroSlides = (acfData: any): HeroSlide[] => {
  if (!acfData?.heroSlides) return [];

  return acfData.heroSlides.map((slide: any, index: number) => ({
    id: index + 1,
    subtitle: slide.subtitle || "",
    title: slide.title || "",
    description: slide.description || "",
    image: slide.image?.node?.sourceUrl ?? "",
    ctaLink: slide.ctaLink || "/shop",
    ctaText: slide.ctaText || "Khám Phá Ngay",
    productLink: slide.productLink || [],
    // Map Hotspots (Repeater lồng nhau)
    hotspots: slide.hotspots
      ? slide.hotspots.map((h: any) => ({
          x: h.x || "50%",
          y: h.y || "50%",
          name: h.name || "",
          price: h.price || "",
          position: h.position || "left",
          link: h.link || "",
          nofollow: h.isNofollow || false,
        }))
      : [],
  }));
};
const mapAcfProducts = (nodes: any[]): Product[] => {
  if (!Array.isArray(nodes)) return [];
  return nodes.map((node) => mapProduct(node)); // Tận dụng hàm mapProduct có sẵn
};
// Helper Map Shop Look
// Helper Map Shop Look (PHIÊN BẢN AN TOÀN NHẤT)
// Helper Map Shop Look (PHIÊN BẢN DEBUG & NỚI LỎNG)
// Helper Map Shop Look (ĐÃ FIX THEO CẤU TRÚC LOG)
const mapShopLookItems = (items: any[]): ShopLookItem[] => {
  // console.log("🔍 [ShopLook] Raw Items:", items); // Debug

  if (!items) return [];
  
  return items.map((item, index) => {
    // [FIX] Lấy sản phẩm đầu tiên trong mảng nodes của trường 'products'
    const productNode = item.products?.nodes?.[0];

    if (!productNode) {
        // console.warn(`⚠️ [ShopLook] Item ${index} chưa chọn sản phẩm.`);
        return null;
    }

    const product = mapProduct(productNode);
    
    // Kiểm tra dữ liệu sản phẩm hợp lệ
    if (!product || !product.id) {
        return null; 
    }

    return {
      id: index,
      x: parseFloat(item.x) || 50,
      y: parseFloat(item.y) || 50,
      product: product
    };
  })
  .filter((item): item is ShopLookItem => item !== null);
};
const getSingleImage = (field: any) => {
  if (!field) return '';
  // Trường hợp 1: Trả về trực tiếp (thường gặp ở bản mới)
  if (field.sourceUrl) return field.sourceUrl;
  // Trường hợp 2: Trả về qua node
  if (field.node?.sourceUrl) return field.node.sourceUrl;
  // Trường hợp 3: Fallback nếu lỡ nó là mảng
  if (field.edges?.[0]?.node?.sourceUrl) return field.edges[0].node.sourceUrl;
  
  return '';
};

// Helper Map Accesssory Highlights
const mapAccHighlights = (items: any[]): AccessoryHighlight[] => {
  if (!items) return [];
  return items.map((item, idx) => ({
    id: idx,
    title: item.title || '',
    subtitle: item.subtitle || '',
    image: getSingleImage(item.image), // Dùng lại helper getSingleImage
    link: item.link || '/shop'
  }));
};
// Helper Map Bài viết
const mapBlogPosts = (nodes: any[]): BlogPost[] => {
  if (!nodes) return [];
  return nodes.map((node) => {
    const date = new Date(node.date);
    const formattedDate = new Intl.DateTimeFormat('vi-VN').format(date);
    const cleanExcerpt = node.excerpt ? node.excerpt.replace(/<[^>]+>/g, '') : '';

    return {
      id: node.id,
      title: node.title || '',
      slug: node.slug || '',
      excerpt: cleanExcerpt,
      content: node.content || '', // [MỚI] Lấy nội dung HTML
      date: formattedDate,
      image: node.featuredImage?.node?.sourceUrl || 'https://via.placeholder.com/800x600?text=No+Image',
      category: node.categories?.nodes?.[0]?.name || 'Tin tức',
      author: {
        name: node.author?.node?.name || 'Admin',
        avatar: node.author?.node?.avatar?.url || ''
      },
      tags: node.tags?.nodes?.map((t: any) => t.name) || [],
    };
  });
};
// 1. Lấy tất cả bài viết (Cho trang /blog)
export const getAllPosts = async (): Promise<BlogPost[]> => {
  const data = await fetchAPI(`
    query GetAllPosts {
      posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          slug
          date
          excerpt
          content
          featuredImage {
            node { sourceUrl }
          }
          categories {
            nodes { name, slug }
          }
          tags { 
            nodes { name, slug }
          }
          author {
            node { name, avatar { url } }
          }
        }
      }
    }
  `);
  return mapBlogPosts(data?.posts?.nodes || []);
};

// 2. Lấy chi tiết 1 bài viết theo Slug (Cho trang /blog/[slug])
export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const data = await fetchAPI(`
    query GetPostBySlug($id: ID!) {
      post(id: $id, idType: SLUG) {
        id
        title
        slug
        date
        excerpt
        content
        featuredImage {
          node { sourceUrl }
        }
        categories {
          nodes { name, slug }
        }
        # [QUAN TRỌNG] Thêm đoạn này để lấy Tags
        tags {
          nodes { name, slug }
        }
        author {
          node { name, avatar { url } }
        }
      }
    }
  `, { variables: { id: slug } });

  if (!data?.post) return null;
  const posts = mapBlogPosts([data.post]);
  return posts[0];
};
// [CẬP NHẬT] Map Projects
const mapProjects = (nodes: any[]): Project[] => {
  if (!nodes) return [];
  return nodes.map((node) => {
    // Lấy dữ liệu từ nhóm ACF 'projectFields'
    const acf = node.projectFields || {}; 
    const firstCat = node.categories?.nodes?.[0];

    // Xử lý Excerpt: Loại bỏ thẻ HTML <p>, <br> thừa
    const cleanExcerpt = node.excerpt 
        ? node.excerpt.replace(/<[^>]+>/g, '').trim() 
        : '';

    return {
      id: node.id,
      title: node.title || '',
      slug: node.slug || '',
      image: node.featuredImage?.node?.sourceUrl || 'https://via.placeholder.com/800x600',
      category: firstCat?.name || 'Dự án',
      categorySlug: firstCat?.slug || 'other', 
      
      // [THAY ĐỔI] Lấy từ Excerpt mặc định của WP
      desc: cleanExcerpt, 

      // Các trường ACF còn lại (Vẫn giữ nguyên)
      location: acf.location || 'Việt Nam',
      year: acf.completionYear || '2024',
      area: acf.area || '---',
      
      tags: node.tags?.nodes?.map((t: any) => t.name) || []
    };
  });
};

// [CẬP NHẬT] Hàm query GraphQL
export const getAllProjects = async (): Promise<Project[]> => {
  const data = await fetchAPI(`
    query GetAllProjects {
      projects(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          slug
          
          # [MỚI] Lấy mô tả ngắn mặc định của WordPress
          excerpt
          
          featuredImage {
            node { sourceUrl }
          }
          categories {
            nodes { name, slug }
          }
          tags {
            nodes { name }
          }
          
          # ACF Fields (Đã bỏ shortDesc)
          projectFields {
             location
             completionYear
             area
          }
        }
      }
    }
  `);
  return mapProjects(data?.projects?.nodes || []);
};
// Helper Map Chi Tiết Dự Án
const mapProjectDetail = (node: any): Project => {
  if (!node) return {} as Project;
  
  const acf = node.projectFields || {};
  const firstCat = node.categories?.nodes?.[0];

  // [SỬA LỖI 2] Xử lý Gallery: Phải map qua .nodes
  const galleryImages = acf.albumImg?.nodes 
    ? acf.albumImg.nodes.map((img: any) => img.sourceUrl) 
    : [];
  
  // Nếu gallery trống, fallback bằng ảnh đại diện
  if (galleryImages.length === 0 && node.featuredImage) {
      galleryImages.push(node.featuredImage.node.sourceUrl);
  }

  // Xử lý Materials
  const materialsList = acf.materials 
    ? acf.materials.split(/\r?\n|,/).map((s: string) => s.trim()).filter(Boolean)
    : ['Đang cập nhật'];

  // Xử lý Excerpt
  const cleanExcerpt = node.excerpt 
    ? node.excerpt.replace(/<[^>]+>/g, '').trim() 
    : '';

  return {
    id: node.id,
    title: node.title || '',
    slug: node.slug || '',
    image: node.featuredImage?.node?.sourceUrl || '',
    
    category: firstCat?.name || 'Dự án',
    categorySlug: firstCat?.slug || 'other',
    subtitle: firstCat?.name || 'Chi tiết dự án',

    // ACF Fields
    location: acf.location || 'Việt Nam',
    year: acf.completionYear || '2024',
    area: acf.area || '---',
    desc: cleanExcerpt,
    
    // Các trường chi tiết
    architect: acf.architect || 'Đại Nam Wall Team',
    client: acf.client || 'Khách hàng',
    challenge: acf.challenge || 'Đang cập nhật nội dung...',
    solution: acf.solution || 'Đang cập nhật nội dung...',
    materials: materialsList,
    gallery: galleryImages,
    
    tags: node.tags?.nodes?.map((t: any) => t.name) || []
  };
};

// [CẬP NHẬT] Query Lấy 1 Dự án theo Slug (SỬA LỖI 1 & 2)
export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  // [SỬA LỖI 1] Thay vì query 'project', ta query 'projects' và lọc 'where: { name: $slug }'
  // 'name' trong bộ lọc chính là slug của bài viết
  const data = await fetchAPI(`
    query GetProjectBySlug($slug: String!) {
      projects(first: 1, where: { name: $slug }) {
        nodes {
          id
          title
          slug
          excerpt
          featuredImage { node { sourceUrl } }
          categories { nodes { name, slug } }
          tags { nodes { name } }
          
          projectFields {
             location
             completionYear
             area
             architect
             client
             challenge
             solution
             materials
             
             # [SỬA LỖI 2] Gallery phải có 'nodes'
             albumImg {
                nodes {
                  sourceUrl
                }
             }
          }
        }
      }
    }
  `, { variables: { slug: slug } });

  // Lấy phần tử đầu tiên trong mảng nodes
  const projectNode = data?.projects?.nodes?.[0];
  
  if (!projectNode) return null;
  return mapProjectDetail(projectNode);
};
// Hàm lấy dữ liệu trang chủ
export const getHomeData = async (): Promise<HomeSettings> => {
  const data = await fetchAPI(`
    ${PRODUCT_FIELDS}
    query GetHomePageData {
      page(id: "/", idType: URI) {
        homeSettings {
          
          # --- HERO SECTION ---
          heroSlides {
            subtitle, title, description, ctaLink, ctaText
            image { node { sourceUrl } }
            hotspots { x, y, name, price, position, link, isNofollow }
          }

          # --- CATEGORY SECTION ---
          categoryHeadingNormal
          categoryHeadingHighlight
          categorySubheading
          catalogueText
          enableCatNofollow

          # --- SIGNATURE SECTION ---
          signatureHeadingNormal
          signatureHeadingHighlight
          signatureDesc
          signatureTabs {
            tabName
            products {
              nodes {
                ... on Product { ...ProductFields }
              }
            }
          }

          # --- SHOP THE LOOK (FIXED) ---
          shopLookHeading
          shopLookSubheading
          
          # [FIX 1] Query ảnh đơn lẻ (thường trả về node hoặc trực tiếp MediaItem)
          shopLookImage {
             node { sourceUrl }
          }
          
          shopLookItems {
            x
            y
            # [FIX 2] Bỏ cấp 'nodes' vì Post Object trả về 1 Item trực tiếp
            products {
                nodes {             
                ... on Product {
                  ...ProductFields
                }
              }
            }
          }
            
        # --- ACCESSORIES SECTION ---
          accessoryHighlights {
             title
             subtitle
             link
             image { node { sourceUrl } }
          }
          accViewAll {
             viewAllText
             viewAllSub
             viewAllLink
          }
          headNormal
          headHighlight
          phuKienSub
          accProdHeading
          accessoryProducts {
            nodes {
              ... on Product {
                ...ProductFields
              }
            }
          }
         # --- QUALITY SECTION ---
          qualityHeading
          qualitySubheading
          
          qualityLarge {
            title
            description
            icon { node { sourceUrl } }
            image { node { sourceUrl } }
            tags { text }
          }
          
            qualitySmall {
              title
              description
              icon { node { sourceUrl } }
            }
          }
        }
        # --- [MỚI] QUERY BÀI VIẾT (Nằm ngoài page, ngang hàng với page) ---
        posts(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          slug
          date
          excerpt
          featuredImage {
            node { sourceUrl }
          }
          categories {
            nodes { name, slug }
          }
          author {
            node {
              name
              avatar { url }
            }
          }
        }
      }
    }
  `);

  const settings = data?.page?.homeSettings;
  const acfData = settings || {};
  const postsData = data?.posts?.nodes || [];
  // Helper cũ dùng cho gallery/icon (giữ nguyên nếu các phần khác vẫn dùng)
  const getArrayImg = (field: any) => field?.edges?.[0]?.node?.sourceUrl || '';
  const getImg = (field: any) => field?.node?.sourceUrl || ''; // Helper nhanh cho field group/repeater
  // Map Signature Tabs (Giữ nguyên)
  const mapSignatureTabs = (tabsData: any[]): SignatureTab[] => {
    if (!tabsData) return [];
    return tabsData.map((tab, idx) => ({
      id: idx,
      name: tab.tabName || `Tab ${idx + 1}`,
      products: mapAcfProducts(tab.products?.nodes || [])
    }));
  };
  const accProductsRaw = acfData.accessoryProducts?.nodes 
      ? acfData.accessoryProducts.nodes 
      : acfData.accessoryProducts;
  // Map Quality Data
  const mapQualityLarge = (data: any): QualityLargeCard => ({
      title: data?.title || 'Cấu Trúc 5 Lớp Siêu Bền',
      description: data?.description || 'Công nghệ ép nhiệt Nano tiên tiến...',
      icon: getImg(data?.icon),
      image: getImg(data?.image),
      tags: data?.tags ? data.tags.map((t: any) => ({ text: t.text })) : []
  });
  const mapQualitySmall = (list: any[]): QualitySmallCard[] => {
      if (!list) return [];
      return list.map(item => ({
          title: item.title || '',
          description: item.description || '',
          icon: getImg(item.icon)
      }));
  };
  return {
    // Hero
    heroSlides: settings ? mapHeroSlides(settings) : [],
    
    // Category
    categoryHeadingNormal: acfData.categoryHeadingNormal || 'Danh Mục',
    categoryHeadingHighlight: acfData.categoryHeadingHighlight || 'Sản Phẩm',
    categorySubheading: acfData.categorySubheading || '',
    catalogueText: acfData.catalogueText || 'Catalogue 2024',
    enableCategoryNofollow: acfData.enableCatNofollow || false,

    // Signature
    signatureHeadingNormal: acfData.signatureHeadingNormal || 'Signature',
    signatureHeadingHighlight: acfData.signatureHeadingHighlight || 'Collection',
    signatureDesc: acfData.signatureDesc || '',
    signatureTabs: mapSignatureTabs(acfData.signatureTabs),

    // Shop The Look [MAPPING MỚI]
    shopLookHeading: acfData.shopLookHeading || 'Shop The Look',
    shopLookSubheading: acfData.shopLookSubheading || '',
    // Dùng helper mới cho ảnh đơn
    shopLookImage: getSingleImage(acfData.shopLookImage), 
    // Dùng helper mới cho items
    shopLookItems: mapShopLookItems(acfData.shopLookItems),
    // [MAPPING ACCESSORIES]
    headNormal: acfData.headNormal || 'Chi Tiết.',
    headHighlight: acfData.headHighlight || 'Định Hình Đẳng Cấp.',
    phuKienSub: acfData.phuKienSub || ' Hệ thống phụ kiện nẹp, phào chỉ và keo dán chuyên dụng được thiết kế đồng bộ để tạo nên sự hoàn hảo cho từng góc cạnh.',
    accHighlights: mapAccHighlights(acfData.accessoryHighlights),
    accViewAll: {
      text: acfData.accViewAll?.viewAllText || 'Xem Tất Cả Phụ Kiện',
      sub: acfData.accViewAll?.viewAllSub || 'Khám phá thêm các vật tư phụ trợ',
      link: acfData.accViewAll?.viewAllLink || '/shop'
    },
    accProdHeading: acfData.accProdHeading || 'SẢN PHẨM PHỔ BIẾN',
    accProducts: mapAcfProducts(accProductsRaw || []),
    // [MAPPING QUALITY]
    qualityHeading: acfData.qualityHeading || 'Tiêu Chuẩn Đại Nam Wall',
    qualitySubheading: acfData.qualitySubheading || '',
    qualityLarge: mapQualityLarge(acfData.qualityLarge),
    qualitySmall: mapQualitySmall(acfData.qualitySmall),
    // [MAPPING BLOG]
    blogPosts: mapBlogPosts(postsData),
  };
};
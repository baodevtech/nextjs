// src/services/wpService.ts
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
  ApplicationPageData,
  ApplicationSpace,
  Hotspot,
  Stat,
  RenovationFeature,
  PricingPageData,
  ContactPageData,
} from "../types";

// [ĐÃ SỬA] Không còn import constants
// import { PRODUCTS, CATEGORIES } from "../constants";

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
  customRevalidate?: number // Thêm tham số này để tùy chỉnh từng query
) {
  const headers = { "Content-Type": "application/json" };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
      // Tăng mặc định lên 3600s (1 giờ) thay vì 60s
      next: { revalidate: customRevalidate ?? 3600 }, 
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
    productBrands {
      nodes {
        name
        slug
      }
    }
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

  // Xử lý Brand
  const brandName =
    node.productBrands?.nodes && node.productBrands.nodes.length > 0
      ? node.productBrands.nodes[0].name
      : "Đại Nam Wall";

  return {
    id: node.id,
    databaseId: node.databaseId,
    slug: node.slug,
    name: node.name,
    brand: brandName,
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

  // [ĐÃ SỬA] Trả về mảng rỗng nếu lỗi thay vì constants
  if (!data || !data.products) {
    console.warn("⚠️ Không lấy được Products từ API.");
    return [];
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

// 2. Hàm lấy dữ liệu trang Shop
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
          categoryExtras {
            headerImage { node { sourceUrl } }
            bottomContent
            trendHeader
            trendContent
            warrantyMonths
          }
        }
      }
    }
  `);

  // [ĐÃ SỬA] Trả về mảng rỗng nếu lỗi
  if (!data || !data.productCategories) {
    console.warn("⚠️ Không lấy được Categories từ API.");
    return [];
  }

  return data.productCategories.nodes.map(mapCategory);
};

// Helper Maps
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
  return nodes.map((node) => mapProduct(node));
};

const mapShopLookItems = (items: any[]): ShopLookItem[] => {
  if (!items) return [];
  
  return items.reduce<ShopLookItem[]>((acc, item, index) => {
    const productNode = item.products?.nodes?.[0];

    // Nếu không có dữ liệu sản phẩm thì bỏ qua (không push vào mảng kết quả)
    if (!productNode) return acc;

    const product = mapProduct(productNode);
    
    // Nếu mapProduct lỗi hoặc không có ID thì cũng bỏ qua
    if (!product || !product.id) return acc;

    // Chỉ push khi dữ liệu hợp lệ
    acc.push({
      id: index,
      x: parseFloat(item.x) || 50,
      y: parseFloat(item.y) || 50,
      product: product
    });

    return acc;
  }, []);
};
const getSingleImage = (field: any) => {
  if (!field) return "";
  if (field.sourceUrl) return field.sourceUrl;
  if (field.node?.sourceUrl) return field.node.sourceUrl;
  if (field.edges?.[0]?.node?.sourceUrl) return field.edges[0].node.sourceUrl;
  return "";
};

const mapAccHighlights = (items: any[]): AccessoryHighlight[] => {
  if (!items) return [];
  return items.map((item, idx) => ({
    id: idx,
    title: item.title || "",
    subtitle: item.subtitle || "",
    image: getSingleImage(item.image),
    link: item.link || "/shop",
  }));
};

const mapBlogPosts = (nodes: any[]): BlogPost[] => {
  if (!nodes) return [];
  return nodes.map((node) => {
    const date = new Date(node.date);
    const formattedDate = new Intl.DateTimeFormat('vi-VN').format(date);
    
    // Loại bỏ thẻ HTML để lấy text thuần
    const cleanContent = node.content ? node.content.replace(/<[^>]+>/g, '') : '';
    const cleanExcerpt = node.excerpt ? node.excerpt.replace(/<[^>]+>/g, '') : '';
    
    // Tính toán thời gian đọc (giả sử 200 từ/phút)
    const wordCount = cleanContent.split(/\s+/).length;
    const readTimeMin = Math.ceil(wordCount / 200);
    const readTime = readTimeMin > 0 ? `${readTimeMin} phút đọc` : '1 phút đọc';

    return {
      id: node.id,
      title: node.title || '',
      slug: node.slug || '',
      excerpt: cleanExcerpt,
      content: node.content || '',
      date: formattedDate,
      readTime: readTime,
      image: node.featuredImage?.node?.sourceUrl || 'https://via.placeholder.com/800x600?text=No+Image',
      category: node.categories?.nodes?.[0]?.name || 'Tin tức',
      author: {
        name: node.author?.node?.name || 'Admin',
        avatar: node.author?.node?.avatar?.url || '',
        // [FIX LỖI] Thêm trường role để khớp với interface Author
        role: 'Tác giả' 
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

// 2. Lấy chi tiết 1 bài viết
export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const data = await fetchAPI(
    `
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
        tags {
          nodes { name, slug }
        }
        author {
          node { name, avatar { url } }
        }
      }
    }
  `,
    { variables: { id: slug } },
  );

  if (!data?.post) return null;
  const posts = mapBlogPosts([data.post]);
  return posts[0];
};

const mapProjects = (nodes: any[]): Project[] => {
  if (!nodes) return [];
  return nodes.map((node) => {
    const acf = node.projectFields || {};
    const firstCat = node.categories?.nodes?.[0];
    const cleanExcerpt = node.excerpt
      ? node.excerpt.replace(/<[^>]+>/g, "").trim()
      : "";

    return {
      id: node.id,
      title: node.title || "",
      slug: node.slug || "",
      image:
        node.featuredImage?.node?.sourceUrl ||
        "https://via.placeholder.com/800x600",
      category: firstCat?.name || "Dự án",
      categorySlug: firstCat?.slug || "other",
      desc: cleanExcerpt,
      location: acf.location || "Việt Nam",
      year: acf.completionYear || "2024",
      area: acf.area || "---",
      tags: node.tags?.nodes?.map((t: any) => t.name) || [],
      // Các trường fallback cho ProjectDetail
      architect: "",
      client: "",
      challenge: "",
      solution: "",
      materials: [],
      gallery: [],
      subtitle: "",
    };
  });
};

export const getAllProjects = async (): Promise<Project[]> => {
  const data = await fetchAPI(`
    query GetAllProjects {
      projects(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          slug
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

const mapProjectDetail = (node: any): Project => {
  if (!node) return {} as Project;

  const acf = node.projectFields || {};
  const firstCat = node.categories?.nodes?.[0];

  const galleryImages = acf.albumImg?.nodes
    ? acf.albumImg.nodes.map((img: any) => img.sourceUrl)
    : [];

  if (galleryImages.length === 0 && node.featuredImage) {
    galleryImages.push(node.featuredImage.node.sourceUrl);
  }

  const materialsList = acf.materials
    ? acf.materials
        .split(/\r?\n|,/)
        .map((s: string) => s.trim())
        .filter(Boolean)
    : ["Đang cập nhật"];

  const cleanExcerpt = node.excerpt
    ? node.excerpt.replace(/<[^>]+>/g, "").trim()
    : "";

  return {
    id: node.id,
    title: node.title || "",
    slug: node.slug || "",
    image: node.featuredImage?.node?.sourceUrl || "",

    category: firstCat?.name || "Dự án",
    categorySlug: firstCat?.slug || "other",
    subtitle: firstCat?.name || "Chi tiết dự án",

    location: acf.location || "Việt Nam",
    year: acf.completionYear || "2024",
    area: acf.area || "---",
    desc: cleanExcerpt,

    architect: acf.architect || "Đại Nam Wall Team",
    client: acf.client || "Khách hàng",
    challenge: acf.challenge || "Đang cập nhật nội dung...",
    solution: acf.solution || "Đang cập nhật nội dung...",
    materials: materialsList,
    gallery: galleryImages,

    tags: node.tags?.nodes?.map((t: any) => t.name) || [],
  };
};

export const getProjectBySlug = async (
  slug: string,
): Promise<Project | null> => {
  const data = await fetchAPI(
    `
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
             albumImg {
                nodes {
                  sourceUrl
                }
             }
          }
        }
      }
    }
  `,
    { variables: { slug: slug } },
  );

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
          heroSlides {
            subtitle, title, description, ctaLink, ctaText
            image { node { sourceUrl } }
            hotspots { x, y, name, price, position, link, isNofollow }
          }
          categoryHeadingNormal
          categoryHeadingHighlight
          categorySubheading
          catalogueText
          enableCatNofollow
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
          shopLookHeading
          shopLookSubheading
          shopLookImage {
             node { sourceUrl }
          }
          shopLookItems {
            x
            y
            products {
                nodes {             
                ... on Product {
                  ...ProductFields
                }
              }
            }
          }
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
  const getImg = (field: any) => field?.node?.sourceUrl || "";

  const mapSignatureTabs = (tabsData: any[]): SignatureTab[] => {
    if (!tabsData) return [];
    return tabsData.map((tab, idx) => ({
      id: idx,
      name: tab.tabName || `Tab ${idx + 1}`,
      products: mapAcfProducts(tab.products?.nodes || []),
    }));
  };
  const accProductsRaw = acfData.accessoryProducts?.nodes
    ? acfData.accessoryProducts.nodes
    : acfData.accessoryProducts;

  const mapQualityLarge = (data: any): QualityLargeCard => ({
    title: data?.title || "Cấu Trúc 5 Lớp Siêu Bền",
    description: data?.description || "Công nghệ ép nhiệt Nano tiên tiến...",
    icon: getImg(data?.icon),
    image: getImg(data?.image),
    tags: data?.tags ? data.tags.map((t: any) => ({ text: t.text })) : [],
  });
  const mapQualitySmall = (list: any[]): QualitySmallCard[] => {
    if (!list) return [];
    return list.map((item) => ({
      title: item.title || "",
      description: item.description || "",
      icon: getImg(item.icon),
    }));
  };

  return {
    heroSlides: settings ? mapHeroSlides(settings) : [],
    categoryHeadingNormal: acfData.categoryHeadingNormal || "Danh Mục",
    categoryHeadingHighlight: acfData.categoryHeadingHighlight || "Sản Phẩm",
    categorySubheading: acfData.categorySubheading || "",
    catalogueText: acfData.catalogueText || "Catalogue 2024",
    enableCategoryNofollow: acfData.enableCatNofollow || false,
    signatureHeadingNormal: acfData.signatureHeadingNormal || "Signature",
    signatureHeadingHighlight:
      acfData.signatureHeadingHighlight || "Collection",
    signatureDesc: acfData.signatureDesc || "",
    signatureTabs: mapSignatureTabs(acfData.signatureTabs),
    shopLookHeading: acfData.shopLookHeading || "Shop The Look",
    shopLookSubheading: acfData.shopLookSubheading || "",
    shopLookImage: getSingleImage(acfData.shopLookImage),
    shopLookItems: mapShopLookItems(acfData.shopLookItems),
    headNormal: acfData.headNormal || "Chi Tiết.",
    headHighlight: acfData.headHighlight || "Định Hình Đẳng Cấp.",
    phuKienSub:
      acfData.phuKienSub ||
      " Hệ thống phụ kiện nẹp, phào chỉ và keo dán chuyên dụng được thiết kế đồng bộ để tạo nên sự hoàn hảo cho từng góc cạnh.",
    accHighlights: mapAccHighlights(acfData.accessoryHighlights),
    accViewAll: {
      text: acfData.accViewAll?.viewAllText || "Xem Tất Cả Phụ Kiện",
      sub: acfData.accViewAll?.viewAllSub || "Khám phá thêm các vật tư phụ trợ",
      link: acfData.accViewAll?.viewAllLink || "/shop",
    },
    accProdHeading: acfData.accProdHeading || "SẢN PHẨM PHỔ BIẾN",
    accProducts: mapAcfProducts(accProductsRaw || []),
    qualityHeading: acfData.qualityHeading || "Tiêu Chuẩn Đại Nam Wall",
    qualitySubheading: acfData.qualitySubheading || "",
    qualityLarge: mapQualityLarge(acfData.qualityLarge),
    qualitySmall: mapQualitySmall(acfData.qualitySmall),
    blogPosts: mapBlogPosts(postsData),
  };
};

const mapHotspots = (acfHotspots: any[]): Hotspot[] => {
  if (!acfHotspots) return [];
  return acfHotspots.map((h) => ({
    x: h.xPos || 50,
    y: h.yPos || 50,
    label: h.label || "",
    description: h.desc || "",
    iconType: h.iconType || "default",
  }));
};

const mapStats = (acfStats: any[]): Stat[] => {
  if (!acfStats) return [];
  return acfStats.map((s) => ({
    label: s.statLabel || "",
    value: s.statValue || "",
  }));
};
const mapRenovationFeatures = (list: any[]): RenovationFeature[] => {
  if (!list) return [];
  return list.map((item) => ({
    icon: item.iconType || "star",
    title: item.title || "",
    desc: item.desc || "",
  }));
};

export const getApplicationsPageData =
  async (): Promise<ApplicationPageData> => {
    const data = await fetchAPI(`
    query GetApplicationOptions {
      applicationOptions {
        appData {
          heroTitle
          heroDesc
          spaces {
            name
            subtitle
            description
            image { node { sourceUrl } }
            hotspots {
              xPos, yPos, label, desc, iconType
            }
            stats {
              statLabel, statValue
            }
          }
          renovationHeading
          renovationDesc
          beforeImage { node { sourceUrl } }
          afterImage { node { sourceUrl } }
          renovationFeatures {
             iconType, title, desc
          }
          commHeading
          commDesc
          commLinkText
          commLinkUrl 
          commItems {
            title, desc, image { node { sourceUrl } }
          }
          ctaHeading
          ctaDesc
          ctaBtnPrimary
          ctaBtnSecondary
        }
      }
    }
  `);

    const acf = data?.applicationOptions?.appData || {};
    const rawSpaces = acf.spaces || [];

    const spaces: ApplicationSpace[] = rawSpaces.map(
      (item: any, index: number) => ({
        id: `space-${index}`,
        name: item.name || "",
        title: item.subtitle || "",
        description: item.description || "",
        image: item.image?.node?.sourceUrl || "",
        hotspots: mapHotspots(item.hotspots),
        stats: mapStats(item.stats),
      }),
    );

    return {
      heroTitle: acf.heroTitle || "Nghệ Thuật Biến Hóa Không Gian",
      heroDesc: acf.heroDesc || "",
      spaces,
      renovationHeading: acf.renovationHeading || "Cải Tạo Thần Tốc",
      renovationDesc:
        acf.renovationDesc || "Chứng kiến sự lột xác ngoạn mục...",
      beforeImage: acf.beforeImage?.node?.sourceUrl || "",
      afterImage: acf.afterImage?.node?.sourceUrl || "",
      renovationFeatures: mapRenovationFeatures(acf.renovationFeatures),
      commHeading: acf.commHeading || "Không Gian Thương Mại",
      commDesc: acf.commDesc || "",
      commLinkText: acf.commLinkText || "Xem dự án thực tế",
      commLinkUrl: acf.commLinkUrl || "/du-an",
      commItems:
        acf.commItems?.map((item: any) => ({
          title: item.title || "",
          desc: item.desc || "",
          image: item.image?.node?.sourceUrl || "",
        })) || [],
      ctaHeading: acf.ctaHeading || "Bạn Đã Có Ý Tưởng?",
      ctaDesc: acf.ctaDesc || "",
      ctaBtnPrimary: acf.ctaBtnPrimary || "Đăng Ký Tư Vấn",
      ctaBtnSecondary: acf.ctaBtnSecondary || "Xem Catalog",
    };
  };

const mapProductToItem = (node: any): any => {
  if (!node) return null;
  const rawPrice = node.price
    ? parseFloat(node.price.replace(/[^0-9.]/g, ""))
    : 0;
  const formattedPrice =
    rawPrice > 0
      ? new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(rawPrice)
      : "Liên hệ";
  return {
    name: node.name || "",
    price: formattedPrice,
    unit: "",
    link: `/product/${node.slug}`,
    image: node.image?.sourceUrl || "https://via.placeholder.com/300",
  };
};

export const getPricingPageData = async (): Promise<PricingPageData> => {
  const data = await fetchAPI(`
    query GetPricingOptions {
      pricingOptions {
        pricingData {
          heroTitle
          heroDesc
          calculatorProduct {
            nodes {
              ... on Product {
                id, name, slug, sku
                image { sourceUrl }
                ... on SimpleProduct { price(format: RAW) }
                ... on VariableProduct { price(format: RAW) }
                productSpecifications {
                   length, width, thickness
                }
              }
            }
          }
          basePriceTurnkey
          pkgHeading, pkgDesc
          turnkeyPackages {
            name, price, unit, description, isPopular, styleType, features { text }
          }
          stepsHeading, stepsDesc
          constructionSteps {
            stepNumber, title, desc, icon
          }
          commitments {
            icon, title, desc
          }
          materialsHeading, materialsDesc
          materialProducts {
            nodes {
              ... on Product {
                id, name, slug
                image { sourceUrl }
                ... on SimpleProduct { price(format: RAW) }
                ... on VariableProduct { price(format: RAW) }
              }
            }
          }
          accHeading, accDesc
          accessoryItems {
            nodes {
              ... on Product {
                id, name, slug
                image { sourceUrl }
                ... on SimpleProduct { price(format: RAW) }
                ... on VariableProduct { price(format: RAW) }
              }
            }
          }
          faqs { question, answer }
          ctaHeading, ctaDesc
        }
      }
    }
  `);

  const acf = data?.pricingOptions?.pricingData || {};
  const mapFeatures = (list: any[]) =>
    list?.map((item: any) => item.text || "") || [];

  const mapCalcProduct = (node: any): Product | null => {
    if (!node) return null;
    const rawPrice = node.price
      ? parseFloat(node.price.replace(/[^0-9.]/g, ""))
      : 0;
    return {
      id: node.id,
      databaseId: 0,
      slug: node.slug,
      name: node.name,
      image: { sourceUrl: node.image?.sourceUrl || "", altText: node.name },
      price: { amount: rawPrice, formatted: "" },
      dimensions: {
        length: Number(node.productSpecifications?.length) || 0,
        width: Number(node.productSpecifications?.width) || 0,
        thickness: Number(node.productSpecifications?.thickness) || 0,
        area: 0,
      },
      brand: "",
      origin: "",
      surface: "",
      warranty: "",
      description: "",
      shortDescription: "",
      galleryImages: [],
      stockStatus: "IN_STOCK",
      sku: node.sku || "",
      categories: [],
    };
  };

  const calcProductNode = acf.calculatorProduct?.nodes?.[0] || null;

  return {
    heroTitle: acf.heroTitle || "Bảng Giá Niêm Yết 2024",
    heroDesc:
      acf.heroDesc || "Công cụ tính toán giúp bạn hình dung chi phí sơ bộ...",
    calculatorProduct: mapCalcProduct(calcProductNode),
    basePriceTurnkey: Number(acf.basePriceTurnkey) || 550000,
    pkgHeading: acf.pkgHeading || "1. Báo Giá Thi Công Trọn Gói",
    pkgDesc: acf.pkgDesc || "Giải pháp tối ưu nhất cho khách hàng bận rộn...",
    turnkeyPackages:
      acf.turnkeyPackages?.map((pkg: any, idx: number) => ({
        id: idx,
        name: pkg.name || "",
        price: pkg.price || "",
        unit: pkg.unit || "đ/m2",
        description: pkg.description || "",
        isPopular: pkg.isPopular || false,
        styleType: pkg.styleType || "standard",
        features: mapFeatures(pkg.features),
      })) || [],
    stepsHeading: acf.stepsHeading || "Quy Trình Thi Công",
    stepsDesc: acf.stepsDesc || "Sự chuyên nghiệp tạo nên chất lượng...",
    constructionSteps:
      acf.constructionSteps?.map((step: any) => ({
        step: step.stepNumber || `0${step + 1}`,
        title: step.title || "",
        desc: step.desc || "",
        icon: step.icon || "default",
      })) || [],
    commitments:
      acf.commitments?.map((cm: any) => ({
        icon: cm.icon || "thumbsup",
        title: cm.title || "",
        desc: cm.desc || "",
      })) || [],
    materialsHeading: acf.materialsHeading || "2. Báo Giá Vật Tư Lẻ",
    materialsDesc:
      acf.materialsDesc || "Mua vật liệu chính hãng giá tại kho...",
    materialItems: acf.materialProducts?.nodes?.map(mapProductToItem) || [],
    accHeading: acf.accHeading || "3. Phụ Kiện Thi Công",
    accDesc: acf.accDesc || "Các vật tư phụ cần thiết...",
    accessoryItems: acf.accessoryItems?.nodes?.map(mapProductToItem) || [],
    faqs:
      acf.faqs?.map((f: any) => ({
        question: f.question || "",
        answer: f.answer || "",
      })) || [],
    ctaHeading: acf.ctaHeading || "Bạn Vẫn Còn Phân Vân?",
    ctaDesc: acf.ctaDesc || "Đừng lo lắng. Hãy để chuyên gia kỹ thuật hỗ trợ.",
  };
};

export const getContactPageData = async (): Promise<ContactPageData> => {
  const data = await fetchAPI(`
    query GetContactOptions {
      contactOptions {
        contactData {
          heroTitle, heroDesc, heroImage { node { sourceUrl } }
          address, hotline, email, workingHours, zaloUrl, facebookUrl
          mapEmbedUrl
          formHeading, formDesc, namePlaceholder, phonePlaceholder, emailPlaceholder
          messagePlaceholder, btnText, successTitle, successMessage
          topics { value, label }
          faqsContact { question, answer }
        }
      }
    }
  `);

  const acf = data?.contactOptions?.contactData || {};

  return {
    heroTitle: acf.heroTitle || 'Liên Hệ Với Chúng Tôi',
    heroDesc: acf.heroDesc || 'Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn.',
    heroImage: acf.heroImage?.node?.sourceUrl || 'https://via.placeholder.com/1920x600',
    
    info: {
      address: acf.address || 'Đang cập nhật địa chỉ...',
      hotline: acf.hotline || '0912.345.678',
      email: acf.email || 'info@domain.com',
      workingHours: acf.workingHours || 'Thứ 2 - Thứ 7: 8:00 - 17:30',
      zaloUrl: acf.zaloUrl || '#',
      facebookUrl: acf.facebookUrl || '#'
    },
    
    mapUrl: acf.mapEmbedUrl || '',

    // [FIX LỖI] Thêm thuộc tính 'form' còn thiếu
    form: {
      heading: acf.formHeading || 'Gửi Tin Nhắn',
      desc: acf.formDesc || 'Vui lòng điền thông tin bên dưới, chúng tôi sẽ liên hệ lại ngay.',
    },

    formConfig: {
        heading: acf.formHeading || 'Gửi Tin Nhắn',
        desc: acf.formDesc || 'Vui lòng điền thông tin bên dưới, chúng tôi sẽ liên hệ lại ngay.',
        namePlaceholder: acf.namePlaceholder || 'Nguyễn Văn A',
        phonePlaceholder: acf.phonePlaceholder || '0912 xxx xxx',
        emailPlaceholder: acf.emailPlaceholder || 'example@gmail.com',
        messagePlaceholder: acf.messagePlaceholder || 'Nội dung cần tư vấn...',
        btnText: acf.btnText || 'Gửi Yêu Cầu',
        successTitle: acf.successTitle || 'Gửi thành công!',
        successMessage: acf.successMessage || 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất.',
        topics: acf.topics?.map((t: any) => ({
            value: t.value || 'general',
            label: t.label || 'Tư vấn chung'
        })) || [
            { value: 'advice', label: 'Tư vấn sản phẩm' }
        ]
      },

    faqsContact: acf.faqsContact?.map((item: any) => ({
        question: item.question || '',
        answer: item.answer || ''
    })) || []
  };
};

export const submitContactForm = async (formData: {
  name: string;
  phone: string;
  email: string;
  topic: string;
  message: string;
}) => {
  const restBaseUrl = API_URL.replace("/graphql", "/wp-json/dainam/v1/contact");
  try {
    const res = await fetch(restBaseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Lỗi khi gửi form");
    return json;
  } catch (error) {
    console.error("❌ Submit Form Error:", error);
    return null;
  }
};

const ADD_TO_CART_MUTATION = `
mutation AddToCart($productId: Int!, $quantity: Int!) {
  addToCart(input: { productId: $productId, quantity: $quantity }) {
    cart {
      contents {
        nodes {
          key
          quantity
          product {
            node {
              name
              databaseId
            }
          }
        }
      }
    }
  }
}
`;

const CHECKOUT_MUTATION = `
mutation Checkout($input: CheckoutInput!) {
  checkout(input: $input) {
    result
    redirect
    order {
      databaseId
      orderNumber
      status
      total
    }
  }
}
`;

// --- QUẢN LÝ SESSION ---
const getSession = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('woo-session');
  }
  return null;
};

const setSession = (token: string) => {
  if (typeof window !== 'undefined' && token) {
    localStorage.setItem('woo-session', token);
  }
};

// --- HÀM GỌI API CHO CART/CHECKOUT ---
const fetchGraphQL = async (query: string, variables: any = {}) => {
  const headers: Record<string, string> = { 
    "Content-Type": "application/json" 
  };
  
  // 1. Gửi Session Token đi (nếu đã có)
  const session = getSession();
  if (session) {
    headers['woocommerce-session'] = `Session ${session}`;
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    credentials: "include", // Quan trọng để xử lý cookie nếu server dùng cookie
    cache: "no-store",
  });

  // 2. Lấy Session Token mới từ Server trả về (nếu có) và lưu lại
  // Lưu ý: Tên header có thể là 'woocommerce-session' hoặc 'x-woocommerce-session' tùy server
  const newSession = res.headers.get('woocommerce-session') || res.headers.get('x-woocommerce-session');
  
  if (newSession) {
    setSession(newSession);
  }

  return res.json();
};

export const createOrder = async (
  formData: {
    name: string;
    phone: string;
    email: string;
    address: string;
    note: string;
    paymentMethod?: string;
  },
  cartItems: any[],
) => {
  try {
    const fullName = formData.name.trim();
    const lastSpaceIndex = fullName.lastIndexOf(" ");
    let firstName = fullName;
    let lastName = ".";
    if (lastSpaceIndex > 0) {
      firstName = fullName.substring(0, lastSpaceIndex);
      lastName = fullName.substring(lastSpaceIndex + 1);
    }
    console.log("🛒 Bắt đầu thêm vào giỏ hàng...");

    for (const item of cartItems) {
      const pId = Number(item.databaseId);
      if (!pId || isNaN(pId)) continue;
      const res = await fetchGraphQL(ADD_TO_CART_MUTATION, {
        productId: pId,
        quantity: item.quantity,
      });
      if (res.errors) {
        console.error("AddToCart Error:", res.errors);
        return { success: false, message: res.errors[0].message };
      }
    }

    const checkoutInput = {
      clientMutationId: `order_${Date.now()}`,
      paymentMethod: formData.paymentMethod || "cod",
      isPaid: false,
      billing: {
        firstName,
        lastName,
        address1: formData.address,
        city: "Hồ Chí Minh",
        country: "VN",
        phone: formData.phone,
        email: formData.email || "no-email@example.com",
      },
      shipping: {
        firstName,
        lastName,
        address1: formData.address,
        city: "Hồ Chí Minh",
        country: "VN",
      },
      customerNote: formData.note,
    };

    const data = await fetchGraphQL(CHECKOUT_MUTATION, {
      input: checkoutInput,
    });

    if (data.errors) {
      console.error("❌ Checkout Error:", data.errors);
      return { success: false, message: data.errors[0].message };
    }

    return {
      success: true,
      order: data.data?.checkout?.order,
    };
  } catch (error) {
    console.error("Exception:", error);
    return {
      success: false,
      message:
        "Lỗi hệ thống: " +
        (error instanceof Error ? error.message : String(error)),
    };
  }
};


//header
import { HeaderData, NavItem } from "../types";

export const getHeaderData = async (): Promise<HeaderData> => {
  const data = await fetchAPI(`
    query GetHeaderOptions {
      headerFooterOptions {
        headerData {
          logo { node { sourceUrl } }
          topBarText
          hotline
          navItems { title, link }
          
          # Tất cả được bọc trong group megaMenu
          megaMenu {
            col1Title
            col1Items {
              categoryLink { nodes { name, slug } }
              customTitle, desc, icon, color
            }
            
            col2Title
            col2Items {
              categoryLink { nodes { name, slug } }
              customTitle, desc, icon, color
            }
            
            quickLinks { title, link }
            
            banner {
              image { node { sourceUrl } }
              badgeText, title, desc, linkText, linkUrl
            }
          }
        }
      }
    }
  `);

  const acf = data?.headerFooterOptions?.headerData || {};
  const megaMenu = acf.megaMenu || {}; // Lấy ra group megaMenu

  const mapItems = (items: any[]) => {
    if (!items) return [];
    return items.map((item: any) => {
      const catNode = item.categoryLink?.nodes?.[0];
      return {
        title: item.customTitle || catNode?.name || "Đang cập nhật...",
        slug: catNode?.slug || "",
        desc: item.desc || "",
        icon: item.icon || "Box",
        color: item.color || "text-slate-600 bg-slate-50"
      };
    });
  };

  return {
    logo: acf.logo?.node?.sourceUrl || "/images/default-logo.png",
    topBarText: acf.topBarText || "",
    hotline: acf.hotline || "0909.xxx.xxx",
    navItems: acf.navItems?.map((item: any) => ({
      title: item.title || "",
      link: item.link || "/",
    })) || [],
    
    // Gộp tất cả vào megaMenu
    megaMenu: {
      col1: {
        title: megaMenu.col1Title || "Vật Liệu Chính",
        items: mapItems(megaMenu.col1Items)
      },
      col2: {
        title: megaMenu.col2Title || "Phụ Kiện & Khác",
        items: mapItems(megaMenu.col2Items)
      },
      quickLinks: megaMenu.quickLinks?.map((item: any) => ({
        title: item.title || "",
        link: item.link || "#"
      })) || [],
      banner: {
        image: megaMenu.banner?.image?.node?.sourceUrl || "https://images.unsplash.com/photo-1620626012053-93f56b5463f0?q=80&w=800&auto=format&fit=crop",
        badge: megaMenu.banner?.badgeText || "New Collection",
        title: megaMenu.banner?.title || "Vẻ Đẹp Vượt Thời Gian",
        desc: megaMenu.banner?.desc || "Khám phá bộ sưu tập mới nhất.",
        linkText: megaMenu.banner?.linkText || "Xem Ngay",
        linkUrl: megaMenu.banner?.linkUrl || "/shop"
      }
    }
  };
};

import { FooterData } from "../types";

// Cập nhật hàm getFooterData trong src/services/wpService.ts
export const getFooterData = async (): Promise<FooterData> => {
  const data = await fetchAPI(`
    query GetFooterOptions {
      headerFooterOptions {
        # Thêm lớp bọc footerSettings (Tên của Field Group)
        footerSettings {
          footerData {
            trustBadges { icon, title, desc }
            companyInfo { logoText, desc, address, phone, email }
            shopCategories {
              title
              links { title, url, badge, badgeColor }
            }
            customerService {
              title
              links { title, url }
            }
            socialLinks { facebook, instagram, youtube }
            bottomBar {
              copyright
              links { title, url }
            }
          }
        }
      }
    }
  `);

  // Truy cập sâu thêm một tầng vào footerSettings
  const acf = data?.headerFooterOptions?.footerSettings?.footerData || {};

  return {
    trustBadges: acf.trustBadges || [
      { icon: 'Truck', title: 'Giao hàng toàn quốc', desc: 'Hỗ trợ vận chuyển tận nơi' },
      { icon: 'ShieldCheck', title: 'Bảo hành 15 năm', desc: 'Cam kết chất lượng vật liệu' },
      { icon: 'CreditCard', title: 'Thanh toán linh hoạt', desc: 'Đa dạng phương thức' },
      { icon: 'Headphones', title: 'Hỗ trợ 24/7', desc: 'Tư vấn kỹ thuật thi công' }
    ],
    companyInfo: {
      logoText: acf.companyInfo?.logoText || 'ĐẠI NAM WALL',
      desc: acf.companyInfo?.desc || 'Tổng kho phân phối vật liệu ốp tường cao cấp...',
      address: acf.companyInfo?.address || '123 Đ. Nguyễn Văn Linh, Q. Long Biên, Hà Nội',
      phone: acf.companyInfo?.phone || '0912.345.678',
      email: acf.companyInfo?.email || 'sale@dainamwall.com',
    },
    shopCategories: {
      title: acf.shopCategories?.title || 'Danh mục mua sắm',
      links: acf.shopCategories?.links || []
    },
    customerService: {
      title: acf.customerService?.title || 'Hỗ trợ dịch vụ',
      links: acf.customerService?.links || []
    },
    socialLinks: {
      facebook: acf.socialLinks?.facebook || '#',
      instagram: acf.socialLinks?.instagram || '#',
      youtube: acf.socialLinks?.youtube || '#',
    },
    bottomBar: {
      copyright: acf.bottomBar?.copyright || 'Công ty TNHH Đại Nam Wall.',
      links: acf.bottomBar?.links || []
    }
  };
};
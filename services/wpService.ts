import { PRODUCTS, CATEGORIES } from '../constants';
import { Product, Category } from '../types';

/**
 * SERVICE GIẢ LẬP KẾT NỐI WORDPRESS GRAPHQL
 * 
 * Trong dự án thực tế, bạn sẽ thay thế phần mock data bằng `fetch` tới endpoint GraphQL của WP.
 * Ví dụ endpoint: https://your-wordpress-site.com/graphql
 */

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://demo.vietpanel.com/graphql';

// 1. Query lấy danh sách sản phẩm
// const GET_PRODUCTS_QUERY = `
//   query GetProducts {
//     products(first: 20) {
//       nodes {
//         id
//         databaseId
//         slug
//         name
//         ... on SimpleProduct {
//           price
//           stockStatus
//           sku
//           regularPrice
//         }
//         featuredImage {
//           node {
//             sourceUrl
//             altText
//           }
//         }
//         productCategories {
//           nodes {
//             slug
//             name
//           }
//         }
//       }
//     }
//   }
// `;

export const getProducts = async (): Promise<Product[]> => {
  // --- REAL IMPLEMENTATION ---
  // const res = await fetch(API_URL, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ query: GET_PRODUCTS_QUERY }),
  // });
  // const json = await res.json();
  // return json.data.products.nodes.map(transformWpNodeToProduct);
  
  // --- MOCK IMPLEMENTATION ---
  return new Promise((resolve) => {
    setTimeout(() => resolve(PRODUCTS), 500); // Simulate network delay
  });
};

export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
   // --- MOCK ---
   return new Promise((resolve) => {
      const product = PRODUCTS.find(p => p.slug === slug);
      setTimeout(() => resolve(product), 300);
   });
};

export const getCategories = async (): Promise<Category[]> => {
  return new Promise((resolve) => resolve(CATEGORIES));
};
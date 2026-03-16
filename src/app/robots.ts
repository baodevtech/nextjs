// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 1. Luật chung cho tất cả các bot khác
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/checkout/', '/cart/'],
      },
      // 2. Luật VIP chỉ định đích danh cho bot của Google Merchant / Google Search
      {
        userAgent: ['Googlebot', 'Googlebot-Image'],
        allow: '/',
      }
    ],
    sitemap: 'https://khopanel.com/sitemap.xml',
  };
}
// src/app/feed.xml/route.ts
import { getProducts } from '@/services/wpService';

const BASE_URL = 'https://khopanel.com';

export async function GET() {
  const products = await getProducts();

  // Tạo cấu trúc XML cho từng sản phẩm theo chuẩn Google Merchant
  const xmlItems = products.map((product) => {
    // Google yêu cầu định dạng giá phải là: "Số_tiền Mã_tiền_tệ" (Ví dụ: 150000 VND)
    // Giả sử product.price.amount của bạn là số
    const price = product.price?.amount ? `${product.price.amount} VND` : '0 VND';
    
    // Trạng thái kho hàng chuẩn của Google: in_stock, out_of_stock, preorder
    const availability = product.stockStatus === 'IN_STOCK' ? 'in_stock' : 'out_of_stock';
    
    // Loại bỏ các thẻ HTML trong shortDescription (nếu có) để nhét vào CDATA
    const description = product.shortDescription || product.name;

    return `
      <item>
        <g:id>${product.sku || product.databaseId}</g:id>
        <g:title><![CDATA[${product.name}]]></g:title>
        <g:description><![CDATA[${description}]]></g:description>
        <g:link>${BASE_URL}/p/${product.slug}</g:link>
        <g:image_link>${product.image?.sourceUrl}</g:image_link>
        <g:condition>new</g:condition>
        <g:availability>${availability}</g:availability>
        <g:price>${price}</g:price>
        <g:brand><![CDATA[${product.brand || 'Đại Nam Wall'}]]></g:brand>
      </item>
    `;
  }).join('');

  // Gói toàn bộ vào cấu trúc RSS 2.0 chuẩn của Google Shopping
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
      <channel>
        <title>Kho Panel Shop</title>
        <link>${BASE_URL}</link>
        <description>Nguồn cấp dữ liệu sản phẩm của Kho Panel</description>
        ${xmlItems}
      </channel>
    </rss>
  `;

  // Trả về file XML
  return new Response(xml, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      // Cache file này trong 1 giờ để giảm tải server
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
import { GoogleGenAI } from "@google/genai";
import { Product } from '../types';

export const askProductQuestion = async (product: Product, question: string): Promise<string> => {
  try {
    const prompt = `
      Bạn là Chuyên gia Kỹ thuật và Thiết kế nội thất của "Đại Nam Wall".
      Thương hiệu Đại Nam Wall chuyên cung cấp tấm ốp tường cao cấp, uy tín, chất lượng.
      
      Thông tin sản phẩm:
      - Tên: ${product.name}
      - Giá: ${product.price.formatted} / sản phẩm
      - Kích thước: ${product.dimensions.length}mm x ${product.dimensions.width}mm x ${product.dimensions.thickness}mm
      - Diện tích phủ: ${product.dimensions.area} m2/tấm
      - Mô tả kỹ thuật: ${product.description.replace(/<[^>]*>?/gm, '')}
      
      Khách hàng hỏi: "${question}"
      
      Yêu cầu trả lời:
      1. Ngắn gọn (dưới 80 từ), lịch sự, dùng tiếng Việt chuẩn.
      2. Nhấn mạnh vào độ bền, tính thẩm mỹ và dễ thi công của Đại Nam Wall.
      3. Nếu khách hỏi về số lượng, hãy hướng dẫn dùng công cụ "Tính Vật Tư" ngay bên cạnh.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Xin lỗi, hiện tại tôi không thể lấy thông tin chi tiết.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Hệ thống tư vấn AI đang bảo trì. Vui lòng liên hệ hotline 0912.xxx.xxx để được hỗ trợ nhanh nhất.";
  }
};
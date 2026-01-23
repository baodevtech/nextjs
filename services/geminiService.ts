import { GoogleGenAI } from "@google/genai";
import { Product } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askProductQuestion = async (product: Product, question: string): Promise<string> => {
  try {
    const prompt = `
      Bạn là một Kiến Trúc Sư và Chuyên gia Nội Thất hàng đầu tại "VietPanel".
      Khách hàng đang hỏi về sản phẩm sau:
      - Tên: ${product.name}
      - Giá: ${product.price.formatted} / sản phẩm
      - Kích thước: Dài ${product.dimensions.length}mm x Rộng ${product.dimensions.width}mm x Dày ${product.dimensions.thickness}mm
      - Diện tích 1 tấm: ${product.dimensions.area} m2
      - Mô tả: ${product.description.replace(/<[^>]*>?/gm, '')}
      
      Câu hỏi của khách: "${question}"
      
      Hãy trả lời ngắn gọn (dưới 80 từ), chuyên nghiệp, sử dụng tiếng Việt tự nhiên. 
      Tập trung vào tư vấn kỹ thuật, thẩm mỹ, cách thi công hoặc độ bền.
      Nếu câu hỏi liên quan đến số lượng cần mua, hãy nhắc khách sử dụng công cụ "Tính Toán Vật Tư" trên trang.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Xin lỗi, hiện tại tôi không thể lấy thông tin chi tiết.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Hệ thống tư vấn AI đang bảo trì. Vui lòng liên hệ hotline để được hỗ trợ.";
  }
};
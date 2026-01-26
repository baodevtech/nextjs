import { GoogleGenerativeAI } from "@google/generative-ai"; // Sử dụng package vừa cài đặt
import { Product } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export const askProductQuestion = async (product: Product, question: string): Promise<string> => {
  try {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
      return "Lỗi: Chưa cấu hình API Key cho Gemini AI.";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Bạn là một chuyên gia tư vấn kỹ thuật tại cửa hàng "Đại Nam Wall".
      Hãy trả lời câu hỏi của khách hàng về sản phẩm sau đây một cách chuyên nghiệp.

      Thông tin sản phẩm:
      - Tên: ${product.name}
      - Thương hiệu: ${product.brand}
      - Kích thước: ${product.dimensions.width}x${product.dimensions.length}mm

      Câu hỏi: "${question}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "Trợ lý AI đang bận. Bạn vui lòng thử lại sau.";
  }
};
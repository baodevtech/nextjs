import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // Đảm bảo dòng này tồn tại
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",       // Đảm bảo dòng này tồn tại
    "./src/**/*.{js,ts,jsx,tsx,mdx}",            // Quét toàn bộ thư mục src cho chắc chắn
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-merriweather)'],
      },
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          600: '#0284c7', // Màu ví dụ, hãy giữ lại màu brand cũ của bạn nếu có
          900: '#0c4a6e',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Bạn đang dùng plugin này trong package.json
  ],
};
export default config;
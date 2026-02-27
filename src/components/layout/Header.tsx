// src/components/layout/Header.tsx
import { getHeaderData } from "@/services/wpService";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  // Gọi API lấy dữ liệu Header từ WordPress
  const headerData = await getHeaderData();

  return (
    // Truyền dữ liệu xuống cho component giao diện (Client)
    <HeaderClient headerData={headerData} />
  );
}
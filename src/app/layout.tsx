import type { Metadata } from "next";
import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/nav/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    // "default" áp cho trang chưa tự khai title riêng (vd trang chủ); "template" áp cho MỌI
    // trang con có khai `title` riêng (vd trang sản phẩm qua generateMetadata) — cần cả 2 để
    // trang chủ vẫn giữ nguyên title dài như cũ, còn trang con có hậu tố "| KNXStore" nhất quán.
    default: "KNXStore — Giải pháp tự động hóa tòa nhà KNX, DALI-2, Casambi, Matter",
    template: "%s | KNXStore",
  },
  description:
    "Phân phối và tư vấn giải pháp tự động hóa tòa nhà: KNX, DALI-2, DMX512, Casambi, an ninh, HVAC và Matter Smarthome.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

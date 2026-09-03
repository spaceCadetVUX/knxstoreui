import type { Metadata } from "next";
import { Navbar } from "@/components/nav/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "KNXStore — Giải pháp tự động hóa tòa nhà KNX, DALI-2, Casambi, Matter",
  description:
    "Phân phối và tư vấn giải pháp tự động hóa tòa nhà: KNX, DALI-2, DMX512, Casambi, an ninh, HVAC và Matter Smarthome.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}

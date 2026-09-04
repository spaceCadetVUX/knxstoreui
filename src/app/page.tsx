import { BlogPosts } from "@/components/home/blog-posts";
import { Faq } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { ProductHighlights } from "@/components/home/product-highlights";
import { ValueProps } from "@/components/home/value-props";

export default function Home() {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <Hero />
      {/* ProtocolCategories ("Phủ kín mọi giao thức tự động hoá tòa nhà") đã bỏ khỏi trang chủ
          theo yêu cầu trực tiếp 2026-09-04 — component vẫn còn nguyên ở
          components/home/protocol-categories.tsx (+ -data.ts) nếu cần dùng lại sau này. */}
      <ProductHighlights />
      <ValueProps />
      <Faq />
      <BlogPosts />
    </main>
  );
}

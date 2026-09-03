import { BlogPosts } from "@/components/home/blog-posts";
import { BrandMarquee } from "@/components/home/brand-marquee";
import { Faq } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { ProductHighlights } from "@/components/home/product-highlights";
import { ProtocolCategories } from "@/components/home/protocol-categories";
import { ValueProps } from "@/components/home/value-props";

export default function Home() {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <Hero />
      <ProtocolCategories />
      <ProductHighlights />
      <BrandMarquee />
      <ValueProps />
      <Faq />
      <BlogPosts />
    </main>
  );
}

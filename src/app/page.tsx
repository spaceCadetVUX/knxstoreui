import { BrandMarquee } from "@/components/home/brand-marquee";
import { Hero } from "@/components/home/hero";
import { ProtocolCategories } from "@/components/home/protocol-categories";
import { ShopByCategory } from "@/components/home/shop-by-category";

export default function Home() {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <Hero />
      <ProtocolCategories />
      <ShopByCategory />
      <BrandMarquee />
    </main>
  );
}

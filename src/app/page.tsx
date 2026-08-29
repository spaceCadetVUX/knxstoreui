import { Hero } from "@/components/home/hero";
import { ShopByCategory } from "@/components/home/shop-by-category";

export default function Home() {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <Hero />
      <ShopByCategory />
    </main>
  );
}

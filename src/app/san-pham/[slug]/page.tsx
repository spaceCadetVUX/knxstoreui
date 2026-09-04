import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, productDetails } from "@/components/product/product-data";
import { ProductHero } from "@/components/product/product-hero";
import { ProductFeatures } from "@/components/product/product-features";
import { ProductTabs } from "@/components/product/product-tabs";
import { ProductAccessories } from "@/components/product/product-accessories";
import { RelatedProducts } from "@/components/product/related-products";

// Toàn bộ data hiện là local TS (chưa có backend — xem product-detail-page-plan.md Phase B),
// nên prerender tĩnh 100% tại build time là đúng, không cần Suspense/runtime params.
export async function generateStaticParams() {
  return productDetails.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/san-pham/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.tagline,
  };
}

export default async function ProductDetailPage({ params }: PageProps<"/san-pham/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="mx-auto flex max-w-[var(--container-max)] flex-wrap items-center gap-2 px-4 pb-2 pt-[18px] text-[13px] text-muted-foreground md:px-8 lg:px-16"
      >
        <Link href="/" className="hover:text-accent">
          Trang chủ
        </Link>
        <span>/</span>
        <Link href={product.categoryHref} className="hover:text-accent">
          {product.categoryShortLabel}
        </Link>
        <span>/</span>
        <span aria-current="page" className="font-semibold text-foreground">
          {product.name}
        </span>
      </nav>

      <ProductHero product={product} />
      <ProductFeatures features={product.features} />
      <ProductTabs product={product} />
      <ProductAccessories accessories={product.accessories} />
      <RelatedProducts
        categoryGroup={product.categoryGroup}
        categoryShortLabel={product.categoryShortLabel}
        categoryHref={product.categoryHref}
      />
    </>
  );
}

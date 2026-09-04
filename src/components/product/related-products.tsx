import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import { searchProducts } from "@/components/nav/search-data";
import type { CategoryGroupKey } from "@/components/nav/nav-data";
import { ProductCard, type HighlightProduct, type StockStatus } from "@/components/product/product-card";

// Tồn kho thật CHỈ xác nhận được cho SKU đã khai trong STOCK_BY_ID gốc (product-highlights-data.ts,
// trang chủ) — id 472 (Satel PRF-LCD) có "in-stock" thật, id 469 (Satel AXD-200) KHÔNG có trong
// đó. Không tự đoán trạng thái cho SKU chưa có dữ liệu — giữ null (ẩn hẳn dòng tồn kho trên thẻ,
// đúng quy ước StockStatus toàn site) thay vì bịa "còn hàng"/"hết hàng".
const KNOWN_STOCK: Partial<Record<number, StockStatus>> = {
  472: "in-stock",
};

/**
 * "Sản phẩm liên quan" trên trang chi tiết sản phẩm — lọc trực tiếp trên `searchProducts` theo
 * `categoryGroup`, KHÔNG chép lại tên/giá (đúng nguyên tắc "1 nguồn dữ liệu" đang áp dụng toàn
 * site). Server Component — ProductCard tự lo phần "use client" cho state của riêng nó.
 */
export function RelatedProducts({
  categoryGroup,
  categoryShortLabel,
  categoryHref,
}: {
  categoryGroup: CategoryGroupKey;
  categoryShortLabel: string;
  categoryHref: string;
}) {
  // Tối đa 4 thẻ — tránh lưới quá dài trên trang chi tiết sản phẩm (khác trang chủ/danh mục,
  // nơi hiển thị hết cả danh sách).
  const related: HighlightProduct[] = searchProducts
    .filter((p) => p.categoryGroup === categoryGroup)
    .map((p) => ({ ...p, stock: KNOWN_STOCK[p.id] ?? null }))
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="mx-auto max-w-[var(--container-max)] px-4 pb-16 md:px-8 lg:px-16">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="text-[22px] font-bold text-foreground">
          Sản phẩm liên quan · {categoryShortLabel}
        </h2>
        <Link
          href={categoryHref}
          className="inline-flex shrink-0 items-center gap-1 text-[13.5px] font-semibold text-accent hover:underline"
        >
          Xem tất cả danh mục {categoryShortLabel}
          <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
        </Link>
      </div>
      <ul className="grid grid-cols-2 list-none gap-3.5 p-0 sm:gap-5 lg:grid-cols-4">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ul>
    </section>
  );
}

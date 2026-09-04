"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Plus, ShoppingCart } from "@phosphor-icons/react";
import { formatPriceVnd, searchProducts } from "@/components/nav/search-data";
import { skuOf, type HighlightProduct, type StockStatus } from "@/components/product/product-card";
import type { ProductDetail } from "@/components/product/product-data";
import { DeviceFrontView } from "./product-illustrations";

// Tồn kho thật CHỈ xác nhận được cho SKU đã khai trong STOCK_BY_ID gốc (product-highlights-data.ts,
// trang chủ) — xem ghi chú tương tự trong related-products.tsx.
const KNOWN_STOCK: Partial<Record<number, StockStatus>> = {
  472: "in-stock",
};

// SKU đã loại khỏi gợi ý "mua cùng" theo yêu cầu — Satel AXD-200 (id 469) vẫn còn hiện ở
// "Sản phẩm liên quan" (related-products.tsx, lọc theo category thô), nhưng KHÔNG phải gợi ý
// mua-cùng phù hợp cho trang này.
const EXCLUDED_IDS = new Set([469]);

// MOCKUP — trùng đúng giá mock ở product-hero.tsx (SP này đang product.price = 0, chưa niêm yết
// thật). Duplicate local thay vì export/import — theo đúng quy ước các map nhỏ (STOCK_LABEL...)
// đã lặp lại độc lập giữa product-card.tsx/product-hero.tsx trong file này.
const MOCK_CURRENT_PRICE = 2_450_000;

/**
 * "Mua cùng nhau" — widget kiểu "frequently bought together": sản phẩm ĐANG XEM + (các) sản
 * phẩm gợi ý cùng category, nối bằng dấu "+", có checkbox bật/tắt từng gợi ý và tổng giá + 1 nút
 * thêm tất cả vào giỏ — khác hẳn 1 dãy ProductCard rời rạc như `RelatedProducts` bên dưới trang,
 * đúng ý "đặc biệt hơn" theo yêu cầu.
 *
 * Catalog CHƯA có quan hệ "thường mua cùng" thật (chỉ có categoryGroup) — xem ghi chú tương tự ở
 * bản trước, lọc theo category rồi trừ EXCLUDED_IDS. "use client" vì cần state checkbox + phản
 * hồi nút thêm giỏ (mockup, giống pattern handleAddToCart product-card.tsx).
 */
export function ProductBoughtTogether({ product }: { product: ProductDetail }) {
  const suggestions: HighlightProduct[] = searchProducts
    .filter((p) => p.categoryGroup === product.categoryGroup && !EXCLUDED_IDS.has(p.id))
    .map((p) => ({ ...p, stock: KNOWN_STOCK[p.id] ?? null }));

  const [checked, setChecked] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(suggestions.map((s) => [s.id, true])),
  );
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  if (suggestions.length === 0) return null;

  const currentPrice = product.price > 0 ? product.price : MOCK_CURRENT_PRICE;
  const checkedSuggestions = suggestions.filter((s) => checked[s.id]);
  const total = currentPrice + checkedSuggestions.reduce((sum, s) => sum + s.price, 0);
  const itemCount = 1 + checkedSuggestions.length;

  const handleAddAll = () => {
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1600);
  };

  return (
    <section className="mx-auto max-w-[var(--container-max)] px-4 pb-12 md:px-8 lg:px-16">
      <h2 className="mb-5 text-[22px] font-bold text-foreground">Mua cùng nhau</h2>

      <div className="rounded-2xl border-2 border-accent/20 bg-accent/5 p-5 md:p-6">
        <div className="flex flex-wrap items-start gap-3">
          {/* Sản phẩm đang xem — viền accent để phân biệt với gợi ý, checkbox luôn tick + disabled
              (thay vì bỏ hẳn) để giữ đúng cấu trúc/chiều cao hàng như tile gợi ý bên cạnh — tránh
              lệch dòng và thiếu thông tin (SKU) so với tile gợi ý. */}
          <div className="flex w-[124px] shrink-0 flex-col items-center gap-2 sm:w-[140px]">
            <label className="flex items-center gap-1.5 text-[11px] font-medium text-accent">
              <input type="checkbox" checked disabled className="h-3.5 w-3.5 accent-accent" />
              Sản phẩm này
            </label>
            <div className="flex aspect-square w-full items-center justify-center rounded-xl border-2 border-accent bg-card p-3">
              <DeviceFrontView panelColor={product.variants[0].panelColor} inkColor={product.variants[0].inkColor} />
            </div>
            <p className="line-clamp-2 min-h-[2.75em] text-center text-xs font-semibold leading-snug text-foreground">
              {product.name}
            </p>
            <p className="text-[11px] tabular-nums text-muted-foreground">SKU: {product.variants[0].sku}</p>
            <p className="text-sm font-bold tabular-nums text-foreground">{formatPriceVnd(currentPrice)}</p>
          </div>

          {suggestions.map((s) => (
            <div key={s.id} className="flex items-start gap-3">
              <Plus size={18} weight="bold" className="mt-[52px] shrink-0 text-muted-foreground" aria-hidden="true" />

              <div className="flex w-[124px] shrink-0 flex-col items-center gap-2 sm:w-[140px]">
                <label className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={checked[s.id] ?? true}
                    onChange={(e) => setChecked((c) => ({ ...c, [s.id]: e.target.checked }))}
                    className="h-3.5 w-3.5 accent-accent"
                  />
                  Thêm sản phẩm
                </label>
                <Link
                  href={s.url}
                  className="flex aspect-square w-full items-center justify-center rounded-xl border border-border bg-muted p-2 transition-colors hover:border-accent"
                >
                  <span className="px-[10%] text-center text-[10.5px] leading-snug text-muted-foreground">
                    Ảnh sản phẩm
                    <br />
                    đang cập nhật
                  </span>
                </Link>
                <Link
                  href={s.url}
                  className="line-clamp-2 min-h-[2.75em] text-center text-xs font-semibold leading-snug text-foreground hover:text-accent"
                >
                  {s.name}
                </Link>
                <p className="text-[11px] tabular-nums text-muted-foreground">SKU: {skuOf(s.id)}</p>
                <p className="text-sm font-bold tabular-nums text-foreground">{formatPriceVnd(s.price)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-accent/20 pt-4">
          <div>
            <div className="text-[13px] text-muted-foreground">Tổng cộng cho {itemCount} sản phẩm</div>
            <div className="text-xl font-bold tabular-nums text-foreground">{formatPriceVnd(total)}</div>
          </div>
          <button
            type="button"
            onClick={handleAddAll}
            className={`flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-[14px] font-semibold text-on-accent transition-[filter,background-color] duration-150 ease-out hover:brightness-110 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              added ? "bg-success" : "bg-accent"
            }`}
          >
            {added ? <Check size={17} weight="bold" aria-hidden="true" /> : <ShoppingCart size={17} weight="bold" aria-hidden="true" />}
            {added ? "Đã thêm vào giỏ" : `Thêm ${itemCount} sản phẩm vào giỏ`}
          </button>
        </div>
      </div>
    </section>
  );
}

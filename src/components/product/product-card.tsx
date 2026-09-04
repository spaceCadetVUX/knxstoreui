"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Minus, Plus, ShoppingCart } from "@phosphor-icons/react";
import { categoryGroupShortLabel } from "@/components/nav/nav-data";
import { formatPriceVnd, type SearchProduct } from "@/components/nav/search-data";

export type StockStatus = "in-stock" | "backorder" | "out-of-stock";

export type HighlightProduct = SearchProduct & {
  /** null = giá liên hệ (price === 0) — chưa công bố tồn kho cho SKU dạng báo giá. */
  stock: StockStatus | null;
};

/** "SP-000006" — suy từ id, KHÔNG phải mã SKU thật trong ERP/hệ thống kho (chưa có trường này
 * trong catalog). Thay bằng mã thật khi có nguồn dữ liệu tương ứng. */
export function skuOf(id: number): string {
  return `SP-${String(id).padStart(6, "0")}`;
}

/**
 * Thẻ sản phẩm dùng chung — carousel trang chủ (`product-highlights.tsx`) và lưới "Sản phẩm
 * liên quan" trên trang chi tiết sản phẩm (`related-products.tsx`). Tách ra từ
 * `product-highlights.tsx` (bản gốc: `ProductHighlightCard`, không export) để không chép lại
 * logic giá/VAT/tồn kho/stepper/giỏ hàng ở 2 nơi.
 *
 * "use client" vì cần state (stepper số lượng, phản hồi "đã thêm") — do đó import icon
 * @phosphor-icons/react bản top-level (createContext) là AN TOÀN ở đây, khác các server
 * component khác trong home/product/ phải dùng subpath /ssr.
 *
 * `className`: nơi gọi truyền vào để quyết định kích thước/vị trí trong layout cha (carousel
 * cần width cố định + scroll-snap, lưới grid thì không cần) — bản thân thẻ chỉ định hình giao
 * diện (bo góc, viền, nền, hover).
 */
export function ProductCard({
  product,
  className = "",
}: {
  product: HighlightProduct;
  className?: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, []);

  const hasPrice = product.price > 0;
  const badge = categoryGroupShortLabel[product.categoryGroup];

  // Chưa có cart/checkout thật trên site — bấm chỉ đổi trạng thái nút (phản hồi UI), KHÔNG lưu
  // giỏ hàng. Nối logic thật (state toàn site hoặc gọi API) khi site có cart.
  const handleAddToCart = () => {
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1600);
  };

  return (
    <li
      className={`flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${className}`}
    >
      {/* Ô ảnh: catalog thật CHƯA có ảnh sản phẩm — placeholder phẳng bg-muted, giống pattern đã
          dùng ở shop-by-category.tsx (không icon giả lập để tránh nhìn như ảnh thật). */}
      <div className="relative flex aspect-square items-center justify-center bg-muted">
        <span className="absolute left-2.5 top-2.5 rounded-full bg-foreground/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-card">
          {badge}
        </span>
        <span className="px-[20%] text-center text-xs leading-snug text-muted-foreground">
          Ảnh sản phẩm
          <br />
          đang cập nhật
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-4 pb-4 pt-3.5">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {product.brand}
        </div>
        <p className="-mt-1.5 line-clamp-2 min-h-[2.7em] text-[14.5px] font-semibold leading-snug text-foreground">
          {product.name}
        </p>
        {/* "SP-xxxxxx" suy từ id (search-data.ts), KHÔNG phải mã SKU thật trong ERP — xem skuOf. */}
        <div className="-mt-1 text-xs tabular-nums text-muted-foreground">SKU: {skuOf(product.id)}</div>

        <div className="mt-auto pt-0.5">
          {hasPrice ? (
            <>
              <div className="text-[19px] font-bold tracking-tight tabular-nums text-foreground">
                {formatPriceVnd(product.price)}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">Giá chưa gồm VAT</div>
            </>
          ) : (
            <>
              <div className="text-base font-semibold text-foreground">Liên hệ báo giá</div>
              <div className="mt-0.5 text-xs text-muted-foreground">Giá theo dự án / số lượng</div>
            </>
          )}
        </div>

        {hasPrice ? (
          product.stock === "out-of-stock" ? (
            // Hết hàng: khóa hẳn thao tác mua thay vì để stepper/nút giỏ hàng hoạt động —
            // tránh khách đặt được SKU không có sẵn.
            <button
              type="button"
              disabled
              aria-label={`${product.name} tạm hết hàng`}
              className="flex h-10 cursor-not-allowed items-center justify-center rounded-[10px] border border-border bg-muted text-[13.5px] font-semibold text-muted-foreground"
            >
              Hết hàng
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div
                role="group"
                aria-label={`Số lượng ${product.name}`}
                className="flex h-10 flex-1 items-center overflow-hidden rounded-[10px] border border-border"
              >
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Giảm số lượng"
                  className="flex h-full w-8 items-center justify-center text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                >
                  <Minus size={14} weight="bold" aria-hidden="true" />
                </button>
                <output className="flex-1 text-center text-sm font-semibold tabular-nums">
                  {quantity}
                </output>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  aria-label="Tăng số lượng"
                  className="flex h-full w-8 items-center justify-center text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
                >
                  <Plus size={14} weight="bold" aria-hidden="true" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                aria-label={`Thêm ${product.name} vào giỏ`}
                className={`relative flex h-10 w-11 shrink-0 items-center justify-center rounded-[10px] text-on-accent transition-[filter,background-color] duration-150 ease-out hover:brightness-110 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card ${
                  added ? "bg-success" : "bg-accent"
                }`}
              >
                <span
                  className={`pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-[11px] font-medium text-card transition-opacity duration-150 ${
                    added ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Đã thêm ✓
                </span>
                {added ? (
                  <Check size={18} weight="bold" aria-hidden="true" />
                ) : (
                  <ShoppingCart size={18} weight="bold" aria-hidden="true" />
                )}
              </button>
            </div>
          )
        ) : (
          <Link
            href={product.url}
            className="flex h-10 items-center justify-center gap-1.5 rounded-[10px] border border-accent text-[13.5px] font-semibold text-accent transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Liên hệ tư vấn
            <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
          </Link>
        )}

        {/* Luôn render 1 hàng cố định chiều cao (min-h) — kể cả khi stock === null (SKU giá liên
            hệ báo giá, chưa công bố tồn kho) — để card không lùn hơn card có dòng tồn kho, tránh
            lệch hàng stepper/nút giỏ giữa các thẻ cạnh nhau trong cùng 1 grid row. Chỉ 3 trạng
            thái hiển thị chữ, không kèm chú thích thời gian giao. */}
        <div className="flex min-h-[17px] items-center gap-1.5 text-xs text-muted-foreground">
          {product.stock === "in-stock" && (
            <>
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" aria-hidden="true" />
              Còn hàng
            </>
          )}
          {product.stock === "backorder" && (
            <>
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-pending" aria-hidden="true" />
              Đặt trước
            </>
          )}
          {product.stock === "out-of-stock" && (
            <>
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" aria-hidden="true" />
              Hết hàng
            </>
          )}
        </div>
      </div>
    </li>
  );
}

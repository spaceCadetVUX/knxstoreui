"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CaretLeft,
  CaretRight,
  Check,
  Minus,
  Plus,
  ShoppingCart,
} from "@phosphor-icons/react";
import { categoryGroupShortLabel } from "@/components/nav/nav-data";
import { formatPriceVnd } from "@/components/nav/search-data";
import { highlightProducts, skuOf, type HighlightProduct } from "./product-highlights-data";

const SECTION_TITLE = "Sản phẩm mới";
const VIEW_ALL_HREF = "/san-pham";
const VIEW_ALL_LABEL = "Xem tất cả sản phẩm";

/**
 * "Product Highlights" — carousel ngang, tối đa 4 thẻ/hàng ở desktop (3 tablet, 2 mobile, xem
 * width trong ProductHighlightCard), scroll-snap + 2 nút mũi tên cuộn theo TRANG (đúng 1 lượt =
 * đúng số thẻ đang thấy, không phải từng thẻ) — khớp yêu cầu trực tiếp, xem preview đã duyệt.
 *
 * "use client" vì cần state (stepper số lượng, trạng thái nút mũi tên bật/tắt theo scrollLeft) —
 * do đó import icon @phosphor-icons/react bản top-level (createContext) là AN TOÀN ở đây, khác
 * các section server component khác trong home/ phải dùng subpath /ssr.
 */
export function ProductHighlights() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateArrows = () => {
      const maxScroll = track.scrollWidth - track.clientWidth - 1;
      setCanScrollPrev(track.scrollLeft > 0);
      setCanScrollNext(track.scrollLeft < maxScroll);
    };
    updateArrows();

    track.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      track.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scrollByPage = (direction: 1 | -1) => {
    trackRef.current?.scrollBy({ left: direction * trackRef.current.clientWidth, behavior: "smooth" });
  };

  return (
    <section className="bg-card py-16 md:py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-4 md:px-8 lg:px-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {SECTION_TITLE}
          </h2>
          <Link
            href={VIEW_ALL_HREF}
            className="group inline-flex shrink-0 items-center gap-1 rounded-sm text-sm font-medium text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {VIEW_ALL_LABEL}
            <ArrowUpRight
              size={14}
              weight="bold"
              aria-hidden="true"
              className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* Nút mũi tên chỉ hiện ở lg+ (đủ chỗ để không đè lên thẻ đầu/cuối) — mobile/tablet dùng
            vuốt chạm + scroll-snap là đủ, đúng convention carousel phổ biến. */}
        <div className="relative mt-10">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={!canScrollPrev}
            aria-label="Xem sản phẩm trước"
            className="absolute left-[-22px] top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-md transition-[box-shadow,background-color] duration-150 ease-out hover:bg-muted hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-default disabled:opacity-35 disabled:shadow-sm disabled:hover:bg-card lg:flex"
          >
            <CaretLeft size={18} weight="bold" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={!canScrollNext}
            aria-label="Xem sản phẩm tiếp theo"
            className="absolute right-[-22px] top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-md transition-[box-shadow,background-color] duration-150 ease-out hover:bg-muted hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-default disabled:opacity-35 disabled:shadow-sm disabled:hover:bg-card lg:flex"
          >
            <CaretRight size={18} weight="bold" aria-hidden="true" />
          </button>

          <ul
            ref={trackRef}
            className="flex list-none gap-5 overflow-x-auto p-0 [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {highlightProducts.map((product) => (
              <ProductHighlightCard key={product.id} product={product} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ProductHighlightCard({ product }: { product: HighlightProduct }) {
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
      // rounded-xl (12px) riêng cho thẻ sản phẩm, không dùng --card-radius (20px) — token đó
      // còn dùng chung cho dropdown/search panel (navbar.tsx, search-box.tsx), giảm thẳng token
      // sẽ ảnh hưởng luôn các nơi đó. 12px khớp với rounded-[10px] của stepper/nút giỏ hàng bên
      // trong card, nhìn đồng bộ hơn 20px cũ (bo quá tròn so với các nút nhỏ bên trong).
      className="flex w-[calc((100%-20px)/2)] shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-card transition-[transform,box-shadow] duration-300 ease-out [scroll-snap-align:start] hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-[calc((100%-40px)/3)] lg:w-[calc((100%-60px)/4)]"
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
        {/* "SP-xxxxxx" suy từ id (search-data.ts), KHÔNG phải mã SKU thật trong ERP — xem
            product-highlights-data.ts. */}
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

        {/* Chỉ 3 trạng thái tồn kho hiển thị trên thẻ — không kèm chú thích thời gian giao, và
            không hiện gì khi stock === null (SKU giá liên hệ báo giá, chưa công bố tồn kho). */}
        {product.stock === "in-stock" && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" aria-hidden="true" />
            Còn hàng
          </div>
        )}
        {product.stock === "backorder" && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-pending" aria-hidden="true" />
            Đặt trước
          </div>
        )}
        {product.stock === "out-of-stock" && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" aria-hidden="true" />
            Hết hàng
          </div>
        )}
      </div>
    </li>
  );
}

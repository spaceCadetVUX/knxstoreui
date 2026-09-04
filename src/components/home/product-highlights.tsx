"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { ProductCard } from "@/components/product/product-card";
import { highlightProducts } from "./product-highlights-data";

const SECTION_TITLE = "Sản phẩm mới";
const VIEW_ALL_HREF = "/san-pham";
const VIEW_ALL_LABEL = "Xem tất cả sản phẩm";

// Width cố định + scroll-snap cho từng thẻ trong carousel (4 thẻ/hàng desktop, 3 tablet, 2
// mobile) — truyền qua className vì ProductCard dùng chung với lưới "Sản phẩm liên quan"
// (related-products.tsx) không cần width cố định kiểu này.
const CARD_WIDTH_CLASS =
  "w-[calc((100%-20px)/2)] shrink-0 [scroll-snap-align:start] sm:w-[calc((100%-40px)/3)] lg:w-[calc((100%-60px)/4)]";

/**
 * "Product Highlights" — carousel ngang, tối đa 4 thẻ/hàng ở desktop (3 tablet, 2 mobile, xem
 * CARD_WIDTH_CLASS), scroll-snap + 2 nút mũi tên cuộn theo TRANG (đúng 1 lượt = đúng số thẻ
 * đang thấy, không phải từng thẻ) — khớp yêu cầu trực tiếp, xem preview đã duyệt.
 *
 * "use client" vì cần state nút mũi tên bật/tắt theo scrollLeft — do đó import icon
 * @phosphor-icons/react bản top-level (createContext) là AN TOÀN ở đây, khác các section server
 * component khác trong home/ phải dùng subpath /ssr. Thẻ sản phẩm (giá/VAT/tồn kho/giỏ hàng) nằm
 * ở `ProductCard` (src/components/product/product-card.tsx) — dùng chung với trang chi tiết
 * sản phẩm, xem product-detail-page-plan.md.
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
              <ProductCard key={product.id} product={product} className={CARD_WIDTH_CLASS} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}


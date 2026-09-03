"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { protocolCategories } from "./protocol-categories-data";

/**
 * "Giải pháp theo giao thức" — pill-tabs trượt ngang, thay cho grid tĩnh cũ (đã duyệt thiết
 * kế qua bản preview, xem lịch sử trao đổi). Bấm/focus 1 pill sẽ trượt nội dung sang, hướng
 * trượt phụ thuộc pill đó nằm bên trái hay phải tab đang chọn.
 *
 * Toàn bộ 9 panel LUÔN render trong DOM (không tạo/xoá bằng JS) — chỉ đổi transform + z-index
 * theo state `active`, để nội dung (h3 + p mỗi giao thức) luôn có trong HTML ban đầu cho SEO/
 * crawler, panel không active chỉ bị đẩy ra ngoài khung nhìn bằng translateX chứ không gỡ khỏi
 * DOM. Đây là pattern "tabs" chuẩn ARIA (role=tablist/tab/tabpanel) — Google xác nhận nội dung
 * kiểu tab/accordion được tính đầy đủ trọng số như nội dung hiển thị thường, không bị coi là
 * "hidden content".
 *
 * Heading: section title (mới thêm) là h2; tên từng giao thức trong panel là h3 (nằm dưới h2
 * của section, đúng phân cấp — trước đó dùng h2 cho tên danh mục vì lúc đó là grid tĩnh không
 * có heading cha nào bao ngoài cùng cấp).
 *
 * Không icon ở cả panel content lẫn pill tab (đã gỡ theo yêu cầu, chỉ còn chữ). Layout ảnh/text
 * xen kẽ theo parity index (biến `reversed`), không cố định 1 phía.
 */
export function ProtocolCategories() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  function goTo(idx: number, focusTab = false) {
    setActive(idx);
    if (focusTab) tabRefs.current[idx]?.focus();
  }

  function onTabKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, idx: number) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo((idx + 1) % protocolCategories.length, true);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo((idx - 1 + protocolCategories.length) % protocolCategories.length, true);
    }
  }

  return (
    <section className="bg-card py-16 md:py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-4 md:px-8 lg:px-16">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Phủ kín mọi giao thức tự động hoá tòa nhà.
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            9 giao thức chính hãng KNXStore đang phân phối, từ bus có dây tới wireless mesh, mỗi
            hệ đều tích hợp liền mạch vào cùng một hệ thống.
          </p>
        </div>

        {/* Tab list — pill, tab đang chọn nền foreground/chữ trắng giống CTA "Buy" pill ở hero.tsx */}
        <div
          role="tablist"
          aria-label="Giải pháp theo giao thức"
          className="mt-10 flex flex-wrap gap-2.5"
        >
          {protocolCategories.map((item, idx) => {
            const isActive = idx === active;
            return (
              <button
                key={item.key}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${item.key}`}
                aria-selected={isActive}
                aria-controls={`${baseId}-panel-${item.key}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => goTo(idx, true)}
                onKeyDown={(e) => onTabKeyDown(e, idx)}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-[background-color,color,border-color,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card motion-reduce:transition-none ${
                  isActive
                    ? "border-[var(--category-cta)] bg-[var(--category-cta)] text-on-accent shadow-sm"
                    : "border-border bg-card text-foreground hover:border-foreground"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Stage — cao hơn 40% so với bản đầu (520px/420px gốc → 730px/590px) theo yêu cầu */}
        <div className="relative mt-10 min-h-[730px] overflow-hidden rounded-[var(--card-radius)] shadow-lg md:min-h-[590px]">
          {protocolCategories.map((item, idx) => {
            const isActive = idx === active;
            const offset = idx === active ? 0 : idx < active ? -100 : 100;
            // Xen kẽ trái/phải theo parity của index: tab chẵn = text trái/ảnh phải (mặc định),
            // tab lẻ = đảo ngược (ảnh trái/text phải) — lặp lại pattern mỗi 2 tab khi bấm qua.
            const reversed = idx % 2 === 1;
            return (
              <div
                key={item.key}
                id={`${baseId}-panel-${item.key}`}
                role="tabpanel"
                aria-labelledby={`${baseId}-tab-${item.key}`}
                aria-hidden={!isActive}
                inert={!isActive}
                className="absolute inset-0 grid grid-cols-1 grid-rows-[auto_1fr] transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none md:grid-cols-2 md:grid-rows-1"
                style={{ transform: `translateX(${offset}%)` }}
              >
                {/* Placeholder ảnh — nền phẳng, chờ ảnh thật (xem quy ước ở shop-by-category.tsx). */}
                <div
                  className={`relative min-h-[240px] bg-muted md:min-h-0 ${
                    reversed ? "order-last md:order-1" : "order-first md:order-2"
                  }`}
                >
                  <span className="absolute inset-0 flex items-center justify-center px-4 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Ảnh sản phẩm {item.label}
                    <br />
                    (chờ ảnh thật)
                  </span>
                </div>

                <div
                  className={`flex flex-col justify-center gap-3.5 p-8 sm:p-10 md:p-12 ${
                    reversed ? "md:order-2" : "md:order-1"
                  }`}
                >
                  <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    {item.label}
                  </h3>
                  <p className="max-w-[46ch] text-[15px] leading-relaxed text-muted-foreground">
                    {item.subtitle}
                  </p>
                  <Link
                    href={item.href}
                    tabIndex={isActive ? 0 : -1}
                    className="mt-1.5 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--category-cta)] px-5 py-3 text-sm font-bold text-on-accent shadow-sm transition-[filter,box-shadow,transform] duration-150 ease-out hover:-translate-y-0.5 hover:shadow-md hover:brightness-110 active:translate-y-0 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    {item.ctaLabel}
                    <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

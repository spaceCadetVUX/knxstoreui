"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import { Reveal } from "./reveal";
import { categoryIcon } from "./nav-data";
import { searchProducts, formatPriceVnd, normalizeSearchText } from "./search-data";

const MAX_RESULTS = 5;

/**
 * `variant="hero"` — nhánh MỚI cho ô search lớn ở trang chủ (hero.tsx), thêm bên cạnh
 * `"desktop"`/`"mobile"` sẵn có trong navbar — KHÔNG đổi bất kỳ nhánh nào trong 2 cái đó,
 * để hành vi/giao diện search trong nav giữ nguyên 100% (xem hero-redesign-plan.md mục 11).
 * Icon đặt bên TRÁI + nút mũi tên tròn bên phải (khác nav: icon phải, không nút) — phân biệt
 * thị giác chủ ý "đây là ô nhập lệnh chính", giống pattern hero của Lovable/v0/ChatGPT.
 */
export function SearchBox({
  variant = "desktop",
  className = "",
}: {
  variant?: "desktop" | "mobile" | "hero";
  className?: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const router = useRouter();

  const results = useMemo(() => {
    const q = normalizeSearchText(query);
    if (!q) return [];
    return searchProducts
      .filter(
        (p) =>
          normalizeSearchText(p.name).includes(q) ||
          normalizeSearchText(p.brand).includes(q),
      )
      .slice(0, MAX_RESULTS);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const showPanel = open && query.trim().length > 0;

  function goToResult(url: string) {
    setOpen(false);
    router.push(url);
  }

  function goToSearch() {
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/tim-kiem?q=${encodeURIComponent(q)}`);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      if (!results.length) return;
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      if (!results.length) return;
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && results[activeIndex]) {
        e.preventDefault();
        goToResult(results[activeIndex].url);
      } else if (variant === "hero") {
        // Chỉ nhánh hero: Enter mà chưa chọn gợi ý nào thì nhảy thẳng trang kết quả — nav
        // (desktop/mobile) giữ nguyên hành vi cũ (Enter không làm gì nếu chưa chọn gợi ý).
        e.preventDefault();
        goToSearch();
      }
    }
  }

  const isHero = variant === "hero";
  const inputPadding = variant === "mobile" ? "py-2.5" : "py-2";
  const placeholder = isHero
    ? "Tìm theo tên sản phẩm, thương hiệu, mã SKU hoặc giao thức (KNX, DALI-2, Casambi, Matter)..."
    : "Tìm kiếm sản phẩm...";

  return (
    <div className={`relative ${className}`} ref={rootRef}>
      <label className="relative block">
        <span className="sr-only">Tìm kiếm sản phẩm</span>
        {isHero && (
          <MagnifyingGlass
            size={19}
            aria-hidden="true"
            className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
        )}
        <input
          type="search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-activedescendant={
            activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
          }
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          // Nền search trước dùng bg-muted/60 (bán trong suốt) + border — hợp khi header nền xám
          // mờ (--background cũ). Header giờ nền trắng đặc (bg-card) nên đổi sang fill xám đặc
          // bg-muted, bỏ viền — pill xám kín trên nền trắng kiểu Apple (Spotlight/App Store),
          // không cần border để phân định vì độ tương phản đã đủ.
          // Nhánh hero: rounded-2xl (không phải rounded-full) + cao hơn hẳn (h-[60px]) — bo góc
          // mềm hơn "pill" để gợi cảm giác "ô nhập lệnh" kiểu Lovable/v0, tạo khác biệt thị giác
          // chủ ý so với thanh search nav (xem hero-redesign-plan.md mục 4.1).
          className={
            isHero
              ? "h-[60px] w-full rounded-2xl bg-muted pl-14 pr-16 text-base text-foreground placeholder:text-muted-foreground transition-shadow duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:shadow-[0_0_0_4px_rgba(0,113,227,0.12)]"
              : `w-full rounded-full bg-muted ${inputPadding} pl-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground transition-shadow duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:shadow-[0_0_0_4px_rgba(0,113,227,0.12)]`
          }
        />
        {isHero ? (
          <button
            type="button"
            aria-label="Tìm kiếm"
            onClick={goToSearch}
            disabled={!query.trim()}
            className="absolute right-2.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl bg-accent text-on-accent transition-[filter] duration-150 ease-out hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:brightness-100 motion-reduce:transition-none"
          >
            <ArrowRight size={18} weight="bold" aria-hidden="true" />
          </button>
        ) : (
          <MagnifyingGlass
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
        )}
      </label>

      {showPanel && (
        <Reveal
          role="listbox"
          id={listId}
          className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-[var(--card-radius)] border border-border bg-card p-2 shadow-lg"
        >
          {results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Không tìm thấy sản phẩm phù hợp với “{query}”.
            </p>
          ) : (
            <>
              {results.map((item, idx) => {
                const CategoryIcon = categoryIcon[item.categoryGroup];
                const active = idx === activeIndex;
                return (
                  <Link
                    key={item.id}
                    id={`${listId}-option-${idx}`}
                    role="option"
                    aria-selected={active}
                    href={item.url}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseDown={(e) => e.preventDefault()} // giữ focus input, tránh blur đóng panel trước khi click ăn
                    onClick={() => setOpen(false)}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                      active ? "bg-muted" : "hover:bg-muted"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-accent">
                      <CategoryIcon size={20} aria-hidden="true" />
                    </span>
                    <span className="flex min-w-0 flex-1 items-start justify-between gap-3">
                      <span className="min-w-0 text-left">
                        <span className="block truncate text-left text-sm text-foreground">
                          {item.name}
                        </span>
                        <span className="mt-0.5 block truncate text-left text-xs text-muted-foreground">
                          {item.brand}
                        </span>
                      </span>
                      <span className="shrink-0 whitespace-nowrap text-sm font-medium text-accent">
                        {formatPriceVnd(item.price)}
                      </span>
                    </span>
                  </Link>
                );
              })}
              <div className="mt-1 border-t border-border pt-1">
                <Link
                  href={`/tim-kiem?q=${encodeURIComponent(query)}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setOpen(false)}
                  className="block cursor-pointer rounded-lg px-3 py-2 text-center text-sm font-medium text-accent transition-colors hover:bg-muted"
                >
                  Xem tất cả kết quả cho “{query}” →
                </Link>
              </div>
            </>
          )}
        </Reveal>
      )}
    </div>
  );
}

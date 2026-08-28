"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Reveal } from "./reveal";
import { categoryIcon } from "./nav-data";
import { searchProducts, formatPriceVnd, normalizeSearchText } from "./search-data";

const MAX_RESULTS = 5;

export function SearchBox({
  variant = "desktop",
  className = "",
}: {
  variant?: "desktop" | "mobile";
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
    } else if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      e.preventDefault();
      goToResult(results[activeIndex].url);
    }
  }

  const inputPadding = variant === "mobile" ? "py-2.5" : "py-2";

  return (
    <div className={`relative ${className}`} ref={rootRef}>
      <label className="relative block">
        <span className="sr-only">Tìm kiếm sản phẩm</span>
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
          placeholder="Tìm kiếm sản phẩm..."
          className={`w-full rounded-full border border-border bg-muted/60 ${inputPadding} pl-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground transition-shadow duration-200 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent/50 focus-visible:shadow-[0_0_0_3px_rgba(15,70,124,0.10)]`}
        />
        <MagnifyingGlass
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
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
                    className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                      active ? "bg-muted" : "hover:bg-muted"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-accent">
                      <CategoryIcon size={20} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-foreground">
                        {item.name}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span>{item.brand}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-medium text-accent">
                          {formatPriceVnd(item.price)}
                        </span>
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

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  User,
  CaretDown,
  ArrowUpRight,
  List,
  X,
} from "@phosphor-icons/react";
import {
  productCategories,
  solutions,
  topBrands,
  type NavGroup,
} from "./nav-data";
import { Reveal } from "./reveal";
import { SearchBox } from "./search-box";

type NavItem =
  | { kind: "link"; label: string; href: string }
  | { kind: "dropdown"; group: NavGroup };

// Thứ tự đúng theo mockup "Navbar 28": Trang chủ | Danh mục sản phẩm▾ | Giải pháp▾ | Thương hiệu▾ | Dự án | Blog
const navItems: NavItem[] = [
  { kind: "link", label: "Trang chủ", href: "/" },
  { kind: "dropdown", group: productCategories },
  { kind: "dropdown", group: solutions },
  { kind: "dropdown", group: topBrands },
  { kind: "link", label: "Dự án", href: "/du-an" },
  { kind: "link", label: "Blog", href: "/blog" },
];

/** "/" chỉ active tại chính trang chủ; các mục khác active khi pathname nằm trong nhánh đó. */
function isActiveHref(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// "group" để NavUnderline bên trong nghe được hover của link cha. Gạch chân là 1 span
// absolute riêng (xem NavUnderline) nên đổi active/hover không đụng box model — không layout shift.
// Font + màu Apple giờ đã là token toàn site (--font-sans/body font-family, --accent trong
// globals.css) nên nav chỉ cần reference text-accent như bình thường, không hardcode nữa.
const navLinkClass = (active: boolean) =>
  `group relative flex items-center gap-1 py-2 text-[15px] tracking-[-0.012em] transition-colors cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
    active ? "font-semibold text-accent" : "font-medium text-foreground/80 hover:text-accent"
  }`;

/** Gạch chân "expand" từ trái sang phải khi hover (scaleX 0→1, 200ms); active thì luôn hiện sẵn. */
function NavUnderline({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full bg-accent transition-transform duration-200 ease-out motion-reduce:transition-none ${
        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      }`}
    />
  );
}

// Nút CTA duy nhất trong nav — solid fill, hover đơn giản: lift nhẹ + sáng hơn, không pointer-tracking.
const ctaClass =
  "inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-on-accent shadow-sm transition-[filter,box-shadow,transform] duration-150 ease-out cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:brightness-110 active:translate-y-0 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const lastScrollY = useRef(0);
  // Timestamp tới khi nào bỏ qua toggle do scroll gây ra. Ngay sau khi row 2 đổi trạng thái,
  // chiều cao header đổi làm nội dung dưới dịch chuyển — trình duyệt (scroll anchoring) có thể
  // tự bù trừ scrollY gần như ngay lập tức, và bù trừ đó lại bị đọc nhầm thành user scroll,
  // gây vòng lặp đóng/mở liên tục. Khoá lại trong đúng thời lượng transition (300ms) + buffer.
  const suppressUntil = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > 8);

      const now = Date.now();
      if (now < suppressUntil.current) {
        lastScrollY.current = y;
        return;
      }

      // Hide-on-scroll-down / show-on-scroll-up cho row 2, có ngưỡng 10px chống rung
      // khi scroll nhẹ (trackpad/momentum). Luôn expand khi ở sát top trang.
      if (y <= 8) {
        setNavCollapsed((prev) => {
          if (prev) suppressUntil.current = now + 350;
          return false;
        });
      } else if (y > lastScrollY.current + 10) {
        setNavCollapsed((prev) => {
          if (!prev) suppressUntil.current = now + 350;
          return true;
        });
      } else if (y < lastScrollY.current - 10) {
        setNavCollapsed((prev) => {
          if (prev) suppressUntil.current = now + 350;
          return false;
        });
      }
      lastScrollY.current = y;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border/70 backdrop-saturate-150 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled
          ? "bg-card/90 shadow-sm backdrop-blur-xl"
          : "bg-card/75 backdrop-blur-lg"
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[60] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent"
      >
        Bỏ qua, đến nội dung chính
      </a>

      {/* Row 1 — logo / search / cart / account. Luôn full height, không collapse khi scroll. */}
      <div className="mx-auto max-w-[var(--container-max)] px-4 md:px-8 lg:px-16">
        <div className="flex h-16 items-center justify-between gap-4 sm:gap-6">
          <Link
            href="/"
            className="shrink-0 transition-transform duration-150 hover:scale-[1.03] active:scale-[0.98]"
            aria-label="KNXStore — Trang chủ"
          >
            {/* Logo mới nhận từ Zalo (KNX STORE_Logo 3.svg, 2026-08-29) — bản gốc canvas vuông
                481.89x481.89 nhưng chữ chỉ chiếm 1 dải ngang hẹp giữa canvas; đã crop lại
                viewBox trong file (public/logo/knxstore-logo.svg) khớp bounding box thật của
                nét chữ (đo bằng getBBox) để không bị khoảng trắng thừa trên/dưới khi hiển thị. */}
            <Image
              src="/logo/knxstore-logo.svg"
              alt="KNXStore"
              width={384}
              height={61}
              priority
              className="h-5 w-auto sm:h-6"
            />
          </Link>

          <div className="hidden flex-1 max-w-md md:block">
            <SearchBox />
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Giỏ hàng"
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors cursor-pointer hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ShoppingCart size={20} aria-hidden="true" />
              <CartBadge />
            </button>
            <button
              type="button"
              aria-label="Tài khoản"
              className="flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors cursor-pointer hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <User size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="relative ml-1 flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors cursor-pointer hover:bg-muted md:hidden"
            >
              <List
                size={22}
                aria-hidden="true"
                className={`absolute transition-all duration-200 ease-out ${
                  mobileOpen ? "rotate-45 opacity-0" : "rotate-0 opacity-100"
                }`}
              />
              <X
                size={22}
                aria-hidden="true"
                className={`absolute transition-all duration-200 ease-out ${
                  mobileOpen ? "rotate-0 opacity-100" : "-rotate-45 opacity-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Row 2 — nav links + CTA (desktop). Collapse khi scroll xuống, expand khi scroll lên
          hoặc ở top trang; dùng grid trick (0fr/1fr) để animate ra intrinsic height mượt. */}
      <div
        aria-hidden={navCollapsed}
        className="hidden grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none md:grid"
        style={{ gridTemplateRows: navCollapsed ? "0fr" : "1fr" }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border/70">
            <div className="mx-auto max-w-[var(--container-max)] px-4 md:px-8 lg:px-16">
              <div className="flex h-12 items-center justify-between">
                <nav className="flex items-center gap-6" aria-label="Điều hướng chính">
                  {navItems.map((item) =>
                    item.kind === "link" ? (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActiveHref(pathname, item.href) ? "page" : undefined}
                        className={navLinkClass(isActiveHref(pathname, item.href))}
                      >
                        {item.label}
                        <NavUnderline active={isActiveHref(pathname, item.href)} />
                      </Link>
                    ) : (
                      <NavDropdown
                        key={item.group.label}
                        group={item.group}
                        active={isActiveHref(pathname, item.group.href)}
                      />
                    ),
                  )}
                </nav>

                <Link href="/giai-phap/matter-smarthome" className={ctaClass}>
                  Matter Smarthome
                  <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <Reveal className="border-t border-border/70 bg-card md:hidden">
          <div className="mx-auto max-w-[var(--container-max)] px-4 py-4">
            <SearchBox variant="mobile" className="mb-4" />

            <div className="flex flex-col divide-y divide-border">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                aria-current={isActiveHref(pathname, "/") ? "page" : undefined}
                className={`py-3 text-base cursor-pointer ${isActiveHref(pathname, "/") ? "font-medium text-accent" : ""}`}
              >
                Trang chủ
              </Link>
              <MobileGroup group={productCategories} onNavigate={() => setMobileOpen(false)} />
              <MobileGroup group={solutions} onNavigate={() => setMobileOpen(false)} />
              <MobileGroup group={topBrands} onNavigate={() => setMobileOpen(false)} />
              <Link
                href="/du-an"
                onClick={() => setMobileOpen(false)}
                aria-current={isActiveHref(pathname, "/du-an") ? "page" : undefined}
                className={`py-3 text-base cursor-pointer ${isActiveHref(pathname, "/du-an") ? "font-medium text-accent" : ""}`}
              >
                Dự án
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileOpen(false)}
                aria-current={isActiveHref(pathname, "/blog") ? "page" : undefined}
                className={`py-3 text-base cursor-pointer ${isActiveHref(pathname, "/blog") ? "font-medium text-accent" : ""}`}
              >
                Blog
              </Link>
            </div>

            <Link
              href="/giai-phap/matter-smarthome"
              onClick={() => setMobileOpen(false)}
              className={`${ctaClass} mt-4 w-full justify-center`}
            >
              Matter Smarthome
              <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      )}
    </header>
  );
}

/**
 * Badge số lượng giỏ hàng.
 * TODO: thay `count` cứng bằng cart state thật (Context/Zustand/server) khi có giỏ hàng —
 * demo seed = 2 để nhìn thấy badge hoạt động, ẩn hoàn toàn khi count = 0.
 */
function CartBadge() {
  const [count] = useState(2);
  if (count <= 0) return null;
  return (
    <span
      aria-hidden="true"
      className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-none text-on-accent"
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

function NavDropdown({ group, active }: { group: NavGroup; active: boolean }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearCloseTimer() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  // Hover-intent: mở ngay khi hover, đóng trễ 150ms khi rời chuột — đủ thời gian
  // băng qua khoảng cách (mt-2) giữa nút và panel mà không bị đóng hụt.
  function handleMouseEnter() {
    clearCloseTimer();
    setOpen(true);
  }
  function handleMouseLeave() {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }

  useEffect(() => clearCloseTimer, []);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      className="relative"
      ref={rootRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={navLinkClass(active)}
      >
        {group.label}
        <CaretDown
          size={14}
          weight="bold"
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
        <NavUnderline active={active || open} />
      </button>

      {open && (
        <Reveal
          role="menu"
          className="absolute left-0 top-full z-50 mt-2 w-72 rounded-[var(--card-radius)] border border-border bg-card p-2 shadow-lg"
        >
          {/* Mỗi item cascade cách nhau 30ms — "Stagger List" tier, không dùng quá 8 item/nhóm */}
          {group.items.map((item, idx) => (
            <Reveal key={item.href} delayMs={idx * 30}>
              <Link
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
              >
                <span>{item.label}</span>
                {item.meta && (
                  <span className="text-xs text-muted-foreground">{item.meta}</span>
                )}
              </Link>
            </Reveal>
          ))}
          <Reveal delayMs={group.items.length * 30} className="mt-1 border-t border-border pt-1">
            <Link
              href={group.viewAllHref}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-accent transition-colors hover:bg-muted"
            >
              {group.viewAllLabel} →
            </Link>
          </Reveal>
        </Reveal>
      )}
    </div>
  );
}

function MobileGroup({
  group,
  onNavigate,
}: {
  group: NavGroup;
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-1">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between py-3 text-base"
      >
        {group.label}
        <CaretDown
          size={16}
          aria-hidden="true"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Grid trick: transition từ 0fr -> 1fr để animate ra intrinsic height mượt, không cần đo px */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1 pb-2 pl-3">
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className="py-2 text-sm text-muted-foreground cursor-pointer hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={group.viewAllHref}
              onClick={onNavigate}
              className="py-2 text-sm font-medium text-accent cursor-pointer"
            >
              {group.viewAllLabel} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

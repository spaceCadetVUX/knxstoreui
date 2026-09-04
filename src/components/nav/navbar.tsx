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
import { productCategories, solutions, topBrands, type NavGroup } from "./nav-data";
import { MegaMenu, type MegaMenuTabKey } from "./mega-menu";
import { SearchBox } from "./search-box";

type NavItem =
  | { kind: "link"; label: string; href: string }
  | { kind: "dropdown"; group: NavGroup; tabKey: MegaMenuTabKey };

// Thứ tự đúng theo mockup "Navbar 28": Danh mục sản phẩm▾ | Giải pháp▾ | Thương hiệu▾ | Dự án | Blog
// 3 mục "dropdown" giờ đều mở CHUNG 1 mega menu full-screen (mega-menu.tsx) ở đúng tab tương
// ứng — xem mega-menu-plan.md. Không còn hover-intent riêng cho từng cái (NavDropdown cũ).
const navItems: NavItem[] = [
  { kind: "dropdown", group: productCategories, tabKey: "danh-muc" },
  { kind: "dropdown", group: solutions, tabKey: "giai-phap" },
  { kind: "dropdown", group: topBrands, tabKey: "thuong-hieu" },
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

// Nút CTA duy nhất trong nav — solid fill xanh #176fe3 (--nav-cta, không phải --accent
// chuẩn site — xem globals.css), hover đơn giản: lift nhẹ + sáng hơn, không pointer-tracking.
const ctaClass =
  "inline-flex items-center gap-2 rounded-full bg-nav-cta px-4 py-2 text-sm font-semibold text-on-nav-cta shadow-md transition-[filter,box-shadow,transform] duration-150 ease-out cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:brightness-110 active:translate-y-0 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0";

export function Navbar() {
  // Mega menu full-screen DÙNG CHUNG cho cả 3 dropdown desktop lẫn hamburger mobile — 1 state
  // duy nhất (open + tab đang chọn) thay vì mobileOpen/NavDropdown riêng từng cái trước đây.
  // Xem mega-menu-plan.md mục 3 (lý do gộp mobile vào chung 1 component).
  const [megaOpen, setMegaOpen] = useState(false);
  const [megaTab, setMegaTab] = useState<MegaMenuTabKey>("danh-muc");
  const [scrolled, setScrolled] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  // Chỉ cắt overflow trong lúc row 2 đang animate co/giãn chiều cao (grid-rows trick cần vậy
  // để clip mượt). Khi đã giãn hết và đứng yên thì chuyển overflow-visible, nếu không dropdown
  // menu (position: absolute, cao hơn h-12 của row) sẽ bị div bọc này cắt mất — đây chính là
  // bug "hover vào là mất dropdown".
  const [rowOverflowHidden, setRowOverflowHidden] = useState(false);
  const lastScrollY = useRef(0);
  // Timestamp tới khi nào bỏ qua toggle do scroll gây ra. Ngay sau khi row 2 đổi trạng thái,
  // chiều cao header đổi làm nội dung dưới dịch chuyển — trình duyệt (scroll anchoring) có thể
  // tự bù trừ scrollY gần như ngay lập tức, và bù trừ đó lại bị đọc nhầm thành user scroll,
  // gây vòng lặp đóng/mở liên tục. Khoá lại trong đúng thời lượng transition (300ms) + buffer.
  const suppressUntil = useRef(0);
  // Với prefers-reduced-motion, grid-template-rows đổi tức thời (transition-none) nên
  // "transitionend" không bao giờ bắn — nếu vẫn bật overflow-hidden lúc collapse thì nó sẽ
  // kẹt luôn ở true (không có sự kiện nào gỡ ra), làm dropdown vĩnh viễn mất sau lần scroll
  // đầu tiên. Nhóm user này không cần overflow-hidden vì đổi trạng thái diễn ra trong 1 frame,
  // không có gì để clip cả.
  const reducedMotionRef = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

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
          if (prev) {
            suppressUntil.current = now + 350;
            if (!reducedMotionRef.current) setRowOverflowHidden(true);
          }
          return false;
        });
      } else if (y > lastScrollY.current + 10) {
        setNavCollapsed((prev) => {
          if (!prev) {
            suppressUntil.current = now + 350;
            if (!reducedMotionRef.current) setRowOverflowHidden(true);
          }
          return true;
        });
      } else if (y < lastScrollY.current - 10) {
        setNavCollapsed((prev) => {
          if (prev) {
            suppressUntil.current = now + 350;
            if (!reducedMotionRef.current) setRowOverflowHidden(true);
          }
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
    // Fragment ở ngoài — MegaMenu (position:fixed) PHẢI là sibling của <header>, không phải con
    // của nó: header có backdrop-filter (backdrop-blur-*/backdrop-saturate-150) nên tự trở
    // thành containing block cho mọi phần tử fixed bên trong nó (đúng theo spec — backdrop-
    // filter/filter/transform/perspective/will-change trên tổ tiên đều làm vậy), khiến
    // `top-16 bottom-0` của MegaMenu bị tính theo mép DƯỚI CỦA HEADER (~114px) thay vì đáy
    // viewport thật — overlay chỉ cao ~50px thay vì phủ hết màn hình. Đặt MegaMenu ra ngoài
    // header để containing block quay lại đúng viewport.
    <>
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
              aria-label={megaOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={megaOpen}
              onClick={() => {
                setMegaTab("danh-muc");
                setMegaOpen((v) => !v);
              }}
              className="relative ml-1 flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors cursor-pointer hover:bg-muted md:hidden"
            >
              <List
                size={22}
                aria-hidden="true"
                className={`absolute transition-all duration-200 ease-out ${
                  megaOpen ? "rotate-45 opacity-0" : "rotate-0 opacity-100"
                }`}
              />
              <X
                size={22}
                aria-hidden="true"
                className={`absolute transition-all duration-200 ease-out ${
                  megaOpen ? "rotate-0 opacity-100" : "-rotate-45 opacity-0"
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
        onTransitionEnd={(e) => {
          if (e.propertyName === "grid-template-rows" && !navCollapsed) {
            setRowOverflowHidden(false);
          }
        }}
      >
        <div className={rowOverflowHidden ? "overflow-hidden" : "overflow-visible"}>
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
                      <button
                        key={item.group.label}
                        type="button"
                        aria-haspopup="true"
                        aria-expanded={megaOpen && megaTab === item.tabKey}
                        onClick={() => {
                          if (megaOpen && megaTab === item.tabKey) {
                            setMegaOpen(false);
                          } else {
                            setMegaTab(item.tabKey);
                            setMegaOpen(true);
                          }
                        }}
                        className={navLinkClass(
                          isActiveHref(pathname, item.group.href) || (megaOpen && megaTab === item.tabKey),
                        )}
                      >
                        {item.group.label}
                        <CaretDown
                          size={14}
                          weight="bold"
                          aria-hidden="true"
                          className={`transition-transform duration-200 ${
                            megaOpen && megaTab === item.tabKey ? "rotate-180" : ""
                          }`}
                        />
                        <NavUnderline
                          active={isActiveHref(pathname, item.group.href) || (megaOpen && megaTab === item.tabKey)}
                        />
                      </button>
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
      </header>

      {/* Mega menu full-screen — dùng chung cho cả 3 dropdown desktop lẫn hamburger mobile,
          thay hẳn NavDropdown + mobile panel accordion riêng trước đây. Xem mega-menu.tsx.
          Đặt NGOÀI </header> — xem comment ở đầu return() (backdrop-filter trên header phá
          containing block của phần tử fixed nếu đặt bên trong). */}
      <MegaMenu
        open={megaOpen}
        activeTab={megaTab}
        onClose={() => setMegaOpen(false)}
        onTabChange={setMegaTab}
      />
    </>
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


"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AppleLogo,
  ArrowUpRight,
  Broadcast,
  CaretRight,
  HardHat,
  ImageSquare,
  MagnifyingGlass,
  Plugs,
  PuzzlePiece,
  ShareNetwork,
  ShieldCheck,
  SlidersHorizontal,
  Snowflake,
  SquaresFour,
  Tag,
  X,
  type Icon,
} from "@phosphor-icons/react";
import { brandLogos } from "@/components/home/brand-logos-data";
import { productCategories, solutions, topBrands } from "./nav-data";
import {
  productCategoryTree,
  type ProductCategoryLeaf,
} from "./product-category-tree-data";
import { Reveal, useDelayedUnmount } from "./reveal";
import { SearchBox } from "./search-box";
import { normalizeSearchText } from "./search-data";

export type MegaMenuTabKey = "danh-muc" | "giai-phap" | "thuong-hieu";

type TabDef = { key: MegaMenuTabKey; label: string; icon: Icon };

const TABS: TabDef[] = [
  { key: "danh-muc", label: productCategories.label, icon: SquaresFour },
  { key: "giai-phap", label: solutions.label, icon: HardHat },
  { key: "thuong-hieu", label: topBrands.label, icon: Tag },
];

// Icon/logo riêng cho tab "Giải pháp" — nav-data.ts không mang sẵn (chỉ category mới có field
// `key`/categoryIcon). 4/12 giao thức đã có logo thật (dùng chung file với protocolLogos trong
// hero.tsx: KNX/Casambi/DALI-2/Matter) — 8 mục còn lại (Lutron/HomeKit/Zigbee/Mobus/DMX/An ninh/
// Giải pháp khác/HVAC) chưa có logo file thật, dùng icon Phosphor trung tính thay thế. Map cục
// bộ theo href (giống cách brandLogoBySlug/BrandPanel xử lý "logo thật hoặc fallback").
type SolutionVisual =
  | { kind: "logo"; src: string; width: number; height: number }
  | { kind: "icon"; icon: Icon };

const solutionVisualByHref: Record<string, SolutionVisual> = {
  "/solution/knx": { kind: "logo", src: "/protocols/knx.svg", width: 114, height: 53 },
  "/solution/casambi": { kind: "logo", src: "/protocols/casambi.svg", width: 198, height: 29 },
  "/solution/dali": { kind: "logo", src: "/protocols/dali-2.png", width: 1602, height: 468 },
  "/solution/matter": { kind: "logo", src: "/protocols/matter.svg", width: 339, height: 73 },
  "/solution/dmx": { kind: "icon", icon: Broadcast },
  "/solution/lutron": { kind: "icon", icon: SlidersHorizontal },
  "/solution/homekit": { kind: "icon", icon: AppleLogo },
  "/solution/zigbee": { kind: "icon", icon: ShareNetwork },
  "/solution/mobus": { kind: "icon", icon: Plugs },
  "/solution/an-ninh": { kind: "icon", icon: ShieldCheck },
  "/solution/giai-phap-khac": { kind: "icon", icon: PuzzlePiece },
  "/solution/hvac": { kind: "icon", icon: Snowflake },
};

function initials(label: string): string {
  return label.slice(0, 2).toUpperCase();
}

// Logo thật cho tab Thương hiệu — nguồn brand-logos-data.ts (dùng chung với marquee trang chủ,
// xem comment ở đó). 7/8 brand trong topBrands có logo (thiếu Moorgen, site gốc không có file
// nào) — brand thiếu logo fallback về badge initials như bản cũ.
const brandLogoBySlug = new Map(brandLogos.map((logo) => [logo.slug, logo]));

function matches(query: string, ...fields: Array<string | undefined>): boolean {
  const q = normalizeSearchText(query);
  if (!q) return true;
  return fields.some((f) => f && normalizeSearchText(f).includes(q));
}

/**
 * Mega menu full-screen — thay `NavDropdown` (3 dropdown hover riêng) + `MobileGroup`
 * (accordion mobile riêng) trong bản trước. Phủ kín từ mép dưới Row 1 (logo/search/giỏ hàng,
 * h-16 = 64px) xuống hết viewport, dùng CHUNG 1 component cho cả desktop lẫn mobile (chỉ khác
 * layout responsive) — xem mega-menu-plan.md mục 3 lý do gộp mobile vào đây.
 *
 * PHASE A (đang ở đây): interaction đầy đủ (tab, filter, đóng bằng X/Esc), nhưng data mỗi tab
 * TẠM dùng đúng data rút gọn hiện có trong nav-data.ts (6 category, 8 brand) — KHÔNG bịa danh
 * mục con/brand giả như bản artifact demo bố cục. Đã bỏ toggle "Xem toàn bộ" (Compact/Toàn bộ)
 * từng có ở 2 tab Danh mục/Thương hiệu — luôn hiển thị 1 kiểu lưới cố định, không chờ đồng bộ
 * đủ 79 category/68 brand nữa. Phase B (đổ data thật) làm ở lượt kế tiếp nếu cần, xem
 * mega-menu-plan.md mục 4-5.
 *
 * Overlay dùng z-[60] (cao hơn header z-50 trong navbar.tsx) và background ĐẶC (bg-card, không
 * trong suốt) — nên tự vẽ đè lên toàn bộ Row 2 (nav links) phía dưới Row 1 mà không cần quan
 * tâm Row 2 đang collapsed hay expanded (navCollapsed state của Navbar). Không cần lớp scrim
 * riêng để "dimm" trang phía sau — overlay đã che kín 100% phần còn lại của viewport, không có
 * gì "ngoài overlay" để click nhằm đóng (khác dropdown nhỏ trước đây).
 */
export function MegaMenu({
  open,
  activeTab,
  onClose,
  onTabChange,
}: {
  open: boolean;
  activeTab: MegaMenuTabKey;
  onClose: () => void;
  onTabChange: (tab: MegaMenuTabKey) => void;
}) {
  const mounted = useDelayedUnmount(open);
  const baseId = useId();
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // Đóng hẳn / đổi tab → reset query. Tính NGAY TRONG LÚC RENDER (so giá trị hiện tại
  // với giá trị lưu từ lần render trước) thay vì trong useEffect — cùng kỹ thuật "adjusting
  // state when a prop changes" mà useDelayedUnmount (reveal.tsx) đã dùng, tránh lỗi lint
  // react-hooks/set-state-in-effect (setState đồng bộ trong effect gây render dây chuyền thừa).
  const [prevOpen, setPrevOpen] = useState(open);
  const [prevActiveTab, setPrevActiveTab] = useState(activeTab);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (!open) {
      setQuery("");
    }
  }
  if (prevActiveTab !== activeTab) {
    setPrevActiveTab(activeTab);
    setQuery("");
  }

  function handleQueryChange(next: string) {
    setQuery(next);
  }

  // Khoá scroll nền khi menu mở — full-screen overlay, cuộn trang phía sau không có ý nghĩa gì.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Auto-focus ô search khi mở — chỉ có tác dụng khi ô ≥sm đang hiển thị (ẩn dưới mobile),
  // .focus() trên phần tử display:none là no-op an toàn, không throw.
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => searchRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  if (!mounted) return null;

  function handleNavigate() {
    onClose();
  }

  return (
    <Reveal
      show={open}
      role="dialog"
      aria-modal="true"
      aria-label="Menu điều hướng"
      className="fixed inset-x-0 top-16 bottom-0 z-[60] flex flex-col bg-card"
    >
      {/* Thanh trên: tab + search + đóng */}
      <div className="flex-none border-b border-border">
        <div className="mx-auto flex max-w-[var(--container-max)] items-center gap-4 px-4 py-3 md:px-8 lg:px-16">
          <div role="tablist" aria-label="Nhóm điều hướng" className="flex flex-none gap-2 overflow-x-auto">
            {TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  id={`${baseId}-tab-${tab.key}`}
                  aria-selected={isActive}
                  aria-controls={`${baseId}-panel-${tab.key}`}
                  onClick={() => onTabChange(tab.key)}
                  className={`inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isActive
                      ? "border-nav-cta bg-nav-cta text-on-nav-cta"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon size={15} weight="bold" aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <label className="relative hidden max-w-sm flex-1 sm:block">
            <MagnifyingGlass
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Lọc trong danh mục, giải pháp, thương hiệu…"
              className="w-full rounded-full border border-border bg-muted py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </label>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng menu"
            className="ml-auto flex h-10 w-10 flex-none cursor-pointer items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <X size={18} weight="bold" aria-hidden="true" />
          </button>
        </div>

        {/* Ô search riêng cho màn hẹp — ô trên chỉ hiện ≥sm (đủ chỗ cạnh tab). */}
        <div className="border-t border-border px-4 pb-3 pt-2 sm:hidden">
          <label className="relative block">
            <MagnifyingGlass
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Lọc…"
              className="w-full rounded-full border border-border bg-muted py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            />
          </label>
        </div>
      </div>

      {/* Nội dung — cuộn riêng, không đụng scroll trang (đã khoá) */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto max-w-[var(--container-max)] px-4 py-6 md:px-8 lg:px-16">
          {/* Row 1 ẩn SearchBox dưới md — đây là lối vào thay thế để tìm SẢN PHẨM (khác ô lọc
              danh mục/thương hiệu phía trên), chỉ hiện trên mobile để không trùng 2 ô search. */}
          <div className="mb-6 md:hidden">
            <SearchBox variant="mobile" />
          </div>

          <div id={`${baseId}-panel-danh-muc`} role="tabpanel" aria-labelledby={`${baseId}-tab-danh-muc`} hidden={activeTab !== "danh-muc"}>
            <CategoryPanel query={query} onNavigate={handleNavigate} />
          </div>
          <div id={`${baseId}-panel-giai-phap`} role="tabpanel" aria-labelledby={`${baseId}-tab-giai-phap`} hidden={activeTab !== "giai-phap"}>
            <SolutionPanel query={query} onNavigate={handleNavigate} />
          </div>
          <div id={`${baseId}-panel-thuong-hieu`} role="tabpanel" aria-labelledby={`${baseId}-tab-thuong-hieu`} hidden={activeTab !== "thuong-hieu"}>
            <BrandPanel query={query} onNavigate={handleNavigate} />
          </div>
        </div>
      </div>

      {/* Chân — lối thoát nhanh, KHÔNG thuộc 3 tab (Dự án/Blog/CTA), thay cho vị trí cũ của
          chúng trong navItems/mobile panel. */}
      <div className="flex-none border-t border-border bg-muted/60">
        <div className="mx-auto flex max-w-[var(--container-max)] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 text-sm md:px-8 lg:px-16">
          <Link href="/du-an" onClick={handleNavigate} className="font-semibold text-muted-foreground transition-colors hover:text-accent">
            Dự án
          </Link>
          <Link href="/blog" onClick={handleNavigate} className="font-semibold text-muted-foreground transition-colors hover:text-accent">
            Blog
          </Link>
          <Link
            href="/giai-phap/matter-smarthome"
            onClick={handleNavigate}
            className="inline-flex items-center gap-1.5 rounded-full bg-nav-cta px-3.5 py-1.5 text-xs font-semibold text-on-nav-cta"
          >
            Matter Smarthome <ArrowUpRight size={12} weight="bold" aria-hidden="true" />
          </Link>
          <span className="ml-auto hidden text-xs text-muted-foreground sm:inline">Esc hoặc bấm ra ngoài để đóng</span>
        </div>
      </div>
    </Reveal>
  );
}

function EmptyState({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="flex flex-col items-center gap-2 py-14 text-center text-sm text-muted-foreground">
      <MagnifyingGlass size={22} aria-hidden="true" />
      Không tìm thấy kết quả khớp — thử từ khoá khác.
    </div>
  );
}

type FlatCategoryLeaf = ProductCategoryLeaf & { parentLabel?: string };

// Danh mục cha KHÔNG có con (Khóa cửa thông minh, Bộ điều khiển rèm cửa tự động, Màn hình điều
// khiển hệ thống) tự nó là 1 leaf — coi như "con duy nhất của chính nó", không có parentLabel
// riêng (nó đã là mục cấp cao nhất, không cần breadcrumb).
function leavesOf(node: (typeof productCategoryTree)[number]): FlatCategoryLeaf[] {
  return node.children.length > 0
    ? node.children.map((child) => ({ ...child, parentLabel: node.label }))
    : [{ ...node, parentLabel: undefined }];
}

// 1 thẻ danh mục con — ảnh mini (thật, crawl từ chính trang danh mục) + tên + số SKU thật. Dùng
// chung cho cả chế độ tìm kiếm (flat, có breadcrumb) lẫn panel chi tiết bên phải (theo cha đang
// chọn, không breadcrumb vì đã rõ ngữ cảnh qua rail bên trái).
function CategoryLeafCard({
  leaf,
  onNavigate,
}: {
  leaf: FlatCategoryLeaf;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={leaf.href}
      onClick={onNavigate}
      className="flex flex-col gap-2 rounded-xl border border-border p-3 transition-[border-color,transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
    >
      {leaf.image ? (
        <span className="flex aspect-square items-center justify-center overflow-hidden rounded-lg">
          <Image
            src={leaf.image.src}
            alt={leaf.label}
            width={leaf.image.width}
            height={leaf.image.height}
            className="h-full w-full object-contain"
          />
        </span>
      ) : (
        // 0 sản phẩm hiện tại (đã verify trên site thật) → không có ảnh thật, dùng khung xám +
        // icon trung tính để phân biệt rõ với thẻ có ảnh thật (không vẽ ảnh giả).
        <span className="flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-muted">
          <ImageSquare size={26} weight="light" aria-hidden="true" className="text-muted-foreground" />
        </span>
      )}
      <span className="flex flex-col gap-0.5">
        {leaf.parentLabel && (
          <span className="truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {leaf.parentLabel}
          </span>
        )}
        <span className="text-sm font-semibold leading-snug text-foreground">{leaf.label}</span>
      </span>
      <span className="mt-auto text-xs tabular-nums text-muted-foreground">{leaf.count} sản phẩm</span>
    </Link>
  );
}

function CategoryPanel({ query, onNavigate }: { query: string; onNavigate: () => void }) {
  const [selectedHref, setSelectedHref] = useState(productCategoryTree[0].href);

  // Dùng cho chế độ tìm kiếm — gộp phẳng toàn bộ danh mục con (+ 3 danh mục cha không có con,
  // coi như leaf của chính nó) thành 1 danh sách để lọc xuyên suốt cả 2 cấp cùng lúc.
  const flatLeaves = useMemo<FlatCategoryLeaf[]>(() => productCategoryTree.flatMap(leavesOf), []);

  const trimmedQuery = query.trim();
  const searchResults = trimmedQuery
    ? flatLeaves.filter((leaf) => matches(query, leaf.label, leaf.parentLabel))
    : null;

  const selectedNode = productCategoryTree.find((node) => node.href === selectedHref) ?? productCategoryTree[0];
  const detailItems = leavesOf(selectedNode);

  return (
    <div>
      {searchResults ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {searchResults.map((leaf) => (
              <CategoryLeafCard key={leaf.href} leaf={leaf} onNavigate={onNavigate} />
            ))}
          </div>
          <EmptyState show={searchResults.length === 0} />
        </>
      ) : (
        // Master-detail 2 cột — khớp đúng menu "Danh mục sản phẩm" thật trên knxstore.vn (rail
        // 16 danh mục cha bên trái, panel phải là danh mục con của mục đang chọn). Rail chuyển
        // thành hàng ngang cuộn được dưới `lg` (không đủ chỗ đặt 2 cột cạnh nhau trên mobile).
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[272px_1fr] lg:items-start lg:gap-8">
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
            {productCategoryTree.map((node) => {
              const isActive = node.href === selectedHref;
              return (
                <button
                  key={node.href}
                  type="button"
                  onClick={() => setSelectedHref(node.href)}
                  className={`flex flex-none items-center justify-between gap-2 rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent lg:flex-1 ${
                    isActive
                      ? "border-nav-cta bg-nav-cta text-on-nav-cta"
                      : "border-border text-foreground hover:border-accent hover:bg-muted"
                  }`}
                >
                  <span className="whitespace-nowrap lg:whitespace-normal">{node.label}</span>
                  {node.children.length > 0 && (
                    <CaretRight
                      size={14}
                      weight="bold"
                      aria-hidden="true"
                      className={`hidden flex-none lg:block ${isActive ? "" : "text-muted-foreground"}`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {detailItems.map((leaf) => (
                <CategoryLeafCard key={leaf.href} leaf={leaf} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 border-t border-border pt-4">
        <Link href={productCategories.viewAllHref} onClick={onNavigate} className="text-sm font-semibold text-accent hover:underline">
          {productCategories.viewAllLabel} →
        </Link>
      </div>
    </div>
  );
}

// Danh sách PHẲNG 12 mục, đã hiện đủ 12/12 (không cắt bớt) — khác Danh mục/Thương hiệu (có
// "Xem tất cả X" vì chỉ hiện 1 phần), nên panel này KHÔNG có link "xem toàn bộ" ở cuối.
function SolutionPanel({ query, onNavigate }: { query: string; onNavigate: () => void }) {
  const filtered = useMemo(() => solutions.items.filter((item) => matches(query, item.label)), [query]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {filtered.map((item) => {
          const visual = solutionVisualByHref[item.href];
          const ItemIcon = visual?.kind === "icon" ? visual.icon : PuzzlePiece;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="flex flex-col items-center gap-2.5 rounded-2xl border border-border p-4 text-center transition-[border-color,transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:border-accent hover:shadow-md"
            >
              <span className="flex h-11 w-full flex-none items-center justify-center rounded-xl bg-muted px-2">
                {visual?.kind === "logo" ? (
                  <Image
                    src={visual.src}
                    alt={item.label}
                    width={visual.width}
                    height={visual.height}
                    className="h-6 w-auto object-contain sm:h-7"
                  />
                ) : (
                  <ItemIcon size={20} weight="bold" aria-hidden="true" className="text-accent" />
                )}
              </span>
              <span className="text-[13px] font-semibold text-foreground">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <EmptyState show={query.trim().length > 0 && filtered.length === 0} />
    </div>
  );
}

function BrandPanel({ query, onNavigate }: { query: string; onNavigate: () => void }) {
  const filtered = useMemo(
    () => topBrands.items.filter((item) => matches(query, item.label, item.meta)),
    [query],
  );

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {filtered.map((item) => {
          const logo = brandLogoBySlug.get(item.href.split("/").pop() ?? "");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-card p-3 text-center transition-colors hover:border-accent hover:bg-muted"
            >
              {logo ? (
                <Image
                  src={logo.src}
                  alt={item.label}
                  width={logo.width}
                  height={logo.height}
                  className="h-7 w-auto object-contain"
                />
              ) : (
                <>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-nav-cta text-[11px] font-bold text-on-nav-cta">
                    {initials(item.label)}
                  </span>
                  <span className="text-xs font-semibold text-foreground">{item.label}</span>
                </>
              )}
              <span className="text-xs tabular-nums text-muted-foreground">{item.meta}</span>
            </Link>
          );
        })}
      </div>

      <EmptyState show={query.trim().length > 0 && filtered.length === 0} />

      <div className="mt-6 border-t border-border pt-4">
        <Link href={topBrands.viewAllHref} onClick={onNavigate} className="text-sm font-semibold text-accent hover:underline">
          {topBrands.viewAllLabel} →
        </Link>
      </div>
    </div>
  );
}

"use client"; // Reveal dùng useEffect/useState (mount-flag animation)

import { useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CaretLeft,
  CaretRight,
  Lightbulb,
  Snowflake,
  Rows,
  ShieldCheck,
  type Icon,
} from "@phosphor-icons/react";
import { Reveal } from "@/components/nav/reveal";
import { SearchBox } from "@/components/nav/search-box";
import {
  categoryGroupShortLabel,
  categoryIcon,
  productCategories,
  solutions,
  topBrands,
} from "@/components/nav/nav-data";
import { shopCategories } from "./shop-categories-data";
import { brandLogos } from "./brand-logos-data";

// Href/label giống hệt product-highlights.tsx (VIEW_ALL_HREF/VIEW_ALL_LABEL) — 1 nguồn chân lý
// cho "trang tất cả sản phẩm", tránh 2 nơi lệch nhau nếu route đổi sau này.
const ALL_PRODUCTS_HREF = "/san-pham";
const ALL_PRODUCTS_LABEL = "Xem tất cả sản phẩm";

// Chip gợi ý (P1) — 6 danh mục nhiều SKU nhất, lấy đúng thứ tự đã sort giảm dần trong
// shopCategories (shop-categories-data.ts, dữ liệu thật từ catalog) — không tự bịa danh sách
// riêng cho Hero để tránh 2 nguồn "danh mục hot" lệch nhau giữa Hero và ShopByCategory.
const quickCategoryChips = shopCategories.slice(0, 6);

type TabTile = {
  key: string;
  label: string;
  href: string;
  meta?: string;
  icon?: Icon;
  logo?: { src: string; width: number; height: number };
};

// Tab "Giải pháp" trong Hero: nội dung LOCAL, riêng với `solutions` (nav-data.ts, vẫn đang cấp
// cho dropdown navbar/mobile menu) — theo yêu cầu 2026-09-03 chỉ đổi hiển thị trong Hero, không
// đụng nav-data.ts. Href tạm trỏ "/" (chưa có trang danh mục "Rèm cửa tự động" trong catalog) —
// cần mapping lại khi có route thật. Tile nhỏ + icon (không ảnh) theo yêu cầu 2026-09-03.
const heroSolutionTiles: TabTile[] = [
  { key: "chieu-sang", label: "Chiếu sáng", href: "/", icon: Lightbulb },
  { key: "hvac", label: "HVAC", href: "/", icon: Snowflake },
  { key: "rem-cua", label: "Rèm cửa tự động", href: "/", icon: Rows },
  { key: "an-ninh", label: "An ninh", href: "/", icon: ShieldCheck },
];

// topBrands (nav-data.ts) không mang sẵn ảnh logo (chỉ label/href/meta, dùng cho dropdown
// navbar text-only) — brandLogos (brand-logos-data.ts, đang cấp cho BrandMarquee) mới có
// file logo thật. 2 nguồn dùng chung 1 quy ước href `/thuong-hieu/{slug}` (xem comment trong
// brand-logos-data.ts) nên map thẳng qua href, không cần sửa nav-data.ts.
const brandLogoByHref = new Map(brandLogos.map((brand) => [brand.href, brand]));

// Danh sách đầy đủ cho tab "Thương hiệu" trong Hero: topBrands (8, sort theo SKU) trước, sau
// đó nối thêm brand còn lại trong brandLogos (chưa trùng href với topBrands) — mục đích DUY
// NHẤT là có đủ nội dung để nút next/prev (phân trang 8 tile/trang) có ý nghĩa, không phải để
// thay thế bảng xếp hạng brand bán chạy của topBrands.
const heroBrandTiles: TabTile[] = [
  ...topBrands.items.map((item) => ({
    key: item.href,
    label: item.label,
    href: item.href,
    meta: item.meta,
    logo: brandLogoByHref.get(item.href),
  })),
  ...brandLogos
    .filter((brand) => !topBrands.items.some((item) => item.href === brand.href))
    .map((brand) => ({
      key: brand.href,
      label: brand.label,
      href: brand.href,
      logo: brand,
    })),
];

type HeroTab = {
  id: string;
  label: string;
  items: TabTile[];
  gridColsClass: string;
  viewAllHref: string;
  viewAllLabel: string;
};

// P2 — 3 tab "khám phá có cấu trúc", mỗi tab tái dùng ĐÚNG data đã có trong nav-data.ts (nguồn
// đang cấp cho dropdown navbar) — không tạo danh sách song song, đổi 1 nơi là đồng bộ cả 2 chỗ.
// Cột lưới (gridColsClass) chọn riêng theo SỐ Ô của từng tab để không có hàng cuối lẻ loi
// (6→2/3/6, 4→2/4, 8→2/4 đều chia hết) — cùng nguyên tắc đã áp dụng ở shop-by-category.tsx.
const heroTabs: HeroTab[] = [
  {
    id: "giai-phap",
    label: solutions.label,
    items: heroSolutionTiles,
    gridColsClass: "grid-cols-2 sm:grid-cols-4",
    viewAllHref: solutions.viewAllHref,
    viewAllLabel: solutions.viewAllLabel,
  },
  {
    id: "danh-muc",
    label: productCategories.label,
    items: productCategories.items.map((item) => ({
      key: item.href,
      label: item.key ? categoryGroupShortLabel[item.key] : item.label,
      href: item.href,
      meta: item.meta,
      icon: item.key ? categoryIcon[item.key] : undefined,
    })),
    gridColsClass: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
    viewAllHref: productCategories.viewAllHref,
    viewAllLabel: productCategories.viewAllLabel,
  },
  {
    id: "thuong-hieu",
    label: topBrands.label,
    // topBrands (8, sort theo SKU) trước, nối thêm các brand còn lại trong brandLogos (16, chưa
    // trùng href) để có đủ nội dung cho nút next/prev — xem heroBrandTiles bên dưới. Brand nào
    // chưa có file logo (vd "moorgen") rơi về chữ cái đầu (monogram, hàm initials() bên dưới).
    items: heroBrandTiles,
    gridColsClass: "grid-cols-2 sm:grid-cols-4",
    viewAllHref: topBrands.viewAllHref,
    viewAllLabel: topBrands.viewAllLabel,
  },
];

function initials(label: string): string {
  return label.slice(0, 2).toUpperCase();
}

/**
 * Logo giao thức/chuẩn thật — tải từ nguồn chính chủ (KNXStore là đối tác/nhà phân phối
 * của cả 4, theo xác nhận 2026-08-28), KHÔNG lấy từ site scrape logo bên thứ 3:
 * - KNX: trích xuất trực tiếp từ SVG trong HTML header của knx.org
 * - Casambi: casambi.com/wp-content/themes/casambi/images/casambi-logo-dark.svg
 * - DALI-2: dali-alliance.org (DiiA) — DALI/DALI-2 là trademark của DiiA, chỉ dùng vì đã
 *   xác nhận là đối tác/thành viên. ĐÃ KIỂM TRA trang Downloads chính thức: DiiA KHÔNG
 *   công khai bản vector (SVG/EPS/AI) nào — chỉ có PNG. Giữ PNG, không tự vector hoá lại.
 * - Matter: bản .svg (không phải .png) — file gốc trong brand-assets-library của csa-iot.org
 *   chỉ là bitmap PNG nhúng trong khung SVG (không phải vector thật, đã kiểm tra: chỉ có
 *   1 thẻ <image>, 0 <path>). Vector thật lấy qua Wikimedia Commons (tác giả gốc: CSA,
 *   nguồn buildwithmatter.com, public domain hình dạng + có nhãn trademark) — đã verify
 *   chỉ có <path>, không nhúng ảnh raster.
 *
 * "Đồng bộ size": height bằng nhau theo pixel KHÔNG có nghĩa là "nhìn nặng/nhẹ bằng
 * nhau" — Casambi chữ đặc kín khung nên cùng height sẽ nhìn to/đậm hơn hẳn; DALI-2 chữ
 * nhỏ nằm giữa khung oval rỗng nhiều nên nhìn nhỏ đi; Matter nét mảnh nên nhìn nhẹ hơn.
 * Mỗi logo có `heightClass` riêng, tự tinh chỉnh bằng mắt để 4 logo đọc "ngang trọng
 * lượng" nhau khi đặt cạnh nhau — không dùng 1 class chung cho cả 4.
 */
const protocolLogos = [
  {
    name: "KNX",
    href: "/danh-muc-san-pham/knx",
    src: "/protocols/knx.svg",
    width: 114,
    height: 53,
    heightClass: "h-9 sm:h-11",
  },
  // Casambi/DALI-2 chưa có trang category riêng — trỏ tạm về "Chiếu sáng" (nơi 2 dòng
  // sản phẩm này thực sự nằm trong catalog), sửa lại khi có route riêng.
  {
    name: "Casambi",
    href: "/danh-muc-san-pham/chieu-sang",
    src: "/protocols/casambi.svg",
    width: 198,
    height: 29,
    heightClass: "h-6 sm:h-7", // chữ đặc kín khung — hạ xuống để không lấn át 3 logo kia
  },
  {
    name: "DALI-2",
    href: "/danh-muc-san-pham/chieu-sang",
    src: "/protocols/dali-2.png",
    width: 1602,
    height: 468,
    heightClass: "h-10 sm:h-12", // khung oval rỗng nhiều — nâng lên để chữ "DALI 2" đủ rõ, nhưng không quá rộng
  },
  {
    name: "Matter",
    href: "/danh-muc-san-pham/matter-smarthome",
    src: "/protocols/matter.svg",
    width: 339,
    height: 73,
    // Bản SVG crop sát viền hơn bản PNG cũ nên ở baseline (h-9/h-11) đã nhìn TO hơn hẳn
    // 3 logo kia — hạ thêm 1 bậc nữa.
    heightClass: "h-7 sm:h-8",
  },
];

export function Hero() {
  // P2 — state tab viết RIÊNG trong hero.tsx (không import chéo protocol-categories.tsx) để 2
  // hệ tab độc lập hoàn toàn — đổi 1 bên không rủi ro ảnh hưởng bên kia. Cơ chế tablist/phím
  // trái-phải giống protocol-categories.tsx, NHƯNG bỏ animation trượt translateX của file đó:
  // translateX cần 1 "stage" cao cố định chứa cả 3 panel chồng lên nhau, mà 3 tab ở đây số ô
  // rất khác nhau (6/4/8 ô, layout cột khác nhau) nên 1 chiều cao cố định sẽ để dư khoảng trắng
  // rất lớn ở 2 tab ít ô hơn — ngược với mục tiêu Hero gọn theo nội dung (không còn `h-[90vh]`
  // cố định, xem comment ở <section> bên dưới). Dùng `hidden` (ẩn/hiện trực tiếp, không giữ
  // layout) để mỗi tab tự co theo đúng số ô của nó.
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  // Phân trang riêng cho tab "Thương hiệu" — heroBrandTiles có 24 brand (nhiều hơn 8 ô/trang
  // của lưới sm:grid-cols-4), nút next/prev để xem hết thay vì cắt cụt còn 8 brand đầu.
  const BRAND_PAGE_SIZE = 8;
  const brandPageCount = Math.ceil(heroBrandTiles.length / BRAND_PAGE_SIZE);
  const [brandPage, setBrandPage] = useState(0);

  function goToTab(idx: number, focusTab = false) {
    setActiveTab(idx);
    if (focusTab) tabRefs.current[idx]?.focus();
  }

  function onTabKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, idx: number) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goToTab((idx + 1) % heroTabs.length, true);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goToTab((idx - 1 + heroTabs.length) % heroTabs.length, true);
    }
  }

  return (
    // relative + overflow-hidden để làm nền cho ảnh absolute bên dưới. bg-card vẫn giữ làm màu
    // nền dự phòng (trước khi ảnh load xong). Chiều cao giờ theo NỘI DUNG (bỏ h-[90vh] cũ) —
    // hero cũ ép đúng 1 viewport bất kể nội dung thật cao bao nhiêu, ép khách task-driven
    // (search/lọc ngay, không đọc hero) phải cuộn qua vùng lifestyle họ không cần trước khi
    // chạm được nội dung hữu ích tiếp theo. Xem hero-redesign-plan.md mục 7. Ảnh nền dùng
    // next/image `fill` vẫn đúng với auto-height: div này `relative`, ảnh absolute inset-0 co
    // theo chiều cao do các phần tử trong luồng (headline/panel) quyết định, không cần set cứng.
    <section className="relative overflow-hidden bg-card pb-14 pt-16 text-center md:pb-20 md:pt-24">
      {/* Nền ảnh full-bleed + overlay gradient trắng→trong suốt theo chiều dọc (top→bottom):
          đặc (from-card, ~100%) ở dải trần nhà sát navbar, hạ dần (via-card/60, dừng ở 58%
          chiều cao — kéo dài hơn bản gốc (45%) để hàng CTA không rơi đúng điểm ảnh bắt đầu lộ
          chi tiết, tránh chữ/nút "chồng" lên vùng ảnh có tương phản cao) qua vùng text để chữ
          tối vẫn đọc rõ mà kiến trúc phía sau vẫn lờ mờ thấy được, rồi trong suốt hoàn toàn
          (to-transparent, đạt mốc ở 82%) để dải sàn gỗ/logo phía dưới hiện sắc nét, không bị
          phủ trắng. Khác vignette toả từ MÉP (trái/phải/góc) — đây là gradient 1 CHIỀU dọc duy
          nhất nên không làm ảnh "đục" quanh viền như bản trước đó. z-0 mặc định (positioned,
          DOM đứng trước content nên bị content vẽ đè lên, không cần z-index thủ công). */}
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src="/hero/office-showcase.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-card from-0% via-card/60 via-58% to-transparent to-82%" />
      </div>

      <div className="relative mx-auto max-w-[var(--container-max)] px-4 md:px-8 lg:px-16">
        <Reveal className="mx-auto max-w-3xl">
          {/* Cỡ chữ giảm 1 bậc so với bản cũ (4xl/5xl/6xl → 3xl/4xl/5xl) — headline giờ là
              phần xác nhận bối cảnh ("đúng trang mình cần"), không còn phải gánh vai trò nội
              dung chính để đọc lâu như hero lifestyle cũ.
              font-semibold + leading-tight (thay font-light + leading-normal cũ) — chữ mảnh/thưa
              hợp hero lifestyle trước đây, nhưng đặt trên 1 command panel chắc khối (viền, đổ
              bóng, nút bấm đậm) thì nhìn lạc tông; đậm nét hơn để "hài hoà" đúng nghĩa thị giác
              với phần dưới. "tự động hóa" tô accent — nối màu headline với hệ màu accent đang
              lặp lại khắp panel (nút search, tab đang chọn, link "Xem tất cả"), đồng thời đúng
              từ khoá giá trị cốt lõi nhất trong câu. whitespace-nowrap trên span này để cụm từ
              không bị ngắt dòng giữa chừng (vd "tự động" 1 dòng, "hoá" rớt xuống dòng sau). */}
          <h1 className="text-balance font-onest text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Nền tảng phân phối thiết bị{" "}
            <span className="whitespace-nowrap text-accent">tự động hóa</span> tòa nhà
          </h1>
        </Reveal>

        {/* Command panel — toàn bộ khối tương tác chính của Hero (search/chip/tab/logo), thay
            cho 2 nút CTA + dải logo trần trước đây. Panel là 1 khối THẬT có padding/border/
            radius riêng (không phải lớp nền tuyệt đối phủ sau nội dung) để mọi phần tử con bên
            trong dùng chung 1 max-width/căn giữa, không phải tự khai lại. Xem hero-redesign-
            plan.md (mục 1-5) để biết lý do đổi từ hero lifestyle sang command panel. */}
        <Reveal delayMs={100} className="relative mt-10 sm:mt-14">
          {/* Bỏ max-w-4xl cũ (panel hẹp hơn, dạt giữa, thừa lề 2 bên) — panel giờ full-width
              trong đúng container `max-w-[var(--container-max)] px-4/md:px-8/lg:px-16` mà div
              cha (dòng trên) và Row 2 của navbar.tsx (nav links + nút "Matter Smarthome") đang
              dùng CHUNG, nên biên trái/phải của panel khớp thẳng hàng với biên "Trang chủ" ↔
              "Matter Smarthome" trên nav — theo yêu cầu trực tiếp, đồng bộ độ rộng 2 khối. */}
          <div className="rounded-3xl border border-border/60 bg-card/78 px-5 py-7 shadow-lg backdrop-blur-lg sm:px-8 sm:py-9">
            {/* w-[95%] — theo yêu cầu trực tiếp: search bar gần bằng bề ngang panel (trước đó
                bị giới hạn max-w-2xl theo lý do "line-length" ở mục 6.6 file plan, nhưng nhìn
                thực tế lại hẹp/lệch tông so với chip/grid full-width bên dưới) — chừa đúng 5%
                margin 2 bên thay vì full 100% để vẫn có khoảng thở nhẹ với viền panel. */}
            <SearchBox variant="hero" className="w-full" />

            {/* P1 — chip gợi ý + "Xem tất cả sản phẩm": hành động 1-chạm, hưởng lây chú ý vừa
                dừng ở search nên đặt sát ngay dưới (mt-4, gần hơn hẳn khoảng cách xuống P2/P3
                bên dưới — proximity grouping, xem mục 5 file plan). Chip là LINK THẲNG tới trang
                danh mục (Phương án A, mục 4.2) — không fill vào ô search vì searchProducts chỉ
                có 10 SP mock, nhồi tên danh mục vào đó dễ ra 0 kết quả. Hàng chip cuộn ngang ở
                mobile (nhãn danh mục thật khá dài, vd "Điều khiển máy lạnh VRV/VRF"), wrap+căn
                giữa từ sm trở lên. "Xem tất cả sản phẩm" tách thành dòng riêng bên dưới (không
                nhét cuối hàng chip) để luôn thấy được ngay cả khi chưa cuộn hết hàng chip. */}
            <div className="mt-4 space-y-2.5">
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-start sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
                {quickCategoryChips.map((chip) => (
                  <Link
                    key={chip.href}
                    href={chip.href}
                    className="inline-flex shrink-0 items-center rounded-full border border-transparent bg-muted px-3 py-1.5 text-[11px] font-medium text-foreground/65 transition-colors duration-150 hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:text-xs"
                  >
                    {chip.label}
                  </Link>
                ))}
              </div>
              <div className="text-center">
                <Link
                  href={ALL_PRODUCTS_HREF}
                  className="group inline-flex items-center gap-1 rounded-sm text-xs font-semibold text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:text-sm"
                >
                  {ALL_PRODUCTS_LABEL}
                  <ArrowUpRight
                    size={13}
                    weight="bold"
                    aria-hidden="true"
                    className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            </div>

            {/* P2 — tab "khám phá có cấu trúc": khoảng cách xuống đây (mt-8/mt-10) lớn hơn hẳn
                khoảng P0→P1 (mt-4) — báo hiệu đây là 1 cụm chức năng khác (Gestalt proximity),
                nhưng CHƯA phải mức ngắt lớn nhất (đó là trước dải logo P3, xem border-t bên
                dưới). role=tablist/tab/tabpanel + phím trái-phải đầy đủ, tất cả panel LUÔN có
                trong DOM (chỉ ẩn bằng `hidden`, không unmount) — cùng lý do SEO đã ghi ở
                protocol-categories.tsx: nội dung tab vẫn được tính trọng số như nội dung thường. */}
            <div className="mt-8 sm:mt-10">
              <div
                role="tablist"
                aria-label="Khám phá theo"
                className="flex flex-wrap justify-center gap-2"
              >
                {heroTabs.map((tab, idx) => {
                  const isActive = idx === activeTab;
                  return (
                    <button
                      key={tab.id}
                      ref={(el) => {
                        tabRefs.current[idx] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`${baseId}-tab-${tab.id}`}
                      aria-selected={isActive}
                      aria-controls={`${baseId}-panel-${tab.id}`}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => goToTab(idx)}
                      onKeyDown={(e) => onTabKeyDown(e, idx)}
                      className={`inline-flex cursor-pointer items-center rounded-full border px-4 py-2 text-xs font-semibold transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card sm:text-[13px] ${
                        isActive
                          ? "border-accent bg-accent text-on-accent"
                          : "border-border bg-card text-foreground hover:border-accent hover:text-accent"
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {heroTabs.map((tab, idx) => {
                const isActive = idx === activeTab;
                return (
                  <div
                    key={tab.id}
                    id={`${baseId}-panel-${tab.id}`}
                    role="tabpanel"
                    aria-labelledby={`${baseId}-tab-${tab.id}`}
                    hidden={!isActive}
                    className="mt-5"
                  >
                    {tab.id === "thuong-hieu" && (
                      <div className="mb-2.5 flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          aria-label="Xem thương hiệu trước"
                          onClick={() => setBrandPage((p) => Math.max(0, p - 1))}
                          disabled={brandPage === 0}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors duration-150 hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
                        >
                          <CaretLeft size={14} weight="bold" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          aria-label="Xem thêm thương hiệu"
                          onClick={() =>
                            setBrandPage((p) => Math.min(brandPageCount - 1, p + 1))
                          }
                          disabled={brandPage >= brandPageCount - 1}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors duration-150 hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
                        >
                          <CaretRight size={14} weight="bold" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                    <ul className={`grid gap-2.5 ${tab.gridColsClass}`}>
                        {(tab.id === "thuong-hieu"
                          ? heroBrandTiles.slice(
                              brandPage * BRAND_PAGE_SIZE,
                              brandPage * BRAND_PAGE_SIZE + BRAND_PAGE_SIZE,
                            )
                          : tab.items
                        ).map((item) => (
                          <li key={item.key}>
                            <Link
                              href={item.href}
                              className="group flex h-full flex-col items-center gap-2 rounded-2xl border border-border bg-card px-2 py-4 text-center transition-[transform,box-shadow,border-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-accent hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                            >
                              {item.logo ? (
                                <span className="flex h-11 w-full shrink-0 items-center justify-center rounded-xl bg-white px-3">
                                  <Image
                                    src={item.logo.src}
                                    alt={item.label}
                                    width={item.logo.width}
                                    height={item.logo.height}
                                    className="h-7 w-auto object-contain sm:h-8"
                                  />
                                </span>
                              ) : (
                                <>
                                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted text-accent">
                                    {item.icon ? (
                                      <item.icon size={20} aria-hidden="true" />
                                    ) : (
                                      <span className="text-xs font-bold" aria-hidden="true">
                                        {initials(item.label)}
                                      </span>
                                    )}
                                  </span>
                                  <span className="line-clamp-2 text-xs font-semibold leading-snug text-foreground sm:text-[13px]">
                                    {item.label}
                                  </span>
                                </>
                              )}
                              {item.meta && (
                                <span className="text-[11px] text-muted-foreground">
                                  {item.meta}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    <div className="mt-4 text-center">
                      <Link
                        href={tab.viewAllHref}
                        className="group inline-flex items-center gap-1 rounded-sm text-xs font-semibold text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:text-sm"
                      >
                        {tab.viewAllLabel}
                        <ArrowUpRight
                          size={13}
                          weight="bold"
                          aria-hidden="true"
                          className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* border-t tách "vùng khám phá" (search + chip + tab) khỏi "vùng tín hiệu uy tín"
                (dải logo) — khoảng cách LỚN NHẤT trong toàn panel, đúng nguyên tắc proximity
                grouping ở mục 5 file plan (P2→P3 xa hơn hẳn P0→P1/P1→P2). */}
            <div className="mt-8 border-t border-border pt-6 sm:mt-10 sm:pt-8">
              {/* grid-cols-2 cố định 2 logo/hàng ở mobile/tablet (< lg) — trước đây dùng flex-wrap
                  tự ngắt dòng theo bề rộng nội dung, gây lỗi lệch 3+1 (KNX/Casambi/DALI-2 hàng
                  trên, Matter lẻ loi hàng dưới) ở dải ~768-950px. Từ lg trở lên (đủ rộng cho cả
                  4 logo + gap trên 1 hàng, đã đo thực tế) chuyển hẳn sang flex 1 hàng ngang. */}
              <ul className="grid grid-cols-2 items-center justify-items-center gap-x-10 gap-y-8 sm:gap-x-14 lg:flex lg:flex-nowrap lg:justify-center">
                {protocolLogos.map((logo) => (
                  <li key={logo.name} className="flex items-center">
                    <Link
                      href={logo.href}
                      className="inline-flex rounded-md transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent motion-reduce:hover:translate-y-0"
                    >
                      <Image
                        src={logo.src}
                        alt={logo.name}
                        width={logo.width}
                        height={logo.height}
                        className={`w-auto ${logo.heightClass}`}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

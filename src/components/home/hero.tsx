"use client"; // Reveal dùng useEffect/useState (mount-flag animation)

import { useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Reveal } from "@/components/nav/reveal";
import { SearchBox } from "@/components/nav/search-box";
import {
  clearRecentSearches,
  getRecentSearchIdsServerSnapshot,
  getRecentSearchIdsSnapshot,
  subscribeRecentSearches,
} from "@/components/nav/recent-searches";
import { formatPriceVnd, searchProducts, type SearchProduct } from "@/components/nav/search-data";
import { shopCategories } from "./shop-categories-data";

// Href/label giống hệt product-highlights.tsx (VIEW_ALL_HREF/VIEW_ALL_LABEL) — 1 nguồn chân lý
// cho "trang tất cả sản phẩm", tránh 2 nơi lệch nhau nếu route đổi sau này.
const ALL_PRODUCTS_HREF = "/san-pham";
const ALL_PRODUCTS_LABEL = "Xem tất cả sản phẩm";

// Chip gợi ý (P1) — 6 danh mục nhiều SKU nhất, lấy đúng thứ tự đã sort giảm dần trong
// shopCategories (shop-categories-data.ts, dữ liệu thật từ catalog) — không tự bịa danh sách
// riêng cho Hero để tránh 2 nguồn "danh mục hot" lệch nhau giữa Hero và ShopByCategory.
const quickCategoryChips = shopCategories.slice(0, 6);

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
  // P2 — thay hệ tab "Giải pháp/Danh mục sản phẩm/Thương hiệu" cũ bằng "Sản phẩm bạn đã tìm"
  // (lịch sử search, theo yêu cầu trực tiếp 2026-09-04). Site chưa có tài khoản/backend nên
  // lịch sử lưu localStorage theo trình duyệt (recent-searches.ts, ghi từ search-box.tsx đúng
  // lúc khách bấm 1 kết quả gợi ý cụ thể) — chỉ lưu id, tự tra lại record mới nhất (tên/giá/
  // ảnh) từ `searchProducts` (search-data.ts) ở đây.
  //
  // `useSyncExternalStore` (không phải useEffect+setState) — localStorage không tồn tại lúc
  // SSR nên cần tách snapshot server (rỗng, getRecentSearchIdsServerSnapshot) / client (đọc
  // thật, getRecentSearchIdsSnapshot); đây là cách React xử lý đúng bài toán "đọc từ external
  // store" mà không cần setState đồng bộ trong effect (tránh lint react-hooks/set-state-in-
  // effect, cùng tinh thần "tính trong lúc render" mà reveal.tsx/mega-menu.tsx đã dùng).
  //
  // KHÔNG có fallback "sản phẩm gợi ý" khi rỗng (theo yêu cầu trực tiếp) — chưa từng search
  // thì ẩn hẳn khối này, panel Hero ngắn lại, chỉ hiện sau khi khách đã bấm ít nhất 1 kết quả.
  const recentIds = useSyncExternalStore(
    subscribeRecentSearches,
    getRecentSearchIdsSnapshot,
    getRecentSearchIdsServerSnapshot,
  );
  const recentProducts = recentIds
    .map((id) => searchProducts.find((product) => product.id === id))
    .filter((product): product is SearchProduct => product !== undefined);

  return (
    // relative + overflow-hidden để làm nền cho ảnh absolute bên dưới. bg-card vẫn giữ làm màu
    // nền dự phòng (trước khi ảnh load xong). Chiều cao TỐI THIỂU 95vh theo yêu cầu 2026-09-04
    // (đổi từ h-[90vh] cố định trước đó) — nội dung căn giữa theo chiều dọc (flex justify-center)
    // trong khung tối thiểu 95vh đó; nếu nội dung (vd tab "Thương hiệu" nhiều ô) cao hơn 95vh,
    // section tự nới rộng theo nội dung thay vì cắt — wrapper bên trong vẫn giữ overflow-y-auto
    // làm lưới an toàn cho trường hợp viewport quá thấp (vd landscape mobile).
    <section className="relative flex min-h-[95vh] flex-col justify-center overflow-hidden bg-card py-10 text-center">
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

      <div className="relative mx-auto max-h-full w-full max-w-[var(--container-max)] overflow-y-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] md:px-8 lg:px-16 [&::-webkit-scrollbar]:hidden">
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
          <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
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

            {/* P2 — "Sản phẩm bạn đã tìm": thay hệ tab Giải pháp/Danh mục sản phẩm/Thương hiệu
                cũ (theo yêu cầu trực tiếp 2026-09-04, xem comment ở đầu component). Lịch sử
                search THẬT (localStorage, recent-searches.ts) — không có fallback "gợi ý" khi
                rỗng (theo yêu cầu trực tiếp), nên ẩn hẳn cả khối kể cả heading khi chưa có lịch
                sử, thay vì chừa 1 khoảng trống/tiêu đề cụt. Card tái dùng đúng ngôn ngữ hình ảnh
                P1 (rounded-2xl, border-border, hover nâng nhẹ) để đồng bộ style trong panel. */}
            {recentProducts.length > 0 && (
              <div className="mt-8 sm:mt-10">
                <div className="flex items-center justify-center gap-3">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Sản phẩm bạn đã tìm
                  </h2>
                  <button
                    type="button"
                    onClick={clearRecentSearches}
                    className="text-xs font-medium text-muted-foreground underline decoration-dotted underline-offset-2 transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Xoá lịch sử
                  </button>
                </div>
                {/* Thẻ nhỏ hơn ~30% bản đầu (theo yêu cầu trực tiếp) — lưới dày hơn (3/6 cột thay
                    2/4) để mỗi ô hẹp lại đúng tỉ lệ đó (ảnh vuông ăn theo bề rộng ô), kèm giảm
                    padding/bo góc/cỡ chữ tương ứng cho cân đối với ô nhỏ hơn. */}
                <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {recentProducts.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={product.url}
                        className="group flex h-full flex-col gap-1.5 rounded-xl border border-border bg-card p-2 text-left transition-[transform,box-shadow,border-color] duration-150 ease-out hover:-translate-y-0.5 hover:border-accent hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                      >
                        <span className="flex aspect-square items-center justify-center overflow-hidden rounded-lg">
                          <Image
                            src={product.image.src}
                            alt={product.name}
                            width={product.image.width}
                            height={product.image.height}
                            className="h-full w-full object-contain"
                          />
                        </span>
                        <span className="line-clamp-2 text-[10px] font-semibold leading-snug text-foreground sm:text-[11px]">
                          {product.name}
                        </span>
                        <span className="mt-auto text-[10px] font-semibold text-accent sm:text-[11px]">
                          {formatPriceVnd(product.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

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

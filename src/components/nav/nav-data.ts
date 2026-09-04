import {
  Lightbulb,
  Snowflake,
  ShieldCheck,
  Circuitry,
  Broadcast,
  WifiHigh,
  type Icon,
} from "@phosphor-icons/react";

/**
 * Dữ liệu menu Navbar + taxonomy danh mục dùng chung (Hero icon-row, search suggestion...).
 * ĐÂY LÀ NGUỒN DUY NHẤT cho 6 category-group — nơi khác (search-data.ts, Hero) import từ đây,
 * không tự định nghĩa lại để tránh lệch data.
 *
 * NGUỒN:
 * - `productCategories` và `topBrands`: lấy từ MCP `KNXStore_Blog` (get_products),
 *   query trực tiếp 745 sản phẩm / 68 brand / 79 category thật trong catalog (2026-08-28).
 *   Số lượng (count) là số SKU thật tại thời điểm query — có thể lệch nếu catalog đổi.
 * - `solutions`: KHÔNG có dữ liệu CMS nào backing mục này (get_content_pillars không
 *   trả về trang pillar theo use-case). Đây là ĐỀ XUẤT dựa trên phân khúc B2B/B2C thường
 *   gặp của ngành building automation — CẦN xác nhận lại với đội sales/marketing trước
 *   khi coi là chính thức.
 */

export type CategoryGroupKey =
  | "chieu-sang"
  | "hvac"
  | "an-ninh"
  | "knx"
  | "cam-bien"
  | "matter";

export type NavGroupItem = {
  label: string;
  href: string;
  meta?: string;
  /** Chỉ set cho category group — dùng để tra icon dùng chung (xem categoryIcon bên dưới). */
  key?: CategoryGroupKey;
};

export type NavGroup = {
  label: string;
  href: string;
  items: NavGroupItem[];
  viewAllHref: string;
  viewAllLabel: string;
};

// Placeholder "visual" theo nhóm — catalog thật chưa có ảnh sản phẩm, dùng icon Phosphor thay.
export const categoryIcon: Record<CategoryGroupKey, Icon> = {
  "chieu-sang": Lightbulb,
  hvac: Snowflake,
  "an-ninh": ShieldCheck,
  knx: Circuitry,
  "cam-bien": Broadcast,
  matter: WifiHigh,
};

// Nhãn NGẮN theo nhóm — khác `label` dài trong productCategories.items (vd: "Chiếu sáng
// (DALI-2 / Casambi / DMX512)"), dùng cho chỗ cần gọn: badge/chip trên thẻ sản phẩm
// (product-highlights.tsx). Dùng chung 1 nguồn thay vì mỗi nơi tự viết tắt riêng.
export const categoryGroupShortLabel: Record<CategoryGroupKey, string> = {
  "chieu-sang": "Chiếu sáng",
  hvac: "HVAC",
  "an-ninh": "An ninh",
  knx: "KNX",
  "cam-bien": "Cảm biến",
  matter: "Matter",
};

// Thật — gom 79 category thô trong catalog thành 6 nhóm theo domain, khớp với
// article_section thật của blog (Chiếu sáng 54 bài, HVAC 21 bài, An ninh 13 bài, KNX 9 bài...)
export const productCategories: NavGroup = {
  label: "Danh mục sản phẩm",
  href: "/danh-muc-san-pham",
  viewAllHref: "/danh-muc-san-pham",
  viewAllLabel: "Xem tất cả danh mục",
  items: [
    {
      key: "chieu-sang",
      label: "Chiếu sáng (DALI-2 / Casambi / DMX512)",
      href: "/danh-muc-san-pham/chieu-sang",
      meta: "~230 sản phẩm",
    },
    {
      key: "hvac",
      label: "Điều hoà / HVAC",
      href: "/danh-muc-san-pham/dieu-hoa-hvac",
      meta: "~130 sản phẩm",
    },
    {
      key: "an-ninh",
      label: "An ninh",
      href: "/danh-muc-san-pham/an-ninh",
      meta: "~110 sản phẩm",
    },
    {
      key: "knx",
      label: "KNX",
      href: "/danh-muc-san-pham/knx",
      meta: "~34 sản phẩm",
    },
    {
      key: "cam-bien",
      label: "Cảm biến",
      href: "/danh-muc-san-pham/cam-bien",
      meta: "đa giao thức",
    },
    {
      key: "matter",
      label: "Matter Smarthome",
      href: "/danh-muc-san-pham/matter-smarthome",
      meta: "~44 sản phẩm",
    },
  ],
};

// Thật — top 8 brand theo số SKU trong catalog (68 brand tổng, xem "Xem tất cả")
export const topBrands: NavGroup = {
  label: "Thương hiệu",
  href: "/thuong-hieu",
  viewAllHref: "/thuong-hieu",
  viewAllLabel: "Xem tất cả 68 thương hiệu",
  items: [
    { label: "Satel", href: "/thuong-hieu/satel", meta: "110 SP" },
    { label: "Sunricher", href: "/thuong-hieu/sunricher", meta: "61 SP" },
    { label: "Legrand", href: "/thuong-hieu/legrand", meta: "60 SP" },
    { label: "Airzone", href: "/thuong-hieu/airzone", meta: "36 SP" },
    { label: "Moorgen", href: "/thuong-hieu/moorgen", meta: "32 SP" },
    { label: "IR-TEC", href: "/thuong-hieu/ir-tec", meta: "32 SP" },
    { label: "Kanonbus", href: "/thuong-hieu/kanonbus", meta: "31 SP" },
    { label: "Intesis", href: "/thuong-hieu/intesis", meta: "30 SP" },
  ],
};

// Thật — khớp đúng menu "Giải pháp" trên knxstore.vn (crawl 2026-09-04): danh sách PHẲNG 12
// giao thức/loại giải pháp (KHÔNG phải phân theo loại công trình như bản đề xuất cũ đã bỏ).
// Mỗi mục trỏ tới 1 trang nội dung SEO dài (không phải trang danh mục sản phẩm đơn giản) —
// href gốc là /solution/{slug}, giữ nguyên "Mobus" (không phải lỗi gõ "Modbus" — đây là giao
// thức RS-485 riêng của Moorgen, đã verify nội dung trang thật, khác Modbus công nghiệp mở).
export const solutions: NavGroup = {
  label: "Giải pháp",
  href: "/giai-phap",
  viewAllHref: "/giai-phap",
  viewAllLabel: "Xem tất cả giải pháp",
  items: [
    { label: "Casambi", href: "/solution/casambi" },
    { label: "KNX", href: "/solution/knx" },
    { label: "DALI", href: "/solution/dali" },
    { label: "DMX", href: "/solution/dmx" },
    { label: "Lutron", href: "/solution/lutron" },
    { label: "HomeKit", href: "/solution/homekit" },
    { label: "Zigbee", href: "/solution/zigbee" },
    { label: "Mobus", href: "/solution/mobus" },
    { label: "An ninh", href: "/solution/an-ninh" },
    { label: "Giải pháp khác", href: "/solution/giai-phap-khac" },
    { label: "Matter", href: "/solution/matter" },
    { label: "HVAC", href: "/solution/hvac" },
  ],
};

export const simpleLinks: NavGroupItem[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Dự án", href: "/du-an" },
  { label: "Blog", href: "/blog" },
];

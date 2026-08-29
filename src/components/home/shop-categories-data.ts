/**
 * "Shop by Category" (trang chủ) — 17 category, chọn KHÁCH QUAN theo SỐ SKU CAO NHẤT trong
 * 79 category thô của catalog thật (KHÔNG phải nhóm kinh doanh tự đặt).
 *
 * Nguồn: MCP `KNXStore_Blog` → `get_products` (category="", brand="", limit=50), query
 * 2026-08-29 — trả về đúng 745 sản phẩm / 79 category thô, không có field nhóm trung gian
 * nào giữa raw category (79) và 6 macro-group đang dùng ở nav (`nav-data.ts`
 * `productCategories`). Vì vậy lấy top-17 theo count là cách khách quan nhất để chọn 17
 * category — tránh tự bịa taxonomy kinh doanh (giống lưu ý ĐỀ XUẤT ở `solutions` trong
 * nav-data.ts, việc tự nhóm sẽ cần sales/marketing duyệt lại nếu muốn thay bằng nhóm khác).
 *
 * `count` giữ trong data để audit/sort — KHÔNG hiển thị lên UI (xem shop-by-category.tsx,
 * đã bỏ theo yêu cầu ẩn số lượng sản phẩm khỏi card).
 *
 * `href`: `/danh-muc-san-pham/{slug}` — theme hiện CHƯA có route danh mục dựng sẵn (chưa
 * có trang nào trong `src/app` khớp), giữ đúng pattern của 6 macro-group để nhất quán;
 * trỏ route thật khi trang danh mục theo raw category được dựng.
 */

// Cùng cách bỏ dấu với normalizeSearchText (search-data.ts) — lọc combining mark theo
// codePoint thay vì literal regex range để tránh chép nhầm ký tự tổ hợp trong source.
function slugify(input: string): string {
  const noDiacritics = input
    .normalize("NFD")
    .split("")
    .filter((ch) => {
      const code = ch.codePointAt(0) ?? 0;
      return !(code >= 0x0300 && code <= 0x036f);
    })
    .join("");
  return noDiacritics
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type ShopCategory = {
  label: string;
  count: number;
  href: string;
};

const RAW_TOP_17: Array<{ label: string; count: number }> = [
  { label: "Điều khiển máy lạnh VRV/VRF", count: 54 },
  { label: "Điều khiển máy lạnh cục bộ", count: 41 },
  { label: "Điều khiển ON/OFF", count: 31 },
  { label: "Thiết bị mở rộng", count: 29 },
  { label: "Dimmer Triac", count: 28 },
  { label: "Bộ nguồn Casambi", count: 27 },
  { label: "Cảm biến chống trộm", count: 21 },
  { label: "Cảm biến hiện diện", count: 16 },
  { label: "Thiết bị mở rộng an ninh", count: 15 },
  { label: "Cảm biến cửa từ", count: 15 },
  { label: "Cảm biến On/Off độc lập", count: 15 },
  { label: "Công tắc Casambi", count: 15 },
  { label: "Dimmer DALI", count: 14 },
  { label: "Cảm biến an ninh an toàn", count: 14 },
  { label: "Công tắc Matter", count: 14 },
  { label: "Công tắc KNX", count: 14 },
  { label: "Bộ nguồn Dali", count: 14 },
];

export const shopCategories: ShopCategory[] = RAW_TOP_17.map((c) => ({
  ...c,
  href: `/danh-muc-san-pham/${slugify(c.label)}`,
}));

/**
 * Data mẫu cho ô tìm kiếm gợi ý sản phẩm.
 *
 * 10 sản phẩm THẬT lấy từ MCP KNXStore_Blog (get_products, tra ngày 2026-08-28) —
 * tên, brand, giá, url gốc đều có thật trong catalog, không bịa.
 *
 * `image`: ảnh sản phẩm THẬT — catalog MCP không có trường ảnh (ghi chú cũ), nên crawl trực
 * tiếp từng trang sản phẩm trên knxstore.vn (2026-09-04), lưu local ở public/products/. Dùng
 * cho "Sản phẩm bạn đã tìm" (hero.tsx) — lịch sử search lưu localStorage (recent-searches.ts),
 * hydrate lại full record (tên/giá/ảnh) từ đúng mảng này theo `id`, không lưu full snapshot
 * trong localStorage để tránh dữ liệu cũ lệch nếu sau này catalog thay đổi.
 *
 * TODO khi có backend: thay toàn bộ bằng gọi API tìm kiếm thật (debounce input -> server),
 * bỏ filter client-side.
 */

// CategoryGroupKey + icon: nguồn duy nhất là nav-data.ts (dùng chung với Hero/nav dropdown).
export type { CategoryGroupKey } from "./nav-data";
import type { CategoryGroupKey } from "./nav-data";

export type SearchProduct = {
  id: number;
  name: string;
  brand: string;
  /** VND. 0 = chưa niêm yết / liên hệ báo giá (đúng như data thật, không tự điền số). */
  price: number;
  categoryGroup: CategoryGroupKey;
  url: string;
  image: { src: string; width: number; height: number };
};

export const searchProducts: SearchProduct[] = [
  {
    id: 6,
    name: "CBU-A2D - Bộ điều khiển 2 kênh DALI và 0-10V Bluetooth Casambi",
    brand: "Casambi",
    price: 4128000,
    categoryGroup: "chieu-sang",
    url: "/san-pham/casambi-bo-dieu-khien-2-kenh-0-10v-dali-bluetooth-cbu-a2d",
    image: { src: "/products/casambi-cbu-a2d.jpg", width: 1734, height: 1734 },
  },
  {
    id: 5,
    name: "Bóng đèn LED thông minh Casambi Bluetooth Carus E27 - LE43 080488",
    brand: "Carus",
    price: 0,
    categoryGroup: "chieu-sang",
    url: "/san-pham/carus-bong-den-led-thong-minh-dieu-chinh-qua-bluetooth",
    image: { src: "/products/carus-le43-080488.jpg", width: 500, height: 500 },
  },
  {
    id: 42,
    name: "Bộ điều khiển điều hòa VRV/VRF Kanonbus IP Router/Modbus RTU - KAC001",
    brand: "Kanonbus",
    price: 17152000,
    categoryGroup: "hvac",
    url: "/san-pham/kanonbus-bo-dieu-khien-dieu-hoa-vrv-vrf-kac001",
    image: { src: "/products/kac001.png", width: 680, height: 510 },
  },
  {
    id: 51,
    name: "Bộ điều khiển điều hòa KNX Kanonbus - KAC008",
    brand: "Kanonbus",
    price: 39878000,
    categoryGroup: "hvac",
    url: "/san-pham/kanonbus-bo-dieu-khien-dieu-hoa-vrv-vrf-knx-kac008",
    image: { src: "/products/kac008.png", width: 680, height: 510 },
  },
  {
    id: 472,
    name: "Bàn phím điều khiển có dây PERFECTA Satel - PRF-LCD",
    brand: "Satel",
    price: 4260000,
    categoryGroup: "an-ninh",
    url: "/san-pham/satel-ban-phim-dieu-khien-co-day-perfecta-prf-lcd",
    image: { src: "/products/satel-prf-lcd.jpg", width: 600, height: 600 },
  },
  {
    id: 469,
    name: "Cảm biến chống trộm không dây đa chức năng Satel - AXD-200",
    brand: "Satel",
    price: 2960000,
    categoryGroup: "an-ninh",
    url: "/san-pham/satel-axd-200-cam-bien-khong-day-da-chuc-nang",
    image: { src: "/products/axd-200.jpg", width: 600, height: 600 },
  },
  {
    id: 72,
    name: "Cảm biến hiện diện KNX CP Electronics - EBDHS-KNX",
    brand: "CP Electronics",
    price: 8680000,
    categoryGroup: "knx",
    url: "/san-pham/cp-electronics-cam-bien-hien-dien-knx-ebdhs-knx",
    image: { src: "/products/cp-electronics-ebdhs-knx.jpg", width: 500, height: 500 },
  },
  {
    id: 117,
    name: "Bộ điều khiển KNX host Kanonbus - KTS-BOX2",
    brand: "Kanonbus",
    price: 46555000,
    categoryGroup: "knx",
    url: "/san-pham/kanonbus-bo-dieu-khien-knx-host",
    image: { src: "/products/kanonbus-kts-box2.png", width: 802, height: 602 },
  },
  {
    id: 2,
    name: "Cảm biến hiện diện SmartDIM 0-10V IR-TEC - ON-LRD-509",
    brand: "IR-TEC",
    price: 4500496,
    categoryGroup: "cam-bien",
    url: "/san-pham/ir-tec-cam-bien-hien-dien-smartdim-0-10v",
    image: { src: "/products/ir-tec-on-lrd-509.jpg", width: 545, height: 409 },
  },
  {
    id: 40,
    name: "Bộ điều khiển LED dây CV RGBW ZigBee Matter - AI-ZGCV-5M",
    brand: "OEM",
    price: 2560000,
    categoryGroup: "matter",
    url: "/san-pham/ai-control-dieu-khien-led-day-rgbw",
    image: { src: "/products/ai-zgcv-5m.jpg", width: 1000, height: 1000 },
  },
];

export function formatPriceVnd(price: number): string {
  if (price <= 0) return "Liên hệ báo giá";
  return `${price.toLocaleString("vi-VN")}đ`;
}

/** Bỏ dấu + hạ chữ thường để so khớp không phân biệt dấu tiếng Việt (vd: "den" khớp "đèn"). */
export function normalizeSearchText(input: string): string {
  const noDiacritics = input
    .normalize("NFD")
    .split("")
    .filter((ch) => {
      const code = ch.codePointAt(0) ?? 0;
      return !(code >= 0x0300 && code <= 0x036f); // bỏ combining diacritical marks
    })
    .join("");
  return noDiacritics.replace(/đ/gi, "d").toLowerCase().trim();
}

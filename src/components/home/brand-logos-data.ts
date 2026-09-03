/**
 * Logo thương hiệu cho marquee trang chủ (brand-marquee.tsx) — lấy trực tiếp từ carousel
 * "Thương hiệu" thật trên site WordPress hiện hành (knxstore.vn), verify từng URL bằng HTTP
 * HEAD trước khi tải (200 OK cả 23/23) rồi lưu về public/brands/, giữ đúng thứ tự xuất hiện
 * trên site gốc — KHÔNG sort lại theo SKU như topBrands (nav-data.ts), vì mục đích ở đây là
 * tái hiện đúng dải logo đối tác đang chạy thật, không phải bảng xếp hạng brand bán chạy.
 *
 * 7/23 brand trùng với topBrands (nav-data.ts): satel, sunricher, legrand, airzone, ir-tec,
 * kanonbus, intesis — dùng chung slug/href `/thuong-hieu/{slug}` với topBrands cho nhất quán.
 * `moorgen` (có trong topBrands) KHÔNG có mặt ở đây vì site gốc không có file logo nào cho
 * brand này (đã kiểm tra riêng, chỉ có trang liệt kê sản phẩm dạng text).
 *
 * width/height là kích thước gốc thật của từng file (đọc bằng `file`), không đoán — hầu hết
 * 900x168 nhưng core/enertex-bayern-gmbh/hugo-muller/protopixel có tỉ lệ khác, cần giữ đúng để
 * next/image không cảnh báo sai aspect ratio.
 */
export type BrandLogo = {
  slug: string;
  label: string;
  src: string;
  width: number;
  height: number;
  href: string;
};

export const brandLogos: BrandLogo[] = [
  { slug: "ir-tec", label: "IR-TEC", src: "/brands/ir-tec.jpg", width: 900, height: 168, href: "/thuong-hieu/ir-tec" },
  { slug: "casambi", label: "Casambi", src: "/brands/casambi.jpg", width: 900, height: 168, href: "/thuong-hieu/casambi" },
  { slug: "satel", label: "Satel", src: "/brands/satel.jpg", width: 900, height: 168, href: "/thuong-hieu/satel" },
  { slug: "kanonbus", label: "Kanonbus", src: "/brands/kanonbus.jpg", width: 900, height: 168, href: "/thuong-hieu/kanonbus" },
  { slug: "siqitech", label: "Siqitech", src: "/brands/siqitech.jpg", width: 900, height: 168, href: "/thuong-hieu/siqitech" },
  { slug: "cool-automation", label: "Cool Automation", src: "/brands/cool-automation.jpg", width: 900, height: 168, href: "/thuong-hieu/cool-automation" },
  { slug: "intesis", label: "Intesis", src: "/brands/intesis.jpg", width: 900, height: 168, href: "/thuong-hieu/intesis" },
  { slug: "atios", label: "Atios", src: "/brands/atios.jpg", width: 900, height: 168, href: "/thuong-hieu/atios" },
  { slug: "sunricher", label: "Sunricher", src: "/brands/sunricher.jpg", width: 900, height: 168, href: "/thuong-hieu/sunricher" },
  { slug: "danlers", label: "Danlers", src: "/brands/danlers.jpg", width: 900, height: 168, href: "/thuong-hieu/danlers" },
  { slug: "ofler", label: "Ofler", src: "/brands/ofler.jpg", width: 900, height: 168, href: "/thuong-hieu/ofler" },
  { slug: "legrand", label: "Legrand", src: "/brands/legrand.jpg", width: 900, height: 168, href: "/thuong-hieu/legrand" },
  { slug: "helvar", label: "Helvar", src: "/brands/helvar.jpg", width: 900, height: 168, href: "/thuong-hieu/helvar" },
  { slug: "uitiot", label: "UITIOT", src: "/brands/uitiot.jpg", width: 900, height: 168, href: "/thuong-hieu/uitiot" },
  { slug: "airzone", label: "Airzone", src: "/brands/airzone.jpg", width: 900, height: 168, href: "/thuong-hieu/airzone" },
  { slug: "remotec", label: "Remotec", src: "/brands/remotec.jpg", width: 900, height: 168, href: "/thuong-hieu/remotec" },
  { slug: "steinel", label: "Steinel", src: "/brands/steinel.jpg", width: 900, height: 168, href: "/thuong-hieu/steinel" },
  { slug: "micro-air", label: "Micro Air", src: "/brands/micro-air.jpg", width: 900, height: 168, href: "/thuong-hieu/micro-air" },
  { slug: "protopixel", label: "Protopixel", src: "/brands/protopixel.jpg", width: 900, height: 235, href: "/thuong-hieu/protopixel" },
  { slug: "core", label: "Core", src: "/brands/core.png", width: 900, height: 181, href: "/thuong-hieu/core" },
  { slug: "enertex-bayern-gmbh", label: "Enertex Bayern GmbH", src: "/brands/enertex-bayern-gmbh.png", width: 900, height: 282, href: "/thuong-hieu/enertex-bayern-gmbh" },
  { slug: "abb", label: "ABB", src: "/brands/abb.jpg", width: 900, height: 168, href: "/thuong-hieu/abb" },
  { slug: "hugo-muller", label: "Hugo Müller", src: "/brands/hugo-muller.png", width: 900, height: 157, href: "/thuong-hieu/hugo-muller" },
];

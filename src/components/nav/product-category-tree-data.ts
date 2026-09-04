/**
 * Cây danh mục sản phẩm 2 CẤP THẬT — khớp đúng menu "Danh mục sản phẩm" trên knxstore.vn
 * (crawl trực tiếp site 2026-09-04: 16 danh mục cha, tổng ~54 danh mục con) + số SKU thật lấy
 * từ MCP KNXStore_Blog (`get_products`, 745 sản phẩm — cùng nguồn đã dùng cho `productCategories`
 * /`topBrands` trong nav-data.ts), verify chéo lại bằng chính trang danh mục cho vài mục MCP
 * không có (vd "Công tắc hẹn giờ điện tử" — MCP không liệt kê nhưng trang thật ghi rõ "7 sản
 * phẩm", ưu tiên số trên trang thật).
 *
 * KHÁC với `productCategories` (nav-data.ts): đó là 6 nhóm MACRO theo domain/giao thức (Chiếu
 * sáng/HVAC/An ninh/KNX/Cảm biến/Matter) — dùng cho Hero, badge sản phẩm (product-highlights.tsx),
 * icon search (search-box.tsx). Cây ở ĐÂY là đúng cấu trúc parent/child thật của catalog (WooCommerce
 * category), chỉ dùng riêng cho tab "Danh mục sản phẩm" trong mega-menu.tsx (`CategoryPanel`) —
 * KHÔNG đụng/thay thế `productCategories`, 2 taxonomy tồn tại song song cho 2 mục đích khác nhau.
 *
 * `count`: số SKU thật gán trực tiếp vào đúng danh mục đó (không cộng dồn từ con). `count: 0`
 * nghĩa là danh mục còn tồn tại thật trên site nhưng hiện chưa có sản phẩm nào (đã verify bằng
 * cách tải raw HTML trang đó, không phải suy đoán) — giữ nguyên, không ẩn/không bịa số.
 *
 * `image`: ảnh SẢN PHẨM ĐẠI DIỆN đầu tiên trong danh mục đó (không có banner danh mục riêng —
 * site gốc không có), crawl từ chính trang danh mục, lưu local ở public/categories/<slug>.<ext>
 * (đuôi file đã verify đúng định dạng thật bằng lệnh `file`, không tin theo Content-Type server
 * trả về — 2 ảnh ban đầu tải về đuôi .jpg nhưng thực chất là PNG, đã đổi lại đúng đuôi). Danh mục
 * 0 sản phẩm thì KHÔNG có ảnh (`image` bỏ trống) — UI tự fallback, không vẽ ảnh giả.
 */

export type ProductCategoryLeaf = {
  label: string;
  href: string;
  /** Số SKU thật — 0 = danh mục còn tồn tại nhưng chưa có sản phẩm nào. */
  count: number;
  image?: { src: string; width: number; height: number };
};

/** Danh mục cha — có thể có `children` (bấm để xem danh mục con) hoặc rỗng (bản thân nó đã là
 * 1 leaf, bấm vào là đi thẳng tới trang sản phẩm của chính nó). */
export type ProductCategoryNode = ProductCategoryLeaf & {
  children: ProductCategoryLeaf[];
};

export const productCategoryTree: ProductCategoryNode[] = [
  {
    label: "Bộ điều khiển trung tâm",
    href: "/bo-dieu-khien-trung-tam",
    count: 3,
    children: [
      {
        label: "Điều khiển Casambi",
        href: "/casambi-gateway",
        count: 6,
        image: { src: "/categories/casambi-gateway.jpg", width: 1734, height: 1734 },
      },
      {
        label: "Bộ điều khiển DALI",
        href: "/dali-gateway",
        count: 11,
        image: { src: "/categories/dali-gateway.jpg", width: 1000, height: 1000 },
      },
      {
        label: "Bộ điều khiển KNX",
        href: "/bo-dieu-khien-knx-gateway",
        count: 7,
        image: { src: "/categories/bo-dieu-khien-knx-gateway.png", width: 802, height: 602 },
      },
      {
        label: "Bộ điều khiển HomeKit",
        href: "/bo-dieu-khien-homekit",
        count: 7,
        image: { src: "/categories/bo-dieu-khien-homekit.jpeg", width: 1000, height: 1000 },
      },
      {
        label: "Bộ điều khiển DMX",
        href: "/bo-dieu-khien-dmx",
        count: 12,
        image: { src: "/categories/bo-dieu-khien-dmx.png", width: 680, height: 510 },
      },
    ],
  },
  {
    label: "Điều khiển chiếu sáng",
    href: "/dieu-khien-chieu-sang",
    count: 1,
    children: [
      {
        label: "Điều khiển 0-10V",
        href: "/dimmer-doc-lap-0-10v",
        count: 10,
        image: { src: "/categories/dimmer-doc-lap-0-10v.png", width: 625, height: 625 },
      },
      {
        label: "Dimmer DALI",
        href: "/dimmer-doc-lap-dali",
        count: 14,
        image: { src: "/categories/dimmer-doc-lap-dali.jpg", width: 1734, height: 1734 },
      },
      {
        label: "Dimmer Triac",
        href: "/dimmer-doc-lap-triac",
        count: 28,
        image: { src: "/categories/dimmer-doc-lap-triac.png", width: 401, height: 302 },
      },
      {
        label: "Dimmer DMX",
        href: "/dmx",
        count: 9,
        image: { src: "/categories/dmx.jpg", width: 1734, height: 1734 },
      },
      {
        label: "Điều khiển ON/OFF",
        href: "/dieu-khien-chieu-sang-on-off",
        count: 31,
        image: { src: "/categories/dieu-khien-chieu-sang-on-off.jpg", width: 1000, height: 1000 },
      },
    ],
  },
  {
    label: "Điều khiển máy lạnh",
    href: "/dieu-khien-may-lanh",
    count: 7,
    children: [
      {
        label: "Bảng điều khiển điều hòa",
        href: "/bang-dieu-khien-thermostat",
        count: 11,
        image: { src: "/categories/bang-dieu-khien-thermostat.png", width: 680, height: 510 },
      },
      {
        label: "Điều khiển máy lạnh cục bộ",
        href: "/dieu-khien-may-lanh-cuc-bo",
        count: 41,
        image: { src: "/categories/dieu-khien-may-lanh-cuc-bo.jpg", width: 1000, height: 1000 },
      },
      // 0 sản phẩm hiện tại — đã verify raw HTML trang này không có product card nào.
      { label: "Điều khiển cấp gió tươi", href: "/dieu-khien-cap-gio-tuoi", count: 0 },
      {
        label: "Điều khiển máy lạnh VRV/VRF",
        href: "/dieu-khien-may-lanh-trung-tam-vrv-vrf",
        count: 54,
        image: { src: "/categories/dieu-khien-may-lanh-trung-tam-vrv-vrf.jpg", width: 1000, height: 1000 },
      },
      {
        label: "Điều khiển máy lạnh FCU",
        href: "/dieu-khien-may-lanh-fcu",
        count: 4,
        image: { src: "/categories/dieu-khien-may-lanh-fcu.jpg", width: 1734, height: 1734 },
      },
      {
        label: "Cảm biến chất lượng không khí",
        href: "/cam-bien-chat-luong-khong-khi",
        count: 4,
        image: { src: "/categories/cam-bien-chat-luong-khong-khi.png", width: 688, height: 688 },
      },
    ],
  },
  {
    label: "Công tắc thông minh",
    href: "/cong-tac-thong-minh",
    count: 7,
    children: [
      {
        label: "Công tắc KNX",
        href: "/cong-tac-knx",
        count: 14,
        image: { src: "/categories/cong-tac-knx.jpg", width: 1000, height: 1000 },
      },
      {
        label: "Công tắc Moorgen",
        href: "/cong-tac-moorgen",
        count: 13,
        image: { src: "/categories/cong-tac-moorgen.jpg", width: 900, height: 900 },
      },
      {
        label: "Công tắc Casambi",
        href: "/casambi-cong-tac",
        count: 15,
        image: { src: "/categories/casambi-cong-tac.jpg", width: 1000, height: 1000 },
      },
      {
        label: "Công tắc DALI",
        href: "/cong-tac-dali",
        count: 13,
        image: { src: "/categories/cong-tac-dali.png", width: 802, height: 600 },
      },
      // 0 sản phẩm hiện tại — đã verify raw HTML trang này không có product card nào.
      { label: "Nút nhấn Dry contact", href: "/nut-nhan-dry-contact", count: 0 },
      {
        label: "Remote điều khiển từ xa",
        href: "/remote-dieu-khien",
        count: 9,
        image: { src: "/categories/remote-dieu-khien.jpg", width: 515, height: 515 },
      },
    ],
  },
  {
    label: "Cảm biến hiện diện",
    href: "/cam-bien-hien-dien",
    count: 16,
    children: [
      {
        label: "Cảm biến 0-10V",
        href: "/cam-bien-dim-0-10v",
        count: 6,
        image: { src: "/categories/cam-bien-dim-0-10v.jpg", width: 545, height: 409 },
      },
      {
        label: "Cảm biến DALI",
        href: "/cam-bien-dim-dali",
        count: 12,
        image: { src: "/categories/cam-bien-dim-dali.jpg", width: 2048, height: 1211 },
      },
      {
        label: "Cảm biến On/Off độc lập",
        href: "/cam-bien-on-off",
        count: 15,
        image: { src: "/categories/cam-bien-on-off.jpeg", width: 545, height: 409 },
      },
      {
        label: "Cảm biến Casambi",
        href: "/casambi-cam-bien",
        count: 7,
        image: { src: "/categories/casambi-cam-bien.jpg", width: 1734, height: 1734 },
      },
      {
        label: "Cảm biến KNX",
        href: "/cam-bien-hien-dien-knx",
        count: 13,
        image: { src: "/categories/cam-bien-hien-dien-knx.jpg", width: 500, height: 500 },
      },
    ],
  },
  {
    label: "Bộ nguồn đèn LED",
    href: "/led-driver-1",
    count: 3,
    children: [
      {
        label: "Bộ nguồn Dali",
        href: "/dali-bo-cap-nguon",
        count: 14,
        image: { src: "/categories/dali-bo-cap-nguon.png", width: 2048, height: 468 },
      },
      {
        label: "Bộ nguồn Triac",
        href: "/bo-nguon-triac",
        count: 2,
        image: { src: "/categories/bo-nguon-triac.png", width: 802, height: 602 },
      },
      {
        label: "Bộ nguồn DMX",
        href: "/bo-nguon-dmx",
        count: 3,
        image: { src: "/categories/bo-nguon-dmx.png", width: 500, height: 500 },
      },
      {
        label: "Bộ nguồn Casambi",
        href: "/bo-nguon-casambi",
        count: 27,
        image: { src: "/categories/bo-nguon-casambi.jpg", width: 500, height: 500 },
      },
      {
        label: "Bộ khuếch đại đèn LED",
        href: "/bo-khuech-dai-den-led",
        count: 4,
        image: { src: "/categories/bo-khuech-dai-den-led.jpg", width: 500, height: 500 },
      },
    ],
  },
  {
    // Không có danh mục con trên site gốc — bấm vào rail sẽ hiện đúng 1 thẻ (chính nó) ở panel bên phải.
    label: "Khóa cửa thông minh",
    href: "/khoa-cua-thong-minh",
    count: 9,
    image: { src: "/categories/khoa-cua-thong-minh.jpg", width: 1000, height: 1000 },
    children: [],
  },
  {
    label: "Thiết bị an ninh báo động",
    href: "/kiem-soat-ra-vao",
    count: 0,
    children: [
      {
        label: "Thiết bị mở rộng an ninh",
        href: "/module-mo-rong",
        count: 15,
        image: { src: "/categories/module-mo-rong.jpg", width: 600, height: 600 },
      },
      {
        label: "Remote radio",
        href: "/remote-radio",
        count: 4,
        image: { src: "/categories/remote-radio.jpg", width: 600, height: 600 },
      },
      {
        label: "Tủ an ninh",
        href: "/tu-an-ninh",
        count: 2,
        image: { src: "/categories/tu-an-ninh.jpg", width: 600, height: 600 },
      },
      {
        label: "Dây cáp điều khiển",
        href: "/day-cap-dieu-khien",
        count: 3,
        image: { src: "/categories/day-cap-dieu-khien.jpg", width: 600, height: 600 },
      },
      {
        label: "Bảng điều khiển trung tâm",
        href: "/bang-dieu-khien-trung-tam",
        count: 12,
        image: { src: "/categories/bang-dieu-khien-trung-tam.jpg", width: 1000, height: 1000 },
      },
      {
        label: "Màn hình điều khiển an ninh",
        href: "/man-hinh-dieu-khien-an-ninh",
        count: 1,
        image: { src: "/categories/man-hinh-dieu-khien-an-ninh.jpg", width: 1000, height: 600 },
      },
      {
        label: "Bàn phím điều khiển an ninh",
        href: "/ban-phim-dieu-khien-an-ninh",
        count: 5,
        image: { src: "/categories/ban-phim-dieu-khien-an-ninh.jpg", width: 600, height: 600 },
      },
      {
        label: "Còi báo động chống trộm",
        href: "/coi-bao-dong",
        count: 9,
        image: { src: "/categories/coi-bao-dong.png", width: 1000, height: 1083 },
      },
      {
        label: "Cảm biến chống trộm",
        href: "/cam-bien-chong-trom",
        count: 21,
        image: { src: "/categories/cam-bien-chong-trom.jpg", width: 600, height: 600 },
      },
      {
        label: "Phụ kiện an ninh",
        href: "/phu-kien-an-ninh",
        count: 5,
        image: { src: "/categories/phu-kien-an-ninh.jpg", width: 600, height: 600 },
      },
    ],
  },
  {
    label: "Thiết bị báo cháy",
    href: "/thiet-bi-bao-chay",
    count: 0,
    children: [
      {
        label: "Đầu báo khói",
        href: "/dau-bao-khoi",
        count: 2,
        image: { src: "/categories/dau-bao-khoi.jpg", width: 600, height: 600 },
      },
    ],
  },
  {
    label: "Bộ điều khiển rèm cửa tự động",
    href: "/dieu-khien-rem-cua-tu-dong",
    count: 9,
    image: { src: "/categories/dieu-khien-rem-cua-tu-dong.jpg", width: 600, height: 600 },
    children: [],
  },
  {
    label: "Âm thanh đa vùng",
    href: "/am-thanh-da-vung",
    count: 0,
    children: [
      {
        label: "Âm li",
        href: "/am-li",
        count: 3,
        image: { src: "/categories/am-li.jpg", width: 1000, height: 1000 },
      },
      // 0 sản phẩm hiện tại — đã verify raw HTML trang này không có product card nào.
      { label: "Loa", href: "/loa", count: 0 },
    ],
  },
  {
    label: "Màn hình điều khiển hệ thống",
    href: "/man-hinh-cam-ung",
    count: 6,
    image: { src: "/categories/man-hinh-cam-ung.jpg", width: 600, height: 600 },
    children: [],
  },
  {
    label: "Bộ chuyển đổi tín hiệu",
    href: "/thiet-bi-he-thong",
    count: 2,
    children: [
      {
        label: "Thiết bị mở rộng",
        href: "/thiet-bi-he-thong-knx-bo-mo-rong",
        count: 29,
        image: { src: "/categories/thiet-bi-he-thong-knx-bo-mo-rong.jpg", width: 1000, height: 1000 },
      },
      {
        label: "Bộ điều khiển nguồn",
        href: "/thiet-bi-he-thong-knx-bo-nguon",
        count: 12,
        image: { src: "/categories/thiet-bi-he-thong-knx-bo-nguon.png", width: 680, height: 510 },
      },
      {
        label: "Phụ kiện",
        href: "/phu-kien",
        count: 10,
        image: { src: "/categories/phu-kien.jpg", width: 1734, height: 1734 },
      },
    ],
  },
  {
    label: "Đèn chiếu sáng",
    href: "/den-chieu-sang",
    count: 1,
    children: [
      {
        label: "Đèn thông minh Casambi",
        href: "/den-thong-minh-casambi",
        count: 1,
        image: { src: "/categories/den-thong-minh-casambi.jpg", width: 500, height: 500 },
      },
      {
        label: "Đèn thông minh Philips Hue",
        href: "/den-thong-minh-philips-hue",
        count: 6,
        image: { src: "/categories/den-thong-minh-philips-hue.jpg", width: 800, height: 800 },
      },
    ],
  },
  {
    label: "Thiết bị điện",
    href: "/thiet-bi-dien",
    count: 1,
    children: [
      {
        label: "Công tắc cơ",
        href: "/cong-tac-co",
        count: 11,
        image: { src: "/categories/cong-tac-co.jpg", width: 1000, height: 1000 },
      },
      {
        label: "Ổ cắm",
        href: "/o-cam",
        count: 4,
        image: { src: "/categories/o-cam.png", width: 339, height: 339 },
      },
      // MCP catalog không liệt kê danh mục này, nhưng trang thật ghi rõ "Có 7 sản phẩm" —
      // ưu tiên số trên trang thật (verify riêng ngày 2026-09-04), không dùng 0 như MCP ngụ ý.
      {
        label: "Công tắc hẹn giờ điện tử",
        href: "/cong-tac-hen-gio-dien-tu",
        count: 7,
        image: { src: "/categories/cong-tac-hen-gio-dien-tu.png", width: 1000, height: 1000 },
      },
    ],
  },
  {
    label: "Combo sản phẩm",
    href: "/combo-san-pham-1",
    count: 0,
    children: [
      {
        label: "Combo sản phẩm Casambi",
        href: "/combo-san-pham-casambi",
        count: 5,
        image: { src: "/categories/combo-san-pham-casambi.jpg", width: 1734, height: 1734 },
      },
    ],
  },
];

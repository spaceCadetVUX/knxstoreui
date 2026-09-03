/**
 * Section "Giải pháp theo giao thức" (trang chủ, ngay trên ShopByCategory) — mỗi tab = 1
 * giao thức/nhóm giải pháp lớn. KHÁC với 6 macro-group ở nav-data.ts (productCategories) và
 * 17 category theo SKU cao nhất ở shop-categories-data.ts — đây là danh sách riêng theo yêu
 * cầu trực tiếp (bỏ Lutron, HomeKit, "Giải pháp khác" khỏi danh sách gốc 12 mục).
 *
 * `key`: dùng để tra icon Phosphor tương ứng trong protocol-categories.tsx (PROTOCOL_ICON).
 *
 * href: DALI-2/DMX512/Casambi/Zigbee/Modbus CHƯA có route category riêng dựng sẵn (theme
 * chưa có trang danh mục nào, xem comment shop-categories-data.ts) — dùng slug riêng theo
 * từng giao thức thay vì trỏ tạm về /chieu-sang như hero.tsx, vì đây là tab riêng cho từng
 * giao thức chứ không phải nhóm gộp. KNX/An ninh/Matter/HVAC tái dùng đúng href đã có ở
 * nav-data.ts (productCategories) để không lệch link giữa 2 nơi.
 *
 * Copy: không dùng dấu em dash (—) theo yêu cầu — nối mệnh đề bằng dấu phẩy/liên từ thay thế.
 */
export type ProtocolCategoryKey =
  | "casambi"
  | "knx"
  | "dali"
  | "dmx"
  | "zigbee"
  | "modbus"
  | "an-ninh"
  | "matter"
  | "hvac";

export type ProtocolCategory = {
  key: ProtocolCategoryKey;
  label: string;
  subtitle: string;
  href: string;
  ctaLabel: string;
};

export const protocolCategories: ProtocolCategory[] = [
  {
    key: "casambi",
    label: "Casambi",
    subtitle:
      "Điều khiển chiếu sáng không dây qua Bluetooth Mesh, lắp đặt nhanh, không cần đi dây bus hay bộ điều khiển trung tâm, phù hợp cải tạo công trình cũ.",
    href: "/danh-muc-san-pham/casambi",
    ctaLabel: "Khám phá sản phẩm",
  },
  {
    key: "knx",
    label: "KNX",
    subtitle:
      "Chuẩn bus tự động hoá tòa nhà mở theo ISO/IEC 14543-3, tích hợp chiếu sáng, rèm, HVAC, an ninh trên cùng một hệ thống và tương thích thiết bị đa thương hiệu.",
    href: "/danh-muc-san-pham/knx",
    ctaLabel: "Khám phá sản phẩm",
  },
  {
    key: "dali",
    label: "DALI-2",
    subtitle:
      "Giao thức điều khiển chiếu sáng số theo IEC 62386, định địa chỉ từng thiết bị riêng lẻ, tối ưu cho dimming chính xác và giám sát chiếu sáng thông minh.",
    href: "/danh-muc-san-pham/dali",
    ctaLabel: "Khám phá sản phẩm",
  },
  {
    key: "dmx",
    label: "DMX512",
    subtitle:
      "Giao thức điều khiển ánh sáng theo tiêu chuẩn USITT DMX512, dùng cho chiếu sáng kiến trúc, sân khấu và hiệu ứng động đòi hỏi tốc độ phản hồi cao.",
    href: "/danh-muc-san-pham/dmx",
    ctaLabel: "Khám phá sản phẩm",
  },
  {
    key: "zigbee",
    label: "Zigbee",
    subtitle:
      "Chuẩn kết nối không dây mesh công suất thấp, phù hợp cảm biến, công tắc và thiết bị smarthome cần lắp đặt linh hoạt, tiết kiệm năng lượng.",
    href: "/danh-muc-san-pham/zigbee",
    ctaLabel: "Khám phá sản phẩm",
  },
  {
    key: "modbus",
    label: "Modbus",
    subtitle:
      "Giao thức truyền thông công nghiệp RTU/TCP phổ biến, kết nối PLC, biến tần và thiết bị đo lường vào hệ thống BMS/tự động hoá tòa nhà.",
    href: "/danh-muc-san-pham/modbus",
    ctaLabel: "Khám phá sản phẩm",
  },
  {
    key: "an-ninh",
    label: "An ninh",
    subtitle:
      "Giải pháp báo trộm, kiểm soát ra vào và giám sát tích hợp, bảo vệ toàn diện cho nhà ở và công trình, đồng bộ với hệ thống tự động hoá chung.",
    href: "/danh-muc-san-pham/an-ninh",
    ctaLabel: "Khám phá sản phẩm",
  },
  {
    key: "matter",
    label: "Matter",
    subtitle:
      "Chuẩn kết nối smarthome mới của CSA, đảm bảo khả năng tương thích đa nền tảng (Apple, Google, Amazon) cho thiết bị nhà thông minh dân dụng.",
    href: "/danh-muc-san-pham/matter-smarthome",
    ctaLabel: "Khám phá sản phẩm",
  },
  {
    key: "hvac",
    label: "HVAC",
    subtitle:
      "Thiết bị điều khiển máy lạnh VRV/VRF, cục bộ và điều hoà trung tâm, tích hợp trực tiếp vào hệ thống tự động hoá qua giao thức chuẩn.",
    href: "/danh-muc-san-pham/dieu-hoa-hvac",
    ctaLabel: "Khám phá sản phẩm",
  },
];

import type { CategoryGroupKey } from "@/components/nav/nav-data";
import type { StockStatus } from "@/components/product/product-card";

/**
 * Data PDP-grade — KHÔNG dùng chung type với `SearchProduct`/`HighlightProduct` (search-data.ts,
 * product-highlights-data.ts) vì 2 bộ field khác hẳn nhau về mục đích: search/card chỉ cần
 * tên-giá-ảnh để hiện nhanh, PDP cần specs/variant/mô tả đầy đủ. Khi có nguồn dữ liệu PDP cho
 * toàn bộ 745 sản phẩm thật (xem product-detail-page-plan.md, Phase B), cân nhắc hợp nhất lại.
 *
 * QUAN TRỌNG — không import runtime nào từ `@/components/nav/nav-data` ở file này ngoài `type`:
 * nav-data.ts import icon `@phosphor-icons/react` bản top-level (createContext), nên bất kỳ
 * Server Component nào import RUNTIME từ đó đều bị lỗi "createContext only works in Client
 * Components" khi build (xem ghi chú trong footer.tsx/shop-by-category.tsx). `page.tsx` (route
 * PDP) là Server Component — vì vậy `categoryLabel`/`categoryHref` dưới đây lưu sẵn dạng chuỗi
 * tĩnh thay vì tra cứu sống từ `productCategories` trong nav-data.ts.
 */

export type ProductVariant = {
  /** "Anthracite (RAL9005)" — hiện trong buybox + alt text SVG. */
  name: string;
  /** Mã SKU theo biến thể — "100480". */
  sku: string;
  /** Hex tô nền mặt phím trong SVG minh hoạ. */
  panelColor: string;
  /** Hex chữ số/icon trên mặt phím, chọn theo panelColor để đủ tương phản. */
  inkColor: string;
};

export type SpecChipIcon = "power" | "shield" | "nfc" | "bus";

export type SpecGroup = {
  title: string;
  rows: { label: string; value: string }[];
};

export type ProductFeatureIcon = "auth" | "lock" | "glass" | "encrypted";

export type ProductDetail = {
  slug: string;
  name: string;
  brand: string;
  categoryGroup: CategoryGroupKey;
  /** "An ninh · Kiểm soát ra vào" — chuỗi tĩnh, xem ghi chú đầu file vì sao không tra nav-data.ts. */
  categoryLabel: string;
  /** "An ninh" — bản ngắn, dùng cho heading "Sản phẩm liên quan · {categoryShortLabel}". */
  categoryShortLabel: string;
  categoryHref: string;
  tagline: string;
  /** VND. 0 = chưa niêm yết / liên hệ báo giá — đúng quy ước searchProducts (search-data.ts). */
  price: number;
  stock: StockStatus | null;
  variants: ProductVariant[];
  specChips: { icon: SpecChipIcon; label: string }[];
  /** Mỗi phần tử = 1 đoạn <p> trong tab "Mô tả chi tiết". */
  description: string[];
  useCases: string[];
  features: { icon: ProductFeatureIcon; title: string; description: string }[];
  specGroups: SpecGroup[];
  specSource: string;
  installSteps: { title: string; description: string }[];
  /** price bỏ trống = hiện "Xem báo giá" thay vì số tiền. */
  accessories: { name: string; price?: string }[];
  compatibilityNote: string;
  datasheetUrl?: string;
};

// Nội dung specs/copy lấy nguyên từ artifact đã duyệt (Claude Artifact "NFC Code Touch Tree",
// 2026-09-04), dựng từ datasheet chính hãng Loxone Electronics GmbH — bản LX001, 02.08.2024,
// mã 100480 (Anthracite)/100481 (White). Không diễn giải lại số liệu — sai lệch specs điện/cơ
// khí trên trang bán hàng là rủi ro thật cho khách kỹ sư SI/ME.
export const productDetails: ProductDetail[] = [
  {
    slug: "loxone-nfc-code-touch-tree-anthracite",
    name: "NFC Code Touch Tree",
    brand: "Loxone",
    categoryGroup: "an-ninh",
    categoryLabel: "An ninh · Kiểm soát ra vào",
    categoryShortLabel: "An ninh",
    categoryHref: "/danh-muc-san-pham/an-ninh",
    tagline:
      "Đầu đọc NFC 13.56MHz tích hợp bàn phím mã số cảm ứng điện dung trên mặt kính, đấu nối bus Loxone Tree — xác thực hai lớp cho cửa ra vào.",
    price: 0,
    stock: "backorder",
    variants: [
      { name: "Anthracite (RAL9005)", sku: "100480", panelColor: "#1c1c1e", inkColor: "#f2f2f0" },
      { name: "White (RAL9003)", sku: "100481", panelColor: "#f2f0ec", inkColor: "#2a2a2a" },
    ],
    specChips: [
      { icon: "power", label: "9–28VDC" },
      { icon: "shield", label: "IP44" },
      { icon: "nfc", label: "NFC 13.56MHz" },
      { icon: "bus", label: "Loxone Tree" },
    ],
    description: [
      "NFC Code Touch Tree là thiết bị kiểm soát ra vào thuộc hệ sinh thái Loxone, kết hợp đầu đọc NFC (13.56MHz) và bàn phím mã số cảm ứng điện dung trên mặt kính liền khối. Thiết bị xác thực hai lớp — quẹt thẻ/tag NFC kết hợp nhập mã số — hỗ trợ cả tag không mã hoá (ISO/IEC 14443, yêu cầu UID cố định) lẫn tag mã hoá chip MIFARE® DESFire®; khuyến nghị dùng tag mã hoá chính hãng Loxone cho điểm truy cập cần bảo mật cao.",
      'Đấu nối theo bus Loxone Tree, hoạt động khi ghép với Miniserver hoặc Tree Extension. Cấu hình logic truy cập (theo khung giờ, dùng một lần, prefix kích hoạt chức năng phụ...) thực hiện trong Loxone Config qua function block "Authentication NFC Code Touch". Có bit chẩn đoán Online Status (0/1) để đưa vào giám sát BMS.',
    ],
    useCases: [
      "Cửa chính nhà ở — thay ổ khoá cơ bằng mã số + tag NFC cho từng thành viên",
      "Căn hộ dịch vụ / phòng cho thuê ngắn hạn — cấp mã hoặc tag có giới hạn thời gian lưu trú",
      "Phòng kỹ thuật / phòng máy — giới hạn nhân sự ra vào qua danh sách tag đã học",
      "Cổng khu dân cư — khung nhôm đôi ghép cùng Loxone Intercom trên một mặt nạ",
    ],
    features: [
      {
        icon: "auth",
        title: "Xác thực hai lớp",
        description:
          "Kết hợp thẻ/tag NFC và mã số — có chế độ học thẻ NFC trực tiếp trên thiết bị, không cần phần mềm riêng.",
      },
      {
        icon: "lock",
        title: "Tự khoá chống dò mã",
        description: "Nhập sai mã hoặc quẹt tag không hợp lệ nhiều lần liên tiếp → thiết bị tự khoá 2 phút.",
      },
      {
        icon: "glass",
        title: "Mặt kính tự hiệu chỉnh",
        description:
          "Cảm ứng điện dung — nước đọng trên bề mặt không gây thao tác nhầm, tự calibrate lại sau khi khô.",
      },
      {
        icon: "encrypted",
        title: "Hỗ trợ NFC mã hoá",
        description:
          "Đọc tag không mã hoá ISO/IEC 14443 (UID cố định) hoặc tag mã hoá chip MIFARE® DESFire® bảo mật cao hơn.",
      },
    ],
    specGroups: [
      {
        title: "Điện",
        rows: [
          { label: "Điện áp cấp nguồn", value: "9 … 28 VDC" },
          { label: "Công suất tiêu thụ", value: "typ. 0.05W · max. 0.8W (khi đọc NFC)" },
          { label: "Tổn hao công suất", value: "max. 0.8W" },
        ],
      },
      {
        title: "Kết nối & bus",
        rows: [
          { label: "Giao diện", value: "Loxone Tree — đấu với Miniserver / Tree Extension" },
          { label: "Tiết diện dây", value: "0.25 … 0.8 mm² / AWG23–18" },
          { label: "Chiều dài tuốt vỏ", value: "5 mm" },
          { label: "Chịu nhiệt dây đấu nối", value: "-40 … 105°C" },
          { label: "Đấu dây", value: "Cam/Trắng → +24VDC/GND · Xanh lá/Trắng → Loxone Tree" },
        ],
      },
      {
        title: "Đầu đọc NFC/RFID",
        rows: [
          { label: "Tần số", value: "13.56 MHz" },
          { label: "Phương thức truy cập", value: "NFC, mã số (Key code)" },
          { label: "Tag không mã hoá", value: "ISO/IEC 14443, yêu cầu UID cố định" },
          { label: "Tag mã hoá", value: "Chip MIFARE® DESFire®" },
        ],
      },
      {
        title: "Cơ khí & trọng lượng",
        rows: [
          { label: "Kích thước (D×R×C)", value: "90 × 90 × 16 mm" },
          { label: "Khối lượng tịnh / tổng", value: "126 g / 160 g" },
          { label: "Kích thước đóng gói", value: "104 × 107 × 39 mm" },
          { label: "Hoàn thiện", value: "Matte (mờ)" },
          { label: "Màu", value: "Anthracite RAL9005 (100480) · White RAL9003 (100481)" },
        ],
      },
      {
        title: "Điều kiện hoạt động & chứng nhận",
        rows: [
          { label: "Nhiệt độ môi trường", value: "-20 … 70°C" },
          { label: "Độ ẩm", value: "max. 95% r.H. (không ngưng tụ)" },
          { label: "Độ cao lắp đặt khuyến nghị", value: "135 cm" },
          { label: "Cấp bảo vệ", value: "IP44" },
          { label: "Chứng nhận", value: "CE" },
        ],
      },
    ],
    specSource:
      "Nguồn: Datasheet chính hãng Loxone Electronics GmbH — NFC Code Touch Tree, bản LX001 (02.08.2024), mã SP 100480/100481.",
    installSteps: [
      { title: "Chiều cao lắp đặt", description: "Khuyến nghị 135cm từ sàn hoàn thiện đến tâm thiết bị." },
      {
        title: "Khung lắp",
        description:
          "Khung nhựa tiêu chuẩn (hộp âm tường 68mm khuyến nghị) hoặc khung nhôm đơn/đôi — khung đôi ghép được với Loxone Intercom trên cùng mặt nạ.",
      },
      {
        title: "Chống nước",
        description:
          "Có sẵn màng dán bảo vệ mặt kính trong hộp sản phẩm; dùng phụ kiện ống hút (suction cup) khi cần tháo thiết bị khỏi khung nhôm.",
      },
      {
        title: "Cấu hình",
        description:
          'Khai báo qua function block "Authentication NFC Code Touch" trong Loxone Config — thiết lập quyền theo lịch, dùng một lần, hoặc prefix kích hoạt chức năng phụ.',
      },
    ],
    accessories: [
      { name: "Bộ 10 NFC Key Fob" },
      { name: "Thẻ NFC không mã hoá (10 thẻ)" },
      { name: "Tag NFC mã hoá DESFire (10 tag)" },
      { name: "Đế đứng để bàn (Silver / Anthracite)", price: "Từ €34.75" },
      { name: "Màng bảo vệ nước cho mặt kính" },
      { name: "Khung nhôm đơn / đôi (ghép Intercom)" },
    ],
    compatibilityNote:
      "Cần Miniserver hoặc Tree Extension. Thiết bị dùng bus Loxone Tree riêng của hệ sinh thái Loxone — không đấu trực tiếp vào đường bus KNX TP hay DALI-2.",
    datasheetUrl: "/datasheets/loxone-nfc-code-touch-tree.pdf",
  },
];

export function getProductBySlug(slug: string): ProductDetail | undefined {
  return productDetails.find((p) => p.slug === slug);
}

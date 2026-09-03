export type BlogPost = {
  id: number;
  category: string;
  title: string;
  /** Định dạng DD/MM/YYYY, đã sort giảm dần theo ngày đăng (mới nhất trước). */
  date: string;
  href: string;
  isNew?: boolean;
};

// Chưa có nguồn bài viết thật (CMS blog KNXStore) — MOCK TĨNH để dựng UI mục "Bài viết gần đây"
// (trang chủ). Thay bằng dữ liệu thật khi có API/CMS, giữ nguyên thứ tự giảm dần theo ngày đăng.
export const blogPosts: BlogPost[] = [
  {
    id: 1,
    category: "Sản phẩm & Công nghệ",
    title: "Cấu hình DALI-2 cho hệ thống chiếu sáng văn phòng: Hướng dẫn từ A–Z",
    date: "28/08/2026",
    href: "/bai-viet/cau-hinh-dali-2-chieu-sang-van-phong",
    isNew: true,
  },
  {
    id: 2,
    category: "Kỹ thuật & Kiến thức",
    title: "5 lỗi thường gặp khi lắp đặt bus KNX TP và cách khắc phục",
    date: "20/08/2026",
    href: "/bai-viet/5-loi-thuong-gap-lap-dat-bus-knx-tp",
  },
  {
    id: 3,
    category: "Sản phẩm & Công nghệ",
    title: "Matter Smarthome là gì? So sánh với KNX cho nhà ở dân dụng",
    date: "12/08/2026",
    href: "/bai-viet/matter-smarthome-la-gi-so-sanh-knx",
  },
  {
    id: 4,
    category: "Giải pháp tích hợp",
    title: "Tích hợp Casambi vào hệ thống KNX: Giải pháp không dây cho chiếu sáng",
    date: "05/08/2026",
    href: "/bai-viet/tich-hop-casambi-vao-he-thong-knx",
  },
  {
    id: 5,
    category: "Kỹ thuật & Kiến thức",
    title: "BACnet vs Modbus: Chọn giao thức nào cho hệ thống BMS tòa nhà?",
    date: "28/07/2026",
    href: "/bai-viet/bacnet-vs-modbus-he-thong-bms",
  },
  {
    id: 6,
    category: "Kỹ thuật & Kiến thức",
    title: "Checklist bảo trì hệ thống KNX định kỳ cho System Integrator",
    date: "20/07/2026",
    href: "/bai-viet/checklist-bao-tri-he-thong-knx",
  },
];

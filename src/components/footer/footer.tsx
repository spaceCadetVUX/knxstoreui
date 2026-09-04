"use client"; // nav-data.ts import icon từ @phosphor-icons/react (createContext ở top-level) —
// bắt buộc phải là Client Component mới import được nav-data.ts (giống hero.tsx/navbar.tsx),
// nếu không Next 16 báo lỗi "createContext only works in Client Components" khi render RSC.

import Image from "next/image";
import Link from "next/link";
import { productCategories, solutions, topBrands } from "@/components/nav/nav-data";

/**
 * Footer — dựng theo mẫu tham khảo (ảnh "Nexiron"), tinh chỉnh copy sang thương hiệu KNXStore.
 * Bản đầu (2026-09-04) có 3 phần: dark CTA / white nav card / watermark chữ khổng lồ mờ dần,
 * dạng "card thả nổi" bo góc trên nền xám. Đã bỏ dần theo các phản hồi trực tiếp cùng ngày:
 * bỏ watermark, chuyển sang full-bleed (không bo góc/gutter), rồi bỏ LUÔN khối CTA nền tối
 * (sau vài lần chỉnh gradient vẫn không ổn) — giờ chỉ còn 1 phần: nav card trắng. ĐÂY VẪN LÀ
 * BẢN NHÁP — phần lớn href cột link + legal CHƯA có route thật (đánh dấu "#" bên dưới), cần
 * thay khi có trang tương ứng. 3 href có route thật (san-pham/giai-phap/thuong-hieu/blog/du-an/
 * matter) lấy thẳng từ nav-data.ts — 1 nguồn chân lý, không tự khai lại để tránh lệch với navbar.
 */

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };

const footerColumns: FooterColumn[] = [
  {
    title: "Sản phẩm",
    links: [
      { label: "Danh mục sản phẩm", href: productCategories.viewAllHref },
      { label: "Giải pháp", href: solutions.viewAllHref },
      { label: "Thương hiệu", href: topBrands.viewAllHref },
      { label: "Matter Smarthome", href: "/giai-phap/matter-smarthome" },
    ],
  },
  {
    // TODO: "Hướng dẫn kỹ thuật" / "Hỗ trợ" chưa có route — trỏ tạm "#".
    title: "Tài nguyên",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Dự án", href: "/du-an" },
      { label: "Hướng dẫn kỹ thuật", href: "#" },
      { label: "Hỗ trợ", href: "#" },
    ],
  },
  {
    // TODO: cả 4 mục chưa có route thật (chưa có trang giới thiệu/tuyển dụng/liên hệ/đối tác).
    title: "Công ty",
    links: [
      { label: "Về chúng tôi", href: "#" },
      { label: "Tuyển dụng", href: "#" },
      { label: "Liên hệ", href: "#" },
      { label: "Đối tác", href: "#" },
    ],
  },
];

// TODO: chưa có trang điều khoản/chính sách bảo mật thật — trỏ tạm "#".
const legalLinks: FooterLink[] = [
  { label: "Điều khoản dịch vụ", href: "#" },
  { label: "Chính sách bảo mật", href: "#" },
];

export function Footer() {
  return (
    <footer>
      {/* Nav footer trắng — full-bleed (không bo góc/gutter xám quanh). Logo/mô tả bên trái,
          3 cột link bên phải, chia đôi bằng border-t rồi copyright + legal link. */}
      <div className="border-t border-border bg-card px-4 py-10 sm:px-8 sm:py-12 lg:px-16">
        <div className="mx-auto max-w-[var(--container-max)]">
          <div className="flex flex-col gap-10 md:flex-row md:justify-between">
            <div className="max-w-xs">
              <Link
                href="/"
                className="inline-flex items-center"
                aria-label="KNXStore — Trang chủ"
              >
                <Image
                  src="/logo/knxstore-logo.svg"
                  alt="KNXStore"
                  width={384}
                  height={61}
                  className="h-6 w-auto"
                />
              </Link>
              {/* font-medium + text-foreground (thay mặc định + text-muted-foreground cũ) —
                  theo yêu cầu trực tiếp "làm đậm hơn". */}
              <p className="mt-4 text-sm font-medium leading-relaxed text-foreground">
                Phân phối và tư vấn giải pháp tự động hóa tòa nhà — KNX, DALI-2, DMX512,
                Casambi, BACnet, Modbus và Matter Smarthome.
              </p>

              {/* 2 badge uy tín — theo yêu cầu trực tiếp 2026-09-04. CẢ HAI đều CHƯA gắn link
                  xác thực thật (KNXStore chưa có tài khoản DMCA.com / chưa thông báo thật với
                  Bộ Công Thương ở online.gov.vn tại thời điểm thêm badge này) — href tạm trỏ về
                  trang chủ của từng bên (KHÔNG bịa link Status.aspx?ID=.../WebDetails/... giả).
                  TODO khi đăng ký xong:
                  - DMCA: đổi href sang đúng link "Protection Status" (dmca.com/Protection/
                    Status.aspx?ID=...) họ cấp sau khi tạo tài khoản.
                  - Bộ Công Thương: ảnh badge (logoSaleNoti.png) là ảnh DÙNG CHUNG cho mọi site đã
                    đăng ký (không riêng theo tài khoản) — nhưng LINK thì có, chỉ được cấp
                    (online.gov.vn/Home/WebDetails/<id-riêng>) sau khi hồ sơ được duyệt. Gắn ảnh
                    mà không link về đúng hồ sơ verify được nhiều nguồn hướng dẫn coi là dấu hiệu
                    vi phạm quy định thông báo website TMĐT — cần đăng ký thật rồi thay href.

                  Ảnh gốc bo-cong-thuong.png là canvas vuông 625×625 nhưng logo thật chỉ nằm
                  giữa (~599×197, phần còn lại trong suốt) — cùng chiều cao class (h-14 cũ) nên
                  logo hiện ra NHỎ HƠN hẳn DMCA (theo yêu cầu trực tiếp, đã đo bbox thật bằng
                  Pillow). Dùng bo-cong-thuong-cropped.png (đã cắt sát viền, chừa 10px đệm) +
                  cùng class h-9 với DMCA để 2 badge cao bằng nhau thật sự, không chỉ bằng nhau
                  trên khai báo. Giữ nguyên bo-cong-thuong.png gốc (không xoá) để có bản chưa
                  cắt nếu cần đối chiếu sau này. */}
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <a
                  href="https://www.dmca.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="DMCA.com"
                >
                  <Image
                    src="/badges/dmca-protected.png"
                    alt="DMCA.com"
                    width={601}
                    height={189}
                    className="h-9 w-auto"
                  />
                </a>
                <a
                  href="https://online.gov.vn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Đã thông báo Bộ Công Thương"
                >
                  <Image
                    src="/badges/bo-cong-thuong-cropped.png"
                    alt="Đã thông báo Bộ Công Thương"
                    width={599}
                    height={197}
                    className="h-9 w-auto"
                  />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-12">
              {footerColumns.map((col) => (
                <div key={col.title}>
                  <div className="text-sm font-semibold text-foreground">{col.title}</div>
                  <ul className="mt-4 space-y-3">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground transition-colors hover:text-accent"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              {/* Tên pháp nhân theo bối cảnh tổ chức — cập nhật nếu công ty đổi tên. */}
              © 2026 KNXStore — Công ty CP Tích hợp Hệ thống Liên Minh. Bảo lưu mọi quyền.
            </p>
            <div className="flex gap-5">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-accent hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

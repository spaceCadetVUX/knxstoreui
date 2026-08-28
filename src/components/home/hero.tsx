"use client"; // Reveal dùng useEffect/useState (mount-flag animation)

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/nav/reveal";

/**
 * Logo giao thức/chuẩn thật — tải từ nguồn chính chủ (KNXStore là đối tác/nhà phân phối
 * của cả 4, theo xác nhận 2026-08-28), KHÔNG lấy từ site scrape logo bên thứ 3:
 * - KNX: trích xuất trực tiếp từ SVG trong HTML header của knx.org
 * - Casambi: casambi.com/wp-content/themes/casambi/images/casambi-logo-dark.svg
 * - DALI-2: dali-alliance.org (DiiA) — DALI/DALI-2 là trademark của DiiA, chỉ dùng vì đã
 *   xác nhận là đối tác/thành viên
 * - Matter: csa-iot.org/logo-and-brand-assets-library (variant "night" — dù tên vậy nhưng
 *   đây mới là bản màu tối đúng để hiển thị trên nền sáng, đã so 2 bản trước khi chọn)
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
    src: "/protocols/matter.png",
    width: 5038,
    height: 1745,
    heightClass: "h-12 sm:h-14", // nét mảnh, vẫn nhẹ hơn 3 logo kia — nâng thêm 1 bậc nữa
  },
];

export function Hero() {
  return (
    <section className="mx-auto max-w-[var(--container-max)] px-4 pb-16 pt-16 text-center md:px-8 md:pb-24 md:pt-24 lg:px-16">
      <Reveal className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Nền tảng phân phối thiết bị tự động hóa tòa nhà
        </h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          700+ sản phẩm chính hãng · 68 thương hiệu · 79 danh mục
        </p>
      </Reveal>

      <Reveal delayMs={100} className="mt-12 sm:mt-16">
        <ul className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-8 sm:gap-x-14">
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
      </Reveal>
    </section>
  );
}

"use client"; // Reveal dùng useEffect/useState (mount-flag animation)

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { Reveal } from "@/components/nav/reveal";

/**
 * Logo giao thức/chuẩn thật — tải từ nguồn chính chủ (KNXStore là đối tác/nhà phân phối
 * của cả 4, theo xác nhận 2026-08-28), KHÔNG lấy từ site scrape logo bên thứ 3:
 * - KNX: trích xuất trực tiếp từ SVG trong HTML header của knx.org
 * - Casambi: casambi.com/wp-content/themes/casambi/images/casambi-logo-dark.svg
 * - DALI-2: dali-alliance.org (DiiA) — DALI/DALI-2 là trademark của DiiA, chỉ dùng vì đã
 *   xác nhận là đối tác/thành viên. ĐÃ KIỂM TRA trang Downloads chính thức: DiiA KHÔNG
 *   công khai bản vector (SVG/EPS/AI) nào — chỉ có PNG. Giữ PNG, không tự vector hoá lại.
 * - Matter: bản .svg (không phải .png) — file gốc trong brand-assets-library của csa-iot.org
 *   chỉ là bitmap PNG nhúng trong khung SVG (không phải vector thật, đã kiểm tra: chỉ có
 *   1 thẻ <image>, 0 <path>). Vector thật lấy qua Wikimedia Commons (tác giả gốc: CSA,
 *   nguồn buildwithmatter.com, public domain hình dạng + có nhãn trademark) — đã verify
 *   chỉ có <path>, không nhúng ảnh raster.
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
    src: "/protocols/matter.svg",
    width: 339,
    height: 73,
    // Bản SVG crop sát viền hơn bản PNG cũ nên ở baseline (h-9/h-11) đã nhìn TO hơn hẳn
    // 3 logo kia — hạ thêm 1 bậc nữa.
    heightClass: "h-7 sm:h-8",
  },
];

export function Hero() {
  return (
    // relative + overflow-hidden để làm nền cho ảnh absolute bên dưới. bg-card vẫn giữ làm màu
    // nền dự phòng (trước khi ảnh load xong, và cho dải rất sát mép trên nơi gradient còn gần
    // như 100% đặc). h-screen thay cho pb lớn: section cao đúng 1 viewport, ảnh nền lấp đầy
    // toàn bộ chiều cao đó (object-cover) thay vì kéo dài theo padding-bottom như bản trước.
    <section className="relative flex h-[90vh] min-h-[90vh] flex-col justify-center overflow-hidden bg-card pt-16 text-center md:pt-24">
      {/* Nền ảnh full-bleed + overlay gradient trắng→trong suốt theo chiều dọc (top→bottom):
          đặc (from-card, ~100%) ở dải trần nhà sát navbar, hạ dần (via-card/60, dừng ở 58%
          chiều cao — kéo dài hơn bản gốc (45%) để hàng CTA không rơi đúng điểm ảnh bắt đầu lộ
          chi tiết, tránh chữ/nút "chồng" lên vùng ảnh có tương phản cao) qua vùng text để chữ
          tối vẫn đọc rõ mà kiến trúc phía sau vẫn lờ mờ thấy được, rồi trong suốt hoàn toàn
          (to-transparent, đạt mốc ở 82%) để dải sàn gỗ/logo phía dưới hiện sắc nét, không bị
          phủ trắng. Khác vignette toả từ MÉP (trái/phải/góc) — đây là gradient 1 CHIỀU dọc duy
          nhất nên không làm ảnh "đục" quanh viền như bản trước đó. z-0 mặc định (positioned,
          DOM đứng trước content nên bị content vẽ đè lên, không cần z-index thủ công). */}
      <div aria-hidden="true" className="absolute inset-0">
        <Image
          src="/hero/office-showcase.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-card from-0% via-card/60 via-58% to-transparent to-82%" />
      </div>

      <div className="relative mx-auto max-w-[var(--container-max)] px-4 md:px-8 lg:px-16">
        <Reveal className="mx-auto max-w-3xl">
          <h1 className="font-onest text-4xl font-light leading-normal tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Nền tảng phân phối thiết bị tự động hóa tòa nhà
          </h1>
          <p className="mt-4 text-base font-medium text-foreground/60 sm:text-lg">
            700+ sản phẩm chính hãng · 68 thương hiệu · 79 danh mục
          </p>

          {/* CTA chính bg-accent (brand blue, không còn bg-foreground đen tuyền — đen đặc cạnh
              ảnh sáng/thoáng tạo cảm giác quá nặng, xem trao đổi màu sắc hero) + CTA phụ dạng
              text-link (không còn border pill) kèm icon mũi tên, đồng ngôn ngữ với nút
              "Matter Smarthome" trên header — để điều hướng ngay khi vào trang thay vì chỉ có
              logo giao thức bên dưới. text-on-accent (#ffffff token) thay vì hardcode "white" để
              chữ trên nút vẫn theo token màu chung. */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Link
              href="/giai-phap"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-on-accent shadow-md transition-[filter,box-shadow,transform] duration-150 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:brightness-110 active:translate-y-0 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              Khám phá giải pháp
            </Link>
            <Link
              href="/lien-he"
              className="group inline-flex items-center gap-1.5 rounded-md px-2 py-3 text-sm font-semibold text-muted-foreground transition-colors duration-150 ease-out hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Liên hệ tư vấn
              <ArrowUpRight
                size={16}
                weight="bold"
                aria-hidden="true"
                className="transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </Reveal>

        {/* Dải frosted-glass sau hàng logo: tách cụm logo khỏi ảnh nền bằng 1 lớp kính mờ
            (backdrop-blur) thay vì để logo nổi trực tiếp trên ảnh kiến trúc — vân gỗ sàn phía
            sau vẫn "lộ" qua nhưng đã bị blur, không cạnh tranh thị giác với logo. Cùng pattern
            backdrop-blur đã dùng ở navbar.tsx (header), không phải kỹ thuật mới trong codebase.
            Không còn mask-image gradient tan dần ở mép dưới (bỏ theo yêu cầu trực tiếp) — tấm
            kính giờ đặc đều bg-card/78 toàn bộ khối, không tan mờ ở đáy nữa. */}
        <Reveal delayMs={100} className="relative mt-12 sm:mt-16">
          <div
            aria-hidden="true"
            className="absolute -inset-x-6 -inset-y-4 rounded-3xl bg-card/78 backdrop-blur-lg sm:-inset-x-10"
          />
          <ul className="relative mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-8 py-2 sm:gap-x-14">
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
      </div>
    </section>
  );
}

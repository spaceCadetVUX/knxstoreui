"use client"; // nav-data.ts import trực tiếp @phosphor-icons/react (dùng Context nội bộ) —
// không tương thích Server Component (react-server condition thiếu createContext).

import Link from "next/link";
import { productCategories, categoryIcon } from "@/components/nav/nav-data";
import { Reveal } from "@/components/nav/reveal";

/**
 * Hero trang chủ — theo mẫu tham khảo SmartThings: headline lớn + hàng icon+label
 * (không phải card/button), không ép chọn persona B2B/B2C ngay từ đầu (đã bỏ 2 nút
 * "chọn persona" đề xuất trước đó — nav đã có "Matter Smarthome" lo phần đó rồi).
 *
 * Icon-row dùng lại đúng 6 category + icon từ nav-data.ts (không tạo data riêng),
 * mỗi icon click được thẳng vào category — khác SmartThings (icon của họ chỉ mô tả
 * tính năng, không phải link) vì đây là danh mục điều hướng thật, không phải trang trí.
 */
export function Hero() {
  return (
    <section className="mx-auto max-w-[var(--container-max)] px-4 pb-16 pt-16 text-center md:px-8 md:pb-24 md:pt-24 lg:px-16">
      <Reveal className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Nền tảng phân phối thiết bị tự động hóa tòa nhà
        </h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          745+ sản phẩm chính hãng · 68 thương hiệu · 79 danh mục
        </p>
      </Reveal>

      <Reveal delayMs={100} className="mt-12 sm:mt-16">
        <ul className="mx-auto flex max-w-4xl flex-wrap items-start justify-center gap-x-8 gap-y-8 sm:gap-x-10">
          {productCategories.items.map((item) => {
            const Icon = item.key ? categoryIcon[item.key] : null;
            return (
              <li key={item.href} className="w-20 sm:w-24">
                <Link
                  href={item.href}
                  className="group flex flex-col items-center gap-2.5 rounded-lg transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent motion-reduce:hover:translate-y-0"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-accent transition-colors duration-150 group-hover:bg-accent group-hover:text-on-accent sm:h-16 sm:w-16">
                    {Icon && <Icon size={26} aria-hidden="true" />}
                  </span>
                  <span className="text-xs font-medium leading-tight text-foreground/90 transition-colors duration-150 group-hover:text-accent sm:text-sm">
                    {item.label.split(" (")[0]}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
// /ssr subpath (không phải bản top-level dùng createContext) để giữ Server Component, giống
// lý do đã ghi ở shop-by-category.tsx — component này không cần state nên không cần "use client".
import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import { brandLogos } from "./brand-logos-data";

// Không import `topBrands` từ nav-data.ts: file đó import icon từ @phosphor-icons/react bản
// top-level (createContext), sẽ kéo lỗi giống navbar.tsx/shop-by-category.tsx đã fix trước đó.
// Trùng label/href với topBrands (nav-data.ts) — đổi thì sửa cả 2 nơi.
const BRAND_TITLE = "Thương hiệu";
const BRAND_VIEW_ALL_HREF = "/thuong-hieu";
const BRAND_VIEW_ALL_LABEL = "Xem tất cả 68 thương hiệu";

/**
 * Marquee logo thương hiệu, chạy ngang vô hạn bằng CSS (@keyframes brand-marquee ở globals.css)
 * — không cần "use client"/JS. Track nhân đôi danh sách 23 brand (bản 2 đánh aria-hidden để
 * screen reader không đọc trùng) rồi trượt đúng -50% để nối liền vòng lặp, dừng khi hover/focus
 * và khi prefers-reduced-motion (motion-reduce:animate-none, theo đúng convention đã dùng khắp
 * navbar.tsx/hero.tsx).
 */
export function BrandMarquee() {
  return (
    <section className="bg-card py-16 md:py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-4 md:px-8 lg:px-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {BRAND_TITLE}
          </h2>
          <Link
            href={BRAND_VIEW_ALL_HREF}
            className="group inline-flex shrink-0 items-center gap-1 rounded-sm text-sm font-medium text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {BRAND_VIEW_ALL_LABEL}
            <ArrowUpRight
              size={14}
              weight="bold"
              aria-hidden="true"
              className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>

      {/* Track full-bleed (thoát max-width của container cha) cho cảm giác cuộn vô tận thật sự.
          mask-image làm mờ dần 2 mép để logo không "cắt cụt" đột ngột. Logo giữ nguyên màu gốc
          (không grayscale) — đúng như bản gốc trên site. */}
      <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        {/* Track KHÔNG gap ở đây — gap giữa 2 bản copy nằm trong chính mỗi bản (pr-12 bên dưới)
            để 2 bản có bề rộng (nội dung + khoảng trống theo sau) bằng hệt nhau. Nếu gap nằm ở
            đây (ngoài) thì tổng bề rộng = 2*C + 1*gap, và translateX(-50%) chỉ dịch đúng
            C + gap/2 thay vì C + gap — lệch nửa khoảng gap mỗi vòng, gây giật nhẹ tại điểm nối
            dù track có "nhân đôi + trượt 50%" đúng công thức. */}
        <div className="flex w-max animate-[brand-marquee_55s_linear_infinite] items-center hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
              className="flex shrink-0 items-center gap-12 pr-12"
            >
              {brandLogos.map((brand) => (
                <Image
                  key={brand.slug}
                  src={brand.src}
                  alt={copy === 0 ? brand.label : ""}
                  width={brand.width}
                  height={brand.height}
                  className="h-9 w-auto shrink-0 object-contain sm:h-11"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

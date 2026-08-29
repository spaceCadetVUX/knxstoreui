import Link from "next/link";
// Icon lấy từ subpath /ssr (SSRBase, không dùng React context) — Server Component được,
// không cần "use client" như bản icon top-level @phosphor-icons/react (dùng createContext,
// xem lỗi runtime đã fix trước đó ở navbar.tsx/search-box.tsx).
import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import { shopCategories } from "./shop-categories-data";

// Không import `productCategories` từ nav-data.ts ở đây: file đó import icon từ
// @phosphor-icons/react bản top-level (dùng createContext) nên sẽ kéo lỗi "createContext only
// works in Client Components" y hệt lỗi đã fix trước — dù bản thân component này chỉ cần 3
// chuỗi. Trùng label/href với productCategories (nav-data.ts) — đổi thì sửa cả 2 nơi.
const CATEGORY_TITLE = "Danh mục sản phẩm";
const CATEGORY_VIEW_ALL_HREF = "/danh-muc-san-pham";
const CATEGORY_VIEW_ALL_LABEL = "Xem tất cả danh mục";

/**
 * "Shop by Category" — 17 category thật (xem shop-categories-data.ts để biết cách chọn).
 * Grid tĩnh (dựng bằng flex-wrap, xem comment ở <ul>), tối đa 7 cột/dòng ở desktop rộng
 * (17 item → 7 + 7 + 3) — không cuộn ngang. Mobile 3 cột, tablet 4–5 cột để thẻ không to.
 *
 * Ô ảnh: catalog thật CHƯA có ảnh category/sản phẩm — để trống nền xám nhạt (bg-muted),
 * không dùng icon giả lập để tránh nhìn như ảnh thật. Thay bằng ảnh khi có photography.
 */
export function ShopByCategory() {
  return (
    <section className="mx-auto max-w-[var(--container-max)] px-4 py-16 md:px-8 md:py-24 lg:px-16">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {CATEGORY_TITLE}
        </h2>
        <Link
          href={CATEGORY_VIEW_ALL_HREF}
          className="group inline-flex shrink-0 items-center gap-1 rounded-sm text-sm font-medium text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {CATEGORY_VIEW_ALL_LABEL}
          <ArrowUpRight
            size={14}
            weight="bold"
            aria-hidden="true"
            className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>

      {/* flex-wrap + justify-center (thay vì grid) để hàng cuối lẻ (17 = 7+7+3) căn giữa thay
          vì dạt trái. Width mỗi item = calc((100% - tổng gap)/số cột) khớp từng breakpoint —
          full row vẫn khít y hệt grid, chỉ hàng thiếu mới được justify-center phân bổ.
          Mobile/tablet tăng số cột (3→4→5) thay vì giữ 2→3→4 — thẻ nhỏ lại, đỡ to trên màn hẹp;
          desktop giữ nguyên 6/7 cột như cũ. */}
      <ul className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4">
        {shopCategories.map((item) => (
          // h-full trên li + Link để mọi thẻ cao bằng nhau bất kể tên 1 hay 2 dòng — khối tên
          // dùng chiều cao cố định (đủ line-clamp-2 + căn giữa) thay vì padding co giãn theo
          // nội dung, để card đồng bộ trên toàn lưới, không chỉ trong cùng 1 hàng.
          <li
            key={item.href}
            className="h-full w-[calc((100%-1rem)/3)] sm:w-[calc((100%-2.25rem)/4)] md:w-[calc((100%-4rem)/5)] lg:w-[calc((100%-5rem)/6)] xl:w-[calc((100%-6rem)/7)]"
          >
            <Link
              href={item.href}
              className="group flex h-full flex-col overflow-hidden rounded-[var(--card-radius)] border border-border bg-card transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {/* Placeholder ảnh — nền phẳng, không icon/hoạ tiết, chờ ảnh thật */}
              <span aria-hidden="true" className="block aspect-square bg-muted" />
              <span className="flex h-12 items-center justify-center px-2 text-center sm:h-14 sm:px-3 md:h-16">
                <span className="line-clamp-2 text-xs font-medium leading-snug text-foreground sm:text-sm">
                  {item.label}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { blogPosts, type BlogPost } from "./blog-posts-data";

const SECTION_TITLE = "Bài viết gần đây";
const VIEW_ALL_HREF = "/bai-viet";
const VIEW_ALL_LABEL = "Xem tất cả bài viết";
const POSTS_PER_PAGE = 3;

/**
 * "Bài viết gần đây" — đặt ngay dưới Faq (page.tsx). Header dùng đúng convention
 * tiêu đề + "Xem tất cả ..." đã có ở product-highlights.tsx/shop-by-category.tsx (flex
 * items-end justify-between), nằm ngay trên hàng thẻ bài viết mới nhất theo yêu cầu trực tiếp.
 *
 * "use client" vì phân trang cần state — dữ liệu MOCK (blog-posts-data.ts, chưa có CMS thật)
 * nên phân trang chạy hoàn toàn phía client trên danh sách tĩnh.
 */
export function BlogPosts() {
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(blogPosts.length / POSTS_PER_PAGE);
  const visiblePosts = blogPosts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  return (
    <section className="bg-card py-16 md:py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-4 md:px-8 lg:px-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {SECTION_TITLE}
          </h2>
          <Link
            href={VIEW_ALL_HREF}
            className="group inline-flex shrink-0 items-center gap-1 rounded-sm text-sm font-medium text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {VIEW_ALL_LABEL}
            <ArrowUpRight
              size={14}
              weight="bold"
              aria-hidden="true"
              className="transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* flex-wrap + justify-center (không dùng CSS grid) — 3 thẻ/trang không chia đều cho 2
            cột ở mobile (base), grid-cols-2 sẽ để trống nửa hàng cuối rất lộ; flex-wrap cho thẻ
            lẻ tự căn giữa ở dòng riêng. Cùng kỹ thuật đã dùng ở shop-by-category.tsx.
            2 cột ngay từ mobile (theo yêu cầu trực tiếp — không còn 1 cột), lên 3 cột từ sm
            (≥640px) luôn thay vì tăng dần 2→3 qua tablet, tránh thẻ 2-cột bị kéo quá to/thưa
            ở khoảng 768–1023px trước khi đủ chỗ cho 3 cột. */}
        <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-6">
          {visiblePosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        {pageCount > 1 && (
          <nav aria-label="Phân trang bài viết" className="mt-10 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Trang trước"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent"
            >
              <CaretLeft size={16} weight="bold" aria-hidden="true" />
            </button>

            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                aria-current={n === page ? "page" : undefined}
                className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  n === page ? "bg-foreground text-card" : "border border-border text-foreground hover:bg-muted"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={page === pageCount}
              aria-label="Trang sau"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent"
            >
              <CaretRight size={16} weight="bold" aria-hidden="true" />
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={post.href}
      className="group flex w-[calc((100%-12px)/2)] flex-col overflow-hidden rounded-xl border border-border bg-card transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-[calc((100%-48px)/3)]"
    >
      {/* Ô ảnh: chưa có ảnh cover bài viết thật — placeholder phẳng bg-muted, cùng pattern đã
          dùng ở product-highlights.tsx/shop-by-category.tsx (không icon giả lập). */}
      <div className="relative flex aspect-[4/5] items-center justify-center bg-muted">
        {post.isNew && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-success px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-on-success">
            Mới
          </span>
        )}
        <span className="px-[15%] text-center text-xs leading-snug text-muted-foreground">
          Ảnh bài viết
          <br />
          đang cập nhật
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-3 py-3 sm:gap-2.5 sm:px-5 sm:py-4">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">
          {post.category}
        </div>
        <p className="-mt-1 line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-accent sm:-mt-1.5 sm:text-base">
          {post.title}
        </p>

        {/* Label/value XẾP DỌC ở card hẹp (mobile 2-cột) — "Ngày đăng" + ngày đủ dài dễ tràn
            dòng nếu để ngang trên card < ~220px; xếp ngang lại từ md khi card đã đủ rộng. */}
        <div className="mt-auto flex flex-col gap-0.5 pt-1.5 text-xs sm:text-[13px] md:flex-row md:items-center md:gap-3 md:pt-2">
          <span className="font-medium text-muted-foreground md:shrink-0 md:whitespace-nowrap">Ngày đăng</span>
          <span className="text-foreground">{post.date}</span>
        </div>
      </div>
    </Link>
  );
}

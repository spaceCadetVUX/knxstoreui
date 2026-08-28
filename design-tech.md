# Phân tích Frontend Tech Stack — knxstore.vn

**Nguồn kiểm tra:** http://103.166.183.176:3001/
**Ngày phân tích:** 2026-08-28

---

## Kết luận nhanh

Next.js (App Router) + React + Tailwind CSS, chạy SSR/ISR, self-hosted (không phải Vercel platform), backend dữ liệu qua headless CMS/API (không lộ trong markup).

---

## Bằng chứng chi tiết

| Hạng mục | Bằng chứng | Kết luận |
|---|---|---|
| Framework | `X-Powered-By: Next.js`; header `x-nextjs-cache: HIT`; `x-nextjs-prerender: 1`; `x-nextjs-stale-time: 300` | Next.js, đang chạy ISR (Incremental Static Regeneration) — cache HIT, `stale-while-revalidate=31532400` (~365 ngày) |
| Router mode | `Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch`; có `self.__next_f` (RSC streaming payload); **không** có `__NEXT_DATA__` | **App Router** (Next.js 13+), dùng React Server Components — không phải Pages Router cũ |
| UI library | React (RSC payload `self.__next_f`, chunk `react` xuất hiện trong bundle) | React 18+ (bắt buộc để chạy RSC) |
| CSS | 1 file CSS duy nhất `/_next/static/chunks/15bwpl_vbreq_.css` (81.7KB); class dạng `bg-gray-1`, `bg-blue-dark`, `bg-meta`, `flex-col-reverse`, `grid-cols-1` | Tailwind CSS với theme tuỳ biến — custom color tokens (`bg-gray-1..4`, `bg-blue-dark`, `bg-meta`) không thuộc Tailwind default palette → có `tailwind.config` riêng |
| Font | File `.woff2` dạng `<hash>-s.p.<hash>.woff2` trong `/_next/static/media/` | Dùng `next/font` để self-host font, không load qua Google Fonts CDN (tốt cho tốc độ + không phụ thuộc bên ngoài) |
| Ảnh | Toàn bộ `<img>` qua `/_next/image?url=...&w=3840&q=75` | Dùng Next.js Image Optimization (component `next/image`), tự resize/serve theo request |
| Static asset caching | `Cache-Control: public, max-age=31536000, immutable` cho JS/CSS chunk | Chuẩn build hash-based caching của Next.js |
| CMS/backend | Không có marker CMS lộ trong HTML (không phải WordPress/Shopify/Strapi) | Dữ liệu nhiều khả năng lấy qua API nội bộ ở build/request time — khớp với hệ headless CMS `cacylinen` đang tích hợp trong tổ chức |
| Server | Cổng 3001, không lộ header `Server`, không thấy dấu hiệu Vercel edge | Self-hosted Next.js server (`next start`, khả năng chạy qua pm2 hoặc sau reverse proxy strip header) |

## Loại trừ
Không thấy jQuery, Bootstrap, Vue, WordPress — codebase thuần Next.js/React/Tailwind, không mix framework khác.

## Việc chưa xác nhận (cần đối chiếu source code local)
- Version chính xác của Next.js (14 vs 15) và Tailwind (3 vs 4) — cần check `package.json`/`next.config.js` trong repo local thay vì suy luận qua HTTP fingerprint.
- CMS backend cụ thể (có phải `cacylinen` không) — cần xác nhận qua API call hoặc cấu hình project.

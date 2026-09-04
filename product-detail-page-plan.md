# Kế hoạch: Trang chi tiết sản phẩm (PDP) — KNXStore

**Ngày:** 2026-09-04
**Trạng thái:** **PHASE A ĐÃ CODE XONG** — route + component thật đã chạy (`tsc --noEmit`/`eslint`/`next build` sạch, `next build` prerender tĩnh đúng route mới). Xem artifact gốc đã publish: "NFC Code Touch Tree" (🔐), nội dung dựng theo datasheet chính hãng Loxone (100480/100481). Câu trả lời cho 3 câu hỏi ở mục 8 (đã chốt 2026-09-04): (1) SKU **có thật trong catalog** — không phải hàng minh hoạ; (2) A9 (title template) **đã làm**; (3) Phase B **không làm** — phạm vi hiện tại dừng ở mockup/demo trong code, chưa phải web thật.
**Phạm vi:** Route mới `src/app/san-pham/[slug]/page.tsx` + component mới trong `src/components/product/` + 1 điểm chạm vào `src/components/home/product-highlights.tsx` (tách `ProductHighlightCard` để dùng chung). Không đụng `navbar.tsx`, `mega-menu.tsx`, `footer.tsx`.

---

## 1. Bối cảnh

Site hiện chỉ có trang chủ (`src/app/page.tsx`) — **chưa có bất kỳ route động nào**. Đây sẽ là route động đầu tiên của dự án, nên kế hoạch này chốt luôn convention routing/data cho mọi trang sản phẩm sau này, không chỉ riêng SKU trong artifact.

Artifact đã duyệt dùng **NFC Code Touch Tree (Loxone)** làm nội dung demo vì đây là sản phẩm duy nhất tôi có datasheet định lượng đầy đủ để dựng specs thật thay vì bịa số. Cần lưu ý: Loxone hiện **không nằm trong 6 category-group / 68 brand thật** đã query qua MCP `KNXStore_Blog` (`nav-data.ts`) — tức đây là SKU minh hoạ để chứng minh template, chưa chắc là hàng sẽ lên kệ thật. Việc này không chặn code (component không quan tâm SKU đến từ đâu), nhưng **chặn việc coi trang này là đã "go-live"** — xem mục 8.

---

## 2. Quyết định kiến trúc đã chốt

1. **Route:** `src/app/san-pham/[slug]/page.tsx` — khớp đúng pattern URL thật đang dùng trong `search-data.ts` (`/san-pham/{brand}-{ten-san-pham}`) và `VIEW_ALL_HREF` trong `product-highlights.tsx`. Slug cho SKU demo: `loxone-nfc-code-touch-tree-anthracite`.
2. **2 màu (Anthracite/White) = 1 trang, đổi bằng state**, không tách URL riêng — cả 2 đều "liên hệ báo giá" nên không có lý do SEO/giá để tách route. Khớp đúng hành vi artifact.
3. **Next.js 16 — `params` là Promise**, dùng `PageProps<'/san-pham/[slug]'>` (helper có sẵn, cùng cách `layout.tsx` đang dùng `LayoutProps<"/">"`), **không** dùng kiểu `{ params: { slug: string } }` đồng bộ cũ (đã deprecated).
4. **`generateStaticParams`** trả về slug từ mảng data local — site chưa có backend, toàn bộ trang sẽ prerender tĩnh 100% tại build time, không cần Suspense/dynamic (dự án không bật `cacheComponents`/`dynamicIO` trong `next.config.ts`, đã kiểm tra).
5. **Không cần `not-found.tsx` riêng** cho Phase A — slug sai thì gọi `notFound()` và dùng trang 404 mặc định của Next. Làm trang 404 riêng thương hiệu là việc khác, không nằm trong scope PDP.
6. **Bỏ toàn bộ phần "khung site giả" của artifact** (header/breadcrumb-bar/footer tối giản dựng riêng để preview) — trang thật đã có `Navbar`/`Footer` bọc sẵn ở `layout.tsx` (`<Navbar/>{children}<Footer/>`), `page.tsx` chỉ cần render breadcrumb + nội dung PDP.
7. **Bỏ toàn bộ logic dark-theme của artifact** (đó là yêu cầu bắt buộc riêng cho Artifact platform) — site KHÔNG có dark-mode toggle, chỉ dùng `--color-*-dark` cho section cố ý tối (Hero). Trang PDP này không có section tối nào.
8. **Style bằng Tailwind utility + token thật**, không CSS tự viết như artifact: `bg-card`, `text-foreground`, `bg-accent`/`text-on-accent`, `bg-muted`, `text-muted-foreground`, `border-border`, `bg-success`/`bg-pending` cho chấm tồn kho. Radius theo đúng lệ đang có: `rounded-xl` (12px, card sản phẩm/gallery) và `rounded-[10px]` (nút/stepper) — **không** dùng `--card-radius` (20px) cho card sản phẩm, đúng lý do đã ghi chú sẵn trong `product-highlights.tsx`.
9. **Icon:** chuyển toàn bộ icon UI (search/cart/user/download/check/info…) từ SVG tay trong artifact sang `@phosphor-icons/react` thật. 3 hình minh hoạ kỹ thuật (mặt phím / kích thước / sơ đồ đấu nối) **giữ inline SVG tay** vì là bản vẽ kỹ thuật riêng, không có sẵn trong bộ icon.
   - File "use client" (`product-hero.tsx`, `product-tabs.tsx`, `product-card.tsx`) → import phosphor top-level (an toàn, đã dùng ở `product-highlights.tsx`).
   - File server component (`product-features.tsx`, `product-accessories.tsx`, `related-products.tsx`) → **bắt buộc** import qua subpath `@phosphor-icons/react/ssr`, đúng convention đã ghi chú trong codebase (tránh lỗi `createContext` trong RSC).
10. **Tái dùng SKU/giá/tồn kho thật đang có** cho phần "Sản phẩm liên quan": Satel PRF-LCD (`id 472`, có `stock: "in-stock"` thật trong `STOCK_BY_ID`) và Satel AXD-200 (`id 469`, không có trong `STOCK_BY_ID` → **không hiện chấm tồn kho**, không tự đoán) — lấy thẳng từ `searchProducts`, không chép tay lại tên/giá.

### Refactor nhỏ bắt buộc: tách `ProductCard` dùng chung

`product-highlights.tsx` hiện định nghĩa `ProductHighlightCard` (giá/VAT, chấm tồn kho, stepper số lượng, nút giỏ hàng/liên hệ tư vấn) **inline, không export** — PDP cần y hệt logic này cho "Sản phẩm liên quan". Thay vì chép lại ~150 dòng, tách ra `src/components/product/product-card.tsx` (đổi tên `ProductCard`, giữ nguyên 100% logic/markup), `product-highlights.tsx` import lại từ đó. Không đổi hành vi trang chủ — verify bằng `tsc --noEmit` + xem lại trang chủ không đổi giao diện.

---

## 3. Data — kiểu dữ liệu mới

`SearchProduct` (search-data.ts) quá gọn cho PDP (không có specs/variant/mô tả). Thêm type riêng, KHÔNG sửa `SearchProduct`:

```ts
// src/components/product/product-data.ts
export type ProductVariant = {
  name: string;        // "Anthracite (RAL9005)"
  sku: string;          // "100480"
  panelColor: string;   // hex minh hoạ SVG mặt phím
  inkColor: string;
};

export type SpecGroup = {
  title: string;
  rows: { label: string; value: string }[];
};

export type ProductDetail = {
  slug: string;
  name: string;
  brand: string;
  categoryGroup: CategoryGroupKey; // dùng chung nav-data.ts
  categoryLabel: string;           // "An ninh · Kiểm soát ra vào"
  tagline: string;
  price: number;                   // 0 = liên hệ báo giá — đúng quy ước searchProducts
  stock: StockStatus | null;       // dùng chung type từ product-highlights-data.ts
  variants: ProductVariant[];
  specChips: { label: string }[];  // icon chọn cứng trong component theo index, không cần lưu trong data
  description: string[];           // mỗi phần tử = 1 đoạn <p>
  useCases: string[];
  features: { title: string; description: string }[];
  specGroups: SpecGroup[];
  specSource: string;              // câu trích nguồn datasheet
  installSteps: { title: string; description: string }[];
  accessories: { name: string; price?: string }[]; // price bỏ trống = "Xem báo giá"
  compatibilityNote: string;
  datasheetUrl?: string;
};

export const productDetails: ProductDetail[] = [ /* 1 phần tử NFC Code Touch Tree */ ];

export function getProductBySlug(slug: string): ProductDetail | undefined {
  return productDetails.find((p) => p.slug === slug);
}
```

Toàn bộ nội dung của SKU demo (specs, tagline, variants, feature copy...) **copy nguyên từ artifact đã duyệt** — không viết lại/diễn giải khác đi, tránh lệch 2 nguồn.

---

## 4. Route skeleton

```tsx
// src/app/san-pham/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, productDetails } from "@/components/product/product-data";
import { ProductHero } from "@/components/product/product-hero";
import { ProductFeatures } from "@/components/product/product-features";
import { ProductTabs } from "@/components/product/product-tabs";
import { ProductAccessories } from "@/components/product/product-accessories";
import { RelatedProducts } from "@/components/product/related-products";

export async function generateStaticParams() {
  return productDetails.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: PageProps<"/san-pham/[slug]">
): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return { title: product.name, description: product.tagline };
}

export default async function ProductDetailPage({ params }: PageProps<"/san-pham/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      {/* breadcrumb inline — 3 mục tĩnh, chưa cần tách component riêng */}
      <ProductHero product={product} />
      <ProductFeatures features={product.features} />
      <ProductTabs product={product} />
      <ProductAccessories accessories={product.accessories} />
      <RelatedProducts categoryGroup={product.categoryGroup} excludeSlug={product.slug} />
    </>
  );
}
```

`generateMetadata`/`page` cùng dùng `PageProps<'/san-pham/[slug]'>` — kiểu do Next tự sinh (typed routes), không tự tay viết `{ slug: string }` để tránh lệch nếu convention route đổi.

---

## 5. Kế hoạch theo Phase

### Phase A — Component + route chạy đúng 100% artifact, data = SKU demo

| # | Việc | File |
|---|---|---|
| A1 | Tách `ProductCard` khỏi `product-highlights.tsx` | `src/components/product/product-card.tsx` (mới), sửa `product-highlights.tsx` |
| A2 | Tạo type + data SKU demo (copy nội dung từ artifact) | `src/components/product/product-data.ts` (mới) |
| A3 | Gallery + buybox: state `activeVariant`/`activeView` dùng chung 1 file (giống cách `product-highlights.tsx` gộp carousel+card) — 3 SVG minh hoạ (mặt phím/kích thước/sơ đồ đấu nối) port từ artifact, đổi màu variant qua state React thay vì `querySelector` | `src/components/product/product-hero.tsx` (mới, `"use client"`) |
| A4 | Feature strip 4 thẻ tĩnh | `src/components/product/product-features.tsx` (mới, server) |
| A5 | Tabs (Mô tả / Thông số / Lắp đặt) + bảng specs theo nhóm + sơ đồ đấu nối SVG thứ 2 | `src/components/product/product-tabs.tsx` (mới, `"use client"`) |
| A6 | Shelf phụ kiện tĩnh | `src/components/product/product-accessories.tsx` (mới, server) |
| A7 | Sản phẩm liên quan — lọc `searchProducts` theo `categoryGroup`, loại trừ chính nó, render bằng `ProductCard` | `src/components/product/related-products.tsx` (mới, server) |
| A8 | Route + `generateStaticParams`/`generateMetadata`/`notFound` | `src/app/san-pham/[slug]/page.tsx` (mới) |
| A9 | (nhỏ, tuỳ chọn) Thêm `title: { template: "%s | KNXStore", default: ... }` vào metadata gốc để mọi trang con có `<title>` nhất quán — hiện `layout.tsx` đang set title tuyệt đối, chưa có template | `src/app/layout.tsx` |
| A10 | Sửa a11y tabs còn thiếu trong artifact: gắn `id`/`aria-controls`/`aria-labelledby` giữa tab và panel (artifact chỉ có `role`/`aria-selected`/`hidden`, chưa nối đủ) | `product-tabs.tsx` |
| A11 | `tsc --noEmit` + chạy `next dev`, kiểm tra thủ công tại `/san-pham/loxone-nfc-code-touch-tree-anthracite` | — |

### Phase B — Dữ liệu thật, sau khi chốt mục 8

| # | Việc |
|---|---|
| B1 | Xác nhận Loxone có thật sự lên catalog không; nếu không, thay SKU demo bằng 1 sản phẩm thật đã có trong `searchProducts` để trang không "go-live" với nội dung minh hoạ |
| B2 | Chốt nơi lưu data PDP-grade cho toàn bộ 745 sản phẩm (mở rộng schema MCP `KNXStore_Blog`? Supabase `lienminh-inventory`? tiếp tục file `.ts` local?) — vượt phạm vi 1 SKU demo |
| B3 | Thay 3 SVG minh hoạ bằng ảnh chụp thật khi có hàng mẫu (giữ SVG làm fallback cho SKU chưa có ảnh, theo đúng tinh thần "Ảnh sản phẩm đang cập nhật" đang dùng ở `product-highlights.tsx`) |

---

## 6. Hành vi tương tác (tham chiếu nhanh — chi tiết xem artifact)

| Hành động | Kết quả |
|---|---|
| Click swatch màu | Đổi `activeVariant` → đổi màu SVG mặt phím, tên biến thể, SKU hiển thị |
| Click thumbnail (Mặt trước/Kích thước/Sơ đồ đấu nối) | Đổi `activeView`, ẩn/hiện đúng 1 trong 3 SVG |
| Click tab (Mô tả/Thông số/Lắp đặt) | Đổi panel hiển thị, giữ `aria-selected`/`aria-controls` đúng chuẩn |
| `price === 0` | Ẩn stepper/giỏ hàng, hiện nút "Liên hệ tư vấn" — dùng chung điều kiện `hasPrice` như `ProductCard` |

---

## 7. QA checklist trước khi coi Phase A xong

- [ ] `tsc --noEmit` sạch
- [ ] Trang chủ (`/`) không đổi giao diện/hành vi sau khi tách `ProductCard`
- [ ] Build tĩnh: `next build` prerender được `/san-pham/loxone-nfc-code-touch-tree-anthracite` (không rơi vào dynamic runtime ngoài ý muốn)
- [ ] Slug sai → `notFound()` trả 404, không crash
- [ ] Bàn phím: Tab qua swatch/thumbnail/tab-button, `Enter`/`Space` kích hoạt, focus ring hiện rõ (`focus-visible:ring-2 focus-visible:ring-accent`)
- [ ] Responsive 375/768/1024/1440 — không tràn ngang, gallery/hero collapse đúng
- [ ] `prefers-reduced-motion` tôn trọng (hover card, transition tab)
- [ ] Không hex hardcode ngoài `globals.css` — toàn bộ qua token/Tailwind class
- [ ] Server component đúng import `@phosphor-icons/react/ssr`, client component import top-level — build không lỗi `createContext`

---

## 8. Câu hỏi cần chốt trước khi bắt đầu Phase A

1. **SKU demo Loxone**: có đồng ý code Phase A vẫn dùng nguyên nội dung NFC Code Touch Tree (đúng như artifact đã duyệt) để chứng minh template chạy được full-stack (route → data → component), hiểu rằng đây có thể chỉ là hàng minh hoạ chứ chưa chắc lên kệ thật — hay muốn đổi ngay sang 1 SKU đang có thật trong `searchProducts` để khỏi phải thay lại sau?
2. **A9 (title template ở `layout.tsx`)**: có làm luôn trong Phase A không, hay để riêng vì đụng file gốc ngoài phạm vi PDP?
3. **Phase B** — làm ngay sau khi Phase A chạy thật trên `next dev`, hay để riêng 1 lượt khác sau khi bạn duyệt UI/UX thật (không phải artifact) chạy trên site?

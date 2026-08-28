# Design System Master File — KNXStore

> **LOGIC:** Khi build 1 trang cụ thể, kiểm tra `design-system/knxstore/pages/[page-name].md` trước.
> Nếu file đó tồn tại, quy tắc trong đó **override** Master file này.
> Nếu không, dùng nguyên quy tắc bên dưới.

---

**Project:** KNXStore.vn — Web store mới
**Generated:** 2026-08-28 (thủ công, tổng hợp qua hội thoại tư vấn — không phải auto-match 100% từ database)
**Category:** Hybrid B2B (System Integrator / ME Contractor) + B2C (Matter Smarthome)
**Nguồn:** `ui-ux-pro-max` skill (search.py --design-system, --domain color/style/typography/product/landing) + quyết định thương hiệu do người dùng chốt trực tiếp

---

## Global Rules

### ⚠️ Nguyên tắc bắt buộc — Màu phải khai báo dạng biến (token), không hardcode hex

**Mọi màu trong code phải đi qua token, không viết thẳng mã hex trong component.** Đây là rule bắt buộc, không phải khuyến nghị — để tái sử dụng nhất quán và đổi màu 1 chỗ là toàn site cập nhật.

- Khai báo tất cả hex ở **một nguồn duy nhất**: Tailwind v4 dùng `@theme` trong `globals.css` (không phải `tailwind.config.js` — project này đã lên Tailwind 4, xem `design-tech.md`/quyết định trước đó).
- Component chỉ được reference token (`bg-background`, `text-foreground`, `var(--color-accent)`...), **không** viết `#0F467C`, `#1D1D1F`... trực tiếp trong JSX/CSS của component.
- Áp dụng cho toàn bộ bảng màu bên dưới (light + dark section) — mỗi hex trong bảng = 1 CSS variable tương ứng, đây chính là danh sách token cần khai báo trong `@theme`.
- Dark-section variant (mục kế tiếp) không phải "dark mode toggle" — vẫn là token riêng (`--color-background-dark`...) dùng có chọn lọc theo section, không phải semantic light/dark pair đổi theo `prefers-color-scheme`. Nếu sau này làm dark mode toggle thật, cần tách rule riêng (`color-dark-mode`: desaturate, không invert).

### Color Palette — Light (mặc định toàn site)

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background | `#F5F5F7` | `--color-background` |
| Foreground | `#1D1D1F` | `--color-foreground` |
| Card | `#FFFFFF` | `--color-card` |
| Card Foreground | `#1D1D1F` | `--color-card-foreground` |
| Primary/Accent (CTA) | `#0F467C` | `--color-accent` |
| On Accent | `#FFFFFF` | `--color-on-accent` |
| Muted | `#E8ECF1` | `--color-muted` |
| Muted Foreground | `#475569` | `--color-muted-foreground` |
| Border | `#E2E8F0` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| On Destructive | `#FFFFFF` | `--color-on-destructive` |
| Ring (focus) | `#0F467C` | `--color-ring` |

**Color Notes:** Apple-light base. Nền `#F5F5F7`/chữ `#1D1D1F` — đúng token Apple dùng thật, không phải `#F5F5F5`/`#000` generic.

**⚠️ ĐÃ CẬP NHẬT (2026-08-28):** Accent đổi từ `#0071E3` (Apple Signal Blue — placeholder lúc chưa có logo) sang **`#0F467C`** — đúng màu logo thật, lý do và số liệu contrast xem mục **Brand Assets — Logo** bên dưới. Đây không phải thẩm mỹ đơn thuần: `#0071E3` gây FAIL contrast (2.04:1) khi logo navy đặt trên nền accent cũ.

### Color Palette — Dark Section (chỉ dùng cục bộ: Hero, trang Matter Smarthome, không phải toàn site)

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background | `#0F172A` | `--color-background-dark` |
| Foreground | `#F8FAFC` | `--color-foreground-dark` |
| Card | `#1B2336` | `--color-card-dark` |
| Muted Foreground | `#94A3B8` | `--color-muted-foreground-dark` |
| Border | `#334155` | `--color-border-dark` |
| Accent (không đổi) | `#0F467C` | `--color-accent` |

---

## Brand Assets — Logo

**2 file chính thức, cùng 1 vector shape (đã verify pixel-level: cùng 2.283.956 pixel opaque, cùng mask hình, chỉ khác màu fill), 6260×1140px, PNG RGBA, tỉ lệ khung ~5.49:1:**

| Variant | File | Màu (extract chính xác từ pixel, không ước lượng) |
|---|---|---|
| Navy (chữ đậm) | `public/logo/knxstore-logo-navy.png` | `#0F467C` |
| White (chữ trắng) | `public/logo/knxstore-logo-white.png` | `#FFFFFF` (tải từ `knxstore.vn/assets/logo.png` 2026-08-28) |

### ✅ Accent đã chốt: `#0F467C` (thay Apple Blue `#0071E3` ban đầu)

Quyết định dựa trên contrast WCAG đo thực tế (relative luminance), không phải cảm quan:

| Cặp màu | Contrast | Kết quả |
|---|---|---|
| Navy logo `#0F467C` / nền sáng `#F5F5F7` | **8.82:1** | AAA |
| Navy logo `#0F467C` / **accent cũ `#0071E3`** | **2.04:1** | **FAIL** ← nguyên nhân logo "chìm" |
| Navy logo `#0F467C` / dark-section `#0F172A` | **1.86:1** | **FAIL** ← logo navy KHÔNG được đặt trên dark-section |
| Navy logo `#0F467C` / card-dark `#1B2336` | 1.63:1 | FAIL |
| White logo `#FFFFFF` / dark-section `#0F172A` | 17.85:1 | AAA |
| White logo `#FFFFFF` / card-dark `#1B2336` | 15.67:1 | AAA |
| White logo `#FFFFFF` / **accent cũ `#0071E3`** | 4.70:1 | AA (chỉ vừa đủ) |
| Chữ trắng / nút nền accent mới `#0F467C` | **9.60:1** | AAA (so với 4.70:1 AA của `#0071E3` cũ) |

**Kết luận:** `#0F467C` vừa đúng brand thật, vừa cho contrast nút bấm tốt hơn hẳn accent cũ. Không tách riêng `--color-brand` / `--color-accent` — dùng chung 1 token `--color-accent` cho cả logo lẫn CTA để tối giản hệ token.

### Quy tắc bắt buộc — chọn logo variant theo nền (KHÔNG được lẫn)

| Nền bên dưới logo | Variant bắt buộc | Lý do |
|---|---|---|
| `#F5F5F7`, `#FFFFFF`, card sáng | **Navy** (`knxstore-logo-navy.png`) | Contrast 8.82–9.60:1 |
| Dark-section `#0F172A`, card-dark `#1B2336` | **White** (`knxstore-logo-white.png`) | Navy FAIL (1.63–1.86:1) trên các nền này |
| Banner/nút nền màu accent `#0F467C` | **White** | Navy trên chính màu của nó = vô hình |
| Ảnh sản phẩm/photo nền (Hero B2C) | **White** + có thể thêm shadow/scrim nhẹ phía sau logo | Ảnh có độ tương phản không ổn định, không tin tưởng contrast tự nhiên |

**Định dạng còn thiếu (chưa có trong project, cần bổ sung trước khi code):**
- [ ] Bản SVG vector cho cả 2 variant (hiện chỉ có PNG raster — không scale sắc nét ở favicon/kích thước lớn)
- [ ] Icon mark riêng (không kèm chữ "STORE") cho favicon/app icon nếu cần
- [ ] Clear space & kích thước tối thiểu chưa được định nghĩa chính thức — tạm áp dụng quy tắc chung: clear space ≥ chiều cao chữ "K" quanh 4 cạnh, không thu nhỏ dưới 24px chiều cao trên web

### Typography

- **Heading Font:** Inter
- **Body Font:** Inter
- **Fallback stack:** `-apple-system, BlinkMacSystemFont, "Inter", system-ui, sans-serif` — trên thiết bị Apple sẽ tự render SF Pro thật qua `-apple-system` (miễn phí, không vi phạm license), fallback Inter cho các nền tảng khác.
- **Lý do chọn thay vì Plus Jakarta Sans (auto-match ban đầu):** Inter có hình dạng grotesque-geometric gần SF Pro nhất trong Google Fonts, có tabular figures tốt cho bảng giá/specs, và khớp mood "precision, technical, professional" đúng đối tượng kỹ sư SI/ME.
- **Google Fonts:** https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

**Type Scale:**

| Style | Size | Weight | Tracking |
|---|---|---|---|
| Display | 48px | 700 | -1.5% |
| H1 | 32px | 600 | -0.5% |
| H2 | 24px | 600 | -0.5% |
| Body | 16px | 400 | 0 |
| Label (uppercase) | 13px | 500 | +1.2% |

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Container / Layout tổng thể (max-width, padding, margin)

Áp dụng cho container bọc ngoài mọi trang — tránh mỗi trang tự set width/padding rời rạc.

| Token | Value | Ghi chú |
|---|---|---|
| `--page-max` | `1920px` | Trần ngoài cùng của toàn trang (kể cả nền full-bleed hero/dark-section) — trên màn hình ultra-wide (>1920px), nền dừng lại ở đây và căn giữa, không kéo giãn vô hạn |
| `--container-max` | `1280px` | Max-width nội dung chính bên trong (nav, bento grid, sections). Apple thường 980–1200px cho content, KNXStore rộng hơn chút vì bento grid nhiều cột + bảng specs cần chỗ |
| `--container-max-prose` | `75ch` | Riêng cho block text dài (mô tả sản phẩm, bài viết) — không để full-width như `ux-guidelines` khuyến cáo (đọc khó nếu quá 75 ký tự/dòng) |
| `--container-padding-mobile` | `16px` | Padding 2 bên container ở `<768px` |
| `--container-padding-tablet` | `32px` | Padding 2 bên ở `768–1024px` |
| `--container-padding-desktop` | `64px` | Padding 2 bên ở `≥1024px` |
| `--section-gap-mobile` | `48px` | Margin dọc giữa các section lớn (Hero/Bento/Specs/CTA) trên mobile |
| `--section-gap-desktop` | `96px` | Margin dọc giữa section trên desktop — Apple dùng rất nhiều whitespace dọc, không nén sát |

**Quy tắc:**
- Full-bleed (tràn viewport, không padding) chỉ cho phép ở: hero background image/video, dark-section banner — nhưng vẫn bị chặn trần bởi `--page-max` (1920px), không tràn vô hạn trên màn ultra-wide. Mọi content khác (bento grid, specs table, form) nằm trong `--container-max` + padding trên.
- Breakpoint test bắt buộc: `320 / 375 / 414 / 768 / 1024 / 1440` (theo `ux-guidelines.csv`) — không chỉ test 375/768/1024/1440 như checklist gốc.
- Không dùng margin âm hoặc padding tuỳ tiện theo từng component để "chỉnh cho vừa mắt" — mọi lệch phải là bội số của `--space-*` đã khai báo ở trên (4/8/16/24/32/48/64px), kể cả padding/margin của container.
- Container luôn căn giữa (`margin-inline: auto`), không lệch trái/phải theo viewport lớn.

### Shadow & Radius (Bento Grid)

| Token | Value | Usage |
|---|---|---|
| `--card-radius` | `20px` | Bento cards, product cards |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.04)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.05)` | Cards mặc định |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.08)` | Modal, dropdown |
| `--hover-scale` | `1.02` | Hover bento card — KHÔNG dùng translateY gây layout shift |

---

## Style Guidelines — 3 lớp chồng, không dùng 1 style thuần

| Lớp | Style | Áp dụng |
|---|---|---|
| Nền tảng | **Minimalism & Swiss Style** | Toàn site: grid-based, high contrast, no decoration thừa — ưu tiên vì audience SI/ME cần scan spec nhanh |
| Module hiển thị | **Bento Box Grid** (Apple-style) | Trang chủ + trang category: mỗi ô = 1 protocol (KNX TP, DALI-2, DMX512, Casambi, BACnet, Modbus, Matter) |
| Điểm nhấn có chọn lọc | **Liquid Glass** | CHỈ sticky nav bar / overlay dropdown. KHÔNG phủ toàn trang (giảm contrast bảng specs) |

**Icon set:** Phosphor (`@phosphor-icons/react`) mặc định — fallback Heroicons nếu thiếu icon phù hợp. Không dùng emoji làm icon chức năng.

### Page Pattern — Bento Grid Showcase + Persona Split

```
Hero (trung tính, chưa rẽ nhánh)
  └─ 2 CTA rẽ nhánh persona:
       → "Tôi là System Integrator / ME Contractor" (B2B)
       → "Tôi muốn làm nhà thông minh" (B2C — Matter)
↓
Bento Grid (Key Categories: KNX / DALI-2 / DMX512 / Casambi / BACnet / Modbus / Matter)
↓
Detail Cards (sản phẩm nổi bật mỗi category)
↓
Tech Specs (bảng dữ liệu: dải giá trị, dung sai, chuẩn EN/IEC/KNX Association — trọng tâm cho B2B)
↓
CTA cuối trang (khác nhau theo persona đã chọn ở Hero)
```

- **Nav/Footer/Design tokens:** dùng chung cho cả 2 persona.
- **Nội dung sau rẽ nhánh:** B2B thiên bảng số liệu/datasheet/PDF catalog; B2C thiên ảnh lifestyle + bundle đơn giản, ít thuật ngữ.
- **CTA Placement:** Primary CTA trong nav (sticky) + sau mỗi bento section + cuối trang.

---

## Component Specs (tham khảo — chưa phải code chính thức của dự án)

### Buttons

```css
.btn-primary {
  background: #0F467C;
  color: #FFFFFF;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  transition: opacity 200ms ease, transform 200ms ease;
  cursor: pointer;
}
.btn-primary:hover { opacity: 0.9; }

.btn-secondary {
  background: transparent;
  color: #1D1D1F;
  border: 1.5px solid #1D1D1F;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Bento Card

```css
.bento-card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: transform 200ms ease, box-shadow 200ms ease;
  cursor: pointer;
}
.bento-card:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-lg);
}
```

### Tech Specs Table (B2B — datasheet style)

```css
.specs-table {
  font-variant-numeric: tabular-nums; /* số liệu không lệch hàng */
  border-collapse: collapse;
}
.specs-table th {
  color: #475569;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: left;
  border-bottom: 1px solid #E2E8F0;
}
.specs-table td {
  padding: 10px 16px;
  border-bottom: 1px solid #E2E8F0;
  font-size: 15px;
}
```

### Sticky Nav (Liquid Glass — điểm nhấn duy nhất dùng glass)

```css
.nav-sticky {
  background: rgba(245, 245, 247, 0.72);
  backdrop-filter: blur(16px) saturate(1.5);
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
```

---

## Anti-Patterns (KHÔNG dùng)

- ❌ **Glassmorphism phủ toàn trang** — chỉ dùng cho nav/overlay, phá contrast bảng specs
- ❌ **Vibrant & Block-based / 3D-Hyperrealism** — auto-match gợi ý cho "e-commerce" chung chung nhưng sai tông với audience kỹ sư, nặng performance
- ❌ **Emoji làm icon chức năng** — dùng SVG (Phosphor/Heroicons)
- ❌ **Trộn B2B và B2C cùng 1 luồng nội dung không rẽ nhánh** — 2 đối tượng cần tone khác nhau
- ❌ **translateY/scale gây layout shift trên hover** — chỉ dùng transform không ảnh hưởng bounds
- ❌ **Contrast text dưới 4.5:1** — đặc biệt trên nền `#F5F5F7` nhạt, kiểm tra kỹ text phụ `#475569`
- ❌ **Thiếu trạng thái stale/last-updated khi hiển thị dữ liệu tồn kho/giá "real-time"**

---

## Tham khảo trực tiếp (chưa xác nhận qua ảnh, người dùng tự đối chiếu)

| Site | Lấy gì |
|---|---|
| apple.com, apple.com/iphone | Bento grid, motion, hero product photography |
| csa-iot.org (Matter chính chủ) | Brand guideline Matter — bắt buộc tuân nếu hiển thị logo Matter certified |
| knx.org | Tông màu/brand ngành KNX nếu cần tín hiệu "chính thống" |
| loxone.com | Đối thủ cùng ngành building automation |
| gira.com, abb-buildingautomation.com | Cách trình bày datasheet/specs B2B |
| control4.com, josh.ai | B2C smart-home premium, hero lifestyle |

---

## Việc chưa chốt / cần xác nhận thêm

- [x] ~~Accent color vs logo thật~~ — Đã chốt `#0F467C` làm accent duy nhất (2026-08-28), xem Brand Assets để có số liệu contrast
- [x] ~~Bản đảo màu (trắng) cho dark-section~~ — Đã có `public/logo/knxstore-logo-white.png`, tải từ knxstore.vn
- [ ] Logo: vẫn chưa có bản SVG vector (cả 2 variant đang là PNG raster), chưa có icon mark riêng cho favicon
- [ ] Icon set cụ thể cho từng protocol (KNX/DALI/DMX512/Casambi/BACnet/Modbus/Matter) — cần asset chính thức hoặc thiết kế riêng, không dùng generic
- [ ] Page-specific override (`pages/*.md`) cho trang chủ, trang category, trang sản phẩm — tạo khi bắt đầu build từng trang

---

## Pre-Delivery Checklist (áp dụng khi bắt đầu code)

- [ ] **Không có hex màu hardcode trong component** — mọi màu qua token/`@theme` (xem mục "Nguyên tắc bắt buộc" đầu file)
- [ ] Container dùng đúng `--container-max` + padding theo breakpoint, không set width/padding riêng lẻ từng trang
- [ ] Padding/margin section là bội số `--space-*`, không phải số tự chọn tuỳ ý
- [ ] Không dùng emoji làm icon
- [ ] Icon nhất quán 1 bộ (Phosphor mặc định)
- [ ] `cursor-pointer` trên mọi phần tử click được
- [ ] Hover states có transition mượt (150–300ms)
- [ ] Contrast text ≥ 4.5:1 (kiểm tra riêng trên nền `#F5F5F7` và dark section `#0F172A`)
- [ ] Focus states hiển thị rõ cho keyboard nav (ring `#0F467C`)
- [ ] Logo dùng đúng variant theo nền (navy trên sáng / white trên tối-accent-ảnh) — xem bảng "Quy tắc bắt buộc" ở Brand Assets, không tự ý đặt navy lên nền tối
- [ ] `prefers-reduced-motion` được tôn trọng
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] Không có nội dung bị che bởi sticky nav
- [ ] Không có horizontal scroll trên mobile

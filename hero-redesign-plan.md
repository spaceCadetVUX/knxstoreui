# Kế hoạch redesign Hero — "Command Hero" all-in-one

**Ngày:** 2026-09-03
**Trạng thái:** **Phase 1 (Stage 1-6) ĐÃ LÊN CODE** — xem mục 11 để biết chi tiết từng stage + 2 chỗ lệch khỏi bản plan gốc (đã ghi rõ lý do). `tsc --noEmit`, `next lint`, `next build` đều sạch.
**Phạm vi:** `src/components/home/hero.tsx` (đã sửa) + `src/components/nav/search-box.tsx` (thêm 1 nhánh `variant="hero"`, không đổi nhánh cũ) — **không đụng** `navbar.tsx`/`nav-data.ts`/`protocol-categories.tsx`/`shop-by-category.tsx`.

---

## 1. Vấn đề (theo brief của bạn)

Hành vi khách trên trang chủ KNXStore **không phải hành vi duyệt/lướt** (browse) mà là **hành vi có đích** (task-driven):

1. Vào thẳng ô search, gõ tên sản phẩm/thương hiệu cần mua.
2. Hoặc bấm thẳng vào 1 danh mục để lọc.
3. Hoặc bỏ qua trang chủ, vào thẳng trang danh mục sản phẩm để dùng bộ lọc.

Đây **đúng pattern hành vi chuẩn của khách mua hàng kỹ thuật B2B** (System Integrator/ME Contractor) — giống Digikey, Mouser, RS Components, Grainger: họ biết họ cần gì, không cần được "truyền cảm hứng" bằng ảnh lifestyle. Nhóm B2C Matter Smarthome ít kỹ thuật hơn nhưng vẫn tra cứu theo nhu cầu cụ thể ("công tắc thông minh cho phòng khách"), không phải xem ảnh phòng đẹp rồi mới nghĩ ra nhu cầu.

**Vấn đề với Hero hiện tại** (`hero.tsx`):

| Hiện trạng | Tại sao là vấn đề |
|---|---|
| `h-[90vh]` — chiếm trọn 1 viewport | Nếu khách không đọc hero mà chỉ cần search/lọc, 90vh toàn ảnh kiến trúc + headline là **90vh vô dụng với chính hành vi đã quan sát được** |
| Không có ô search nào trong Hero | Ô search DUY NHẤT nằm ở navbar (`SearchBox` trong `navbar.tsx:183`), ẩn hoàn toàn trên mobile (`hidden ... md:block`) — đúng nhóm hành vi #1 (nhảy vào search ngay) lại là nhóm bị header phục vụ kém nhất trên mobile |
| Danh mục sản phẩm chỉ có trong dropdown navbar (hover) hoặc cuộn xuống `ShopByCategory` (~1 màn hình sau) | Hành vi #2 (bấm danh mục lọc luôn) bị chặn bởi: (a) dropdown hover không tồn tại trên mobile — phải mở hamburger, xem accordion; (b) trên desktop phải *chủ động hover* menu, không phải thứ hiện sẵn trong tầm mắt |
| Dải logo giao thức (KNX/Casambi/DALI-2/Matter) là nội dung tương tác DUY NHẤT trong Hero | Đây là tín hiệu uy tín (trust signal), không phải công cụ điều hướng/lọc — không phục vụ được cả 3 hành vi trên |

**Kết luận:** Hero hiện tại được thiết kế cho mô hình "hero truyền cảm hứng rồi cuộn xuống khám phá" (kiểu B2C lifestyle/nội thất), nhưng hành vi thật của khách là "hero = bảng điều khiển để đi thẳng vào việc". Cần thiết kế lại theo mô hình thứ hai.

---

## 2. Nguyên tắc thiết kế

1. **Search là hành động chính, không phải trang trí.** Đặt ngang tầm mắt, đủ lớn để là điểm neo thị giác đầu tiên — giống pattern hero của các AI builder tool (Lovable/v0/Bolt): 1 ô input to, giữa màn hình, kèm gợi ý bấm nhanh bên dưới. Khách kỹ thuật đã quen pattern này qua ChatGPT/Google — không cần học lại.
2. **Không dồn hết vào 1 mặt phẳng.** Danh mục + giải pháp + thương hiệu nếu hiện cùng lúc trong 1 khối sẽ thành "tường mega-menu" gây rối mắt. Chia thành **tab trượt** (slide tab) — mỗi lần chỉ 1 bộ nội dung, chuyển tab bằng click/phím mũi tên. Site đã có sẵn pattern này chạy tốt ở `protocol-categories.tsx` (role=tablist, translateX slide 500ms) — tái dùng đúng cơ chế đó, không phát minh lại.
3. **Tái dùng dữ liệu + component đã có, không tạo nguồn dữ liệu song song.** Toàn bộ nội dung tab (danh mục, giải pháp, thương hiệu, gợi ý search) đã tồn tại trong `nav-data.ts`, `shop-categories-data.ts`, `search-data.ts` — việc cần làm chủ yếu là **bố cục lại**, không phải sinh nội dung mới.
4. **Giảm vai trò của ảnh hero, không xoá thương hiệu.** Ảnh kiến trúc + dải logo giao thức vẫn giữ (tín hiệu uy tín cho khách mới, đặc biệt B2C), nhưng nhường không gian chính cho command panel.
5. **Không phá vỡ vai trò SEO/nội dung dài của các section phía dưới.** Đây là bổ sung lối đi nhanh (fast path) ở trên cùng, không nhất thiết phải xoá nội dung chi tiết hiện có bên dưới (xem mục 8).

---

## 3. Kiến trúc thông tin đề xuất

```
┌─────────────────────────────────────────────────────────┐
│  [ảnh kiến trúc nền, mờ dần — thấp hơn nhiều so với 90vh] │
│                                                           │
│        Nền tảng phân phối thiết bị tự động hoá toà nhà   │  ← headline rút ngắn, cỡ chữ giảm 1 bậc
│        700+ sản phẩm · 68 thương hiệu · 79 danh mục      │
│                                        Liên hệ tư vấn →  │  ← P4, link nhỏ góc phải, tách khỏi panel chính
│  ┌─────────────────────────────────────────────────┐    │
│  │ 🔍  Tìm sản phẩm, thương hiệu, mã SKU...     [→] │    │  ← P0 — Ô SEARCH LỚN, trung tâm hero
│  └─────────────────────────────────────────────────┘    │
│   [Dimmer DALI-2] [Cảm biến KNX] [Công tắc Casambi]      │  ← P1 — chip gợi ý bấm nhanh
│   [VRV/VRF] [Công tắc Matter]        Xem tất cả sp →     │  ← P1 — CTA xem toàn bộ catalog, cùng tier với chip
│                                                           │
│   ( Danh mục sản phẩm )( Giải pháp )( Thương hiệu )      │  ← P2 — TAB SWITCHER (pill, giống protocol-categories)
│  ┌─────────────────────────────────────────────────┐    │
│  │ [icon] [icon] [icon] [icon] [icon] [icon]        │    │  ← P2 — nội dung tab đang chọn
│  │ Chiếu  HVAC   An     KNX    Cảm    Matter        │    │     (trượt ngang khi đổi tab)
│  │ sáng          ninh          biến                 │    │
│  │ Xem tất cả 79 danh mục →                         │    │  ← chân panel, cùng tier P2
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│   KNX   CASAMBI   DALI-2   matter                        │  ← P3 — dải logo giao thức, cuối panel
└─────────────────────────────────────────────────────────┘
```

Toàn bộ khối "search + chip + tab" là **1 panel kính mờ** (frosted glass) — kế thừa đúng pattern `bg-card/78 backdrop-blur-lg rounded-3xl` đang dùng cho dải logo giao thức hiện tại, chỉ mở rộng nội dung bên trong.

---

## 3.1. Rà soát tính đầy đủ — có thiếu gì không?

Trả lời thẳng: bản nháp đầu **thiếu 2 thứ thật sự**, rà soát lại toàn bộ site mới phát hiện ra:

1. **"Xem tất cả sản phẩm"** — chưa có mặt ở đâu trong bản vẽ Hero. Route này đã tồn tại sẵn (`product-highlights.tsx:19-20`, `href="/san-pham"`, label "Xem tất cả sản phẩm") nhưng chỉ nằm ở cuối section "Sản phẩm mới", cách Hero 2-3 màn hình — đúng cái khách ở hành vi #3 ("vào luôn trang sản phẩm để dùng bộ lọc") sẽ KHÔNG thấy nếu không cuộn xuống.
2. **2 CTA gốc của Hero cũ** ("Khám phá giải pháp" → `/giai-phap`, "Liên hệ tư vấn" → `/lien-he`, ở `hero.tsx:111-128`) — bản vẽ mới thay hẳn khối CTA bằng panel search, chưa nói rõ 2 nút này đi đâu. "Khám phá giải pháp" bị tab "Giải pháp" thay thế hợp lý, nhưng **"Liên hệ tư vấn" phục vụ 1 nhu cầu thứ 4 chưa được nhắc tới**: khách B2B (System Integrator/ME Contractor) nhiều khi không muốn tự tìm/tự lọc mà muốn được sales tư vấn trực tiếp — search+tab không thay thế được nhu cầu này.

Bảng dưới đây là **kiểm kê đầy đủ mọi entry-point** cần có trong Hero (không chỉ 3 mục bạn liệt kê ban đầu) kèm quy cách hiển thị cụ thể cho từng cái:

| # | Nhu cầu khách | Element | Vị trí trong panel | Quy cách hiển thị | Đích đến |
|---|---|---|---|---|---|
| 1 | Tìm theo tên/SKU/brand | Ô search lớn | Trên cùng | Input `rounded-2xl` ~60px cao, icon trái, dropdown kết quả (tái dùng `SearchBox`) | `/tim-kiem?q=` |
| 2 | Tìm nhanh danh mục hot | Chip gợi ý | Ngay dưới search | Hàng pill nhỏ, 5-6 chip, cuộn ngang mobile | `/danh-muc-san-pham/{slug}` |
| 3 | Duyệt theo nhóm ngành hàng | Tab "Danh mục sản phẩm" | Trong tab switcher | Grid icon-tile 6 ô + **dòng chân "Xem tất cả 79 danh mục →"** | mỗi ô → `/danh-muc-san-pham/{key}`; chân → `/danh-muc-san-pham` |
| 4 | Duyệt theo nhu cầu sử dụng | Tab "Giải pháp" | Trong tab switcher | Grid icon-tile 4 ô + **dòng chân "Xem tất cả giải pháp →"** | mỗi ô → `/giai-phap/{slug}`; chân → `/giai-phap` |
| 5 | Tìm theo thương hiệu quen | Tab "Thương hiệu" *(tuỳ chọn, xem câu hỏi 1)* | Trong tab switcher | Grid 8 tên brand + **dòng chân "Xem tất cả 68 thương hiệu →"** | mỗi ô → `/thuong-hieu/{slug}`; chân → `/thuong-hieu` |
| 6 | **Bỏ qua hết, tự lọc trên toàn bộ catalog** | "Xem tất cả sản phẩm" (bổ sung, xem 4.6) | Link phụ cạnh/dưới ô search | Text-link nhỏ kèm mũi tên (style giống các link "Xem tất cả X →" đã dùng khắp site) | `/san-pham` (route đã có, trang thật chưa dựng) |
| 7 | Cần tư vấn trực tiếp thay vì tự tìm | "Liên hệ tư vấn" (bổ sung, xem 4.7) | Góc panel hoặc cạnh headline | Text-link nhỏ, không cạnh tranh thị giác với search | `/lien-he` |
| 8 | Tín hiệu uy tín/chính hãng | Dải logo giao thức | Cuối panel | Giữ nguyên như hiện tại | `/danh-muc-san-pham/{...}` |

Dòng 6 và 7 ở bảng trên là bổ sung mới so với bản đầu — chi tiết quy cách ở 4.6/4.7 bên dưới.

---

## 4. Chi tiết từng thành phần

### 4.1. Ô search lớn

- Tái dùng `SearchBox` (`src/components/nav/search-box.tsx`) — component đã có đủ: debounce-free client filter, dropdown kết quả, phím mũi tên, điều hướng `/tim-kiem?q=`. **Không viết search engine mới.**
- Thêm 1 variant mới (`variant="hero"` bên cạnh `"desktop"`/`"mobile"` đã có) để style riêng: chiều cao ~60px (so với ~40px hiện tại), `text-base` thay `text-sm`, `rounded-2xl` thay vì `rounded-full` (bo góc mềm hơn "pill" — gợi cảm giác "ô nhập lệnh" kiểu Lovable/v0 hơn là thanh search thông thường của nav, tạo phân biệt thị giác chủ ý giữa 2 nơi).
- Placeholder cụ thể hơn để gợi ý phạm vi tìm: *"Tìm theo tên sản phẩm, thương hiệu, mã SKU hoặc giao thức (KNX, DALI-2, Casambi, Matter)..."*
- **Giới hạn cần biết trước:** `searchProducts` (`search-data.ts`) hiện chỉ có **10 sản phẩm mock**, không phải catalog thật 745 SKU (đã ghi rõ trong comment file gốc, chờ API backend thật). Phóng to ô search không tự giải quyết vấn đề chất lượng kết quả — đây là giới hạn có sẵn của toàn site, không phải lỗi phát sinh từ redesign này.

### 4.2. Chip gợi ý bấm nhanh

- Nguồn dữ liệu: top danh mục theo số SKU thật trong `shop-categories-data.ts` (`RAW_TOP_17`, đã sort theo count giảm dần) — lấy 5-6 chip đầu (Điều khiển máy lạnh VRV/VRF, Điều khiển máy lạnh cục bộ, Điều khiển ON/OFF, Thiết bị mở rộng, Dimmer Triac...). Đây là dữ liệu **thật** (query MCP catalog), không phải bịa.
- **Quyết định cần chốt:** chip là gì khi bấm?
  - **Phương án A (đề xuất):** chip = link thẳng tới trang danh mục (`href` có sẵn trong `shopCategories`) — vì nội dung chip là TÊN DANH MỤC, không phải từ khoá sản phẩm, nhồi vào ô search (vốn match theo tên sản phẩm/brand) sẽ ra kết quả rời rạc/rỗng do search mock chỉ có 10 item.
  - **Phương án B:** chip fill vào ô search + tự submit — đúng nghĩa đen "bấm để search luôn" như bạn mô tả, nhưng sẽ lộ giới hạn dữ liệu mock ở 4.1 (nhiều chip sẽ trả về 0 kết quả vì trong 10 sản phẩm mock chưa chắc có đúng category đó).
  - Khuyến nghị: **A cho danh mục, B chỉ áp dụng cho vài chip tên brand/giao thức phổ biến** (KNX, Casambi, Matter) — brand/giao thức là field `searchProducts.brand`/`categoryGroup` thật sự tồn tại trong mock nên match được.

### 4.3. Tab switcher — "Danh mục sản phẩm" / "Giải pháp" / "Thương hiệu"

Tái dùng nguyên cơ chế tab trong `protocol-categories.tsx` (tablist ARIA đầy đủ, `inert` cho panel ẩn, slide `translateX`, phím trái/phải) — chỉ đổi nội dung panel, **không viết lại state machine**.

| Tab | Nguồn dữ liệu | Nội dung hiển thị | Số lượng đề xuất | Chân panel (footer link) |
|---|---|---|---|---|
| Danh mục sản phẩm | `nav-data.ts` → `productCategories` | 6 nhóm macro, mỗi ô = icon (từ `categoryIcon`, đã map sẵn) + tên + meta ("~230 sản phẩm") | 6 ô — vừa 1 hàng desktop, 2 hàng mobile | `productCategories.viewAllLabel` = "Xem tất cả danh mục" → `/danh-muc-san-pham` (field đã có sẵn trong `NavGroup`, không cần thêm data) |
| Giải pháp | `nav-data.ts` → `solutions` | 4 use-case (Nhà ở, Khách sạn/Resort, Văn phòng, Dự án), mỗi ô = icon + tên | 4 ô | `solutions.viewAllLabel` = "Xem tất cả giải pháp" → `/giai-phap` |
| Thương hiệu *(cân nhắc — xem 4.4)* | `nav-data.ts` → `topBrands` | 8 brand hàng đầu theo SKU + link "Xem tất cả 68" | 8 ô | `topBrands.viewAllLabel` = "Xem tất cả 68 thương hiệu" → `/thuong-hieu` |

Cả 3 dòng chân đều tái dùng đúng field `viewAllHref`/`viewAllLabel` đã có sẵn trong type `NavGroup` (`nav-data.ts:46-47`) — style giống hệt link "Xem tất cả X →" cuối menu navbar (`navbar.tsx:440-448`), không tạo quy ước hiển thị mới.

**Vì sao dùng 6 nhóm macro (`productCategories`) chứ không phải 17 category chi tiết (`shopCategories`) cho tab này:** 17 ô sẽ khiến panel hero quá cao (ShopByCategory bên dưới đã làm việc này với đủ không gian riêng — 17 ô ở `shop-by-category.tsx:53-84`). Hero cần bản RÚT GỌN, đủ để khách nhảy nhanh vào 1 trong 6 nhóm lớn, rồi dùng bộ lọc chi tiết ở trang danh mục — đúng hành vi #3 bạn mô tả ("vào luôn trang sản phẩm để dùng bộ lọc").

### 4.4. Ảnh nhỏ trong ô danh mục — giới hạn dữ liệu cần biết trước khi duyệt

Bạn yêu cầu danh mục "bao gồm ảnh nhỏ trong luôn". **Catalog hiện KHÔNG có ảnh category/sản phẩm thật** — đã ghi rõ trong comment của cả `shop-by-category.tsx:20-23` và `protocol-categories.tsx` ("chờ ảnh thật"). Toàn site hiện xử lý bằng 1 trong 2 cách:

- Icon Phosphor đặt trong khung vuông `bg-muted` (cách `search-box.tsx` đang dùng cho category badge trong dropdown kết quả).
- Ô `bg-muted` trống trơn, chờ ảnh (cách `shop-by-category.tsx`/`protocol-categories.tsx` đang dùng).

**Đề xuất cho Hero:** dùng icon-tile (ô vuông bo góc, icon màu accent giữa nền `bg-muted`, y hệt kiểu trong `search-box.tsx:144-146`) — vừa "có hình ảnh nhỏ" đúng yêu cầu UI, vừa nhất quán với pattern đã duyệt ở nơi khác, vừa không tạo ảo giác "đây là ảnh sản phẩm thật" (ô trống hoàn toàn dễ bị hiểu nhầm là bug). Khi có ảnh chụp category thật, thay icon bằng `next/image` — đúng lộ trình nâng cấp đã ghi sẵn trong codebase, không phải nợ kỹ thuật mới.

### 4.5. Dải logo giao thức (KNX/Casambi/DALI-2/Matter)

Giữ nguyên vị trí cuối Hero, giữ nguyên component vừa fix responsive (grid-cols-2 → lg:flex). Đây là trust bar, không phải điều hướng — không đưa vào hệ thống tab.

### 4.6. "Xem tất cả sản phẩm" — CTA thường trực (bổ sung, xem 3.1)

Phục vụ đúng hành vi #3 bạn mô tả ("vào luôn trang sản phẩm để dùng bộ lọc") — khách này **không muốn đi qua danh mục/giải pháp**, chỉ muốn thẳng tới catalog đầy đủ + tự lọc. Không nên nhét hành vi này vào trong 1 tab (tab dùng để duyệt theo nhóm, còn đây là "bỏ qua mọi nhóm").

- **Vị trí:** 1 text-link nhỏ, đặt ngay dưới hàng chip gợi ý hoặc căn phải cùng hàng với chip — không đặt ngang hàng ô search (tránh 2 CTA cùng trọng lượng thị giác gây phân vân "bấm cái nào trước").
- **Style:** tái dùng đúng pattern link "Xem tất cả X →" đã chạy khắp site (`text-accent font-medium` + `ArrowUpRight` icon, xem `shop-by-category.tsx:34-45` hoặc `product-highlights.tsx`), không tạo style CTA mới.
- **Nhãn + đích:** *"Xem tất cả sản phẩm →"*, `href="/san-pham"` — tái dùng nguyên href đã định nghĩa ở `product-highlights.tsx:19-20`, không tạo route mới.
- **Lưu ý:** `/san-pham` hiện là route placeholder (chưa có trang thật trong `src/app` — toàn bộ site mới chỉ có `page.tsx` của trang chủ). Đưa link này lên Hero KHÔNG tạo thêm nợ kỹ thuật mới, chỉ tăng mức độ hiển thị của 1 link vốn đã tồn tại.

### 4.7. "Liên hệ tư vấn" — số phận CTA cũ (bổ sung, xem 3.1)

Hero cũ có 2 CTA: "Khám phá giải pháp" (`/giai-phap`) và "Liên hệ tư vấn" (`/lien-he`) — `hero.tsx:111-128`.

- **"Khám phá giải pháp":** đề xuất **bỏ**, vì tab "Giải pháp" trong panel mới đã phục vụ đúng nhu cầu này ở vị trí nổi bật hơn hẳn 1 nút CTA đơn.
- **"Liên hệ tư vấn":** đây là nhu cầu **thứ 4, khác hẳn 3 hành vi self-service ban đầu** — khách (đặc biệt B2B: System Integrator/ME Contractor) muốn được sales tư vấn trực tiếp thay vì tự tìm/tự lọc. Search to + tab không thay thế được nhu cầu này. Đề xuất **giữ lại** dưới dạng 1 link nhỏ (không phải button chiếm chỗ), đặt ở góc panel hoặc ngay dưới headline, để không mất hẳn lối vào funnel tư vấn — đây là quyết định cần bạn duyệt (câu hỏi 7, mục 10).

---

## 5. Thứ tự ưu tiên & bố cục thị giác (Visual Hierarchy)

Đây là phần trả lời câu hỏi "bố trí sao cho khoa học, dễ thấy, độ ưu tiên thế nào" — không làm theo cảm tính mà dựa trên 4 nguyên tắc UX cụ thể, áp dụng trực tiếp vào từng element:

- **Von Restorff Effect** (hiệu ứng cách ly): phần tử khác biệt hẳn về hình dạng/kích thước so với xung quanh sẽ được mắt ghi nhận đầu tiên → dùng cho ô search (kích thước + bo góc khác hẳn mọi phần tử khác trong panel).
- **Hick's Law**: thời gian ra quyết định tăng theo số lượng lựa chọn hiển thị đồng thời → đây chính là lý do chia tab thay vì hiện cả 18 lựa chọn (6 danh mục + 4 giải pháp + 8 thương hiệu) cùng lúc — mỗi lần chỉ lộ ra tối đa 8 lựa chọn.
- **Miller's Law (7±2)**: giới hạn chip gợi ý ở 5-6 (không liệt kê hết 17 category) để khách quét hết trong 1-2 giây, không phải đọc từng dòng.
- **Fitts's Law**: mục tiêu càng quan trọng/càng hay bị bấm thì càng phải to + gần con trỏ/ngón tay → áp dụng cho search (to nhất) và icon-tile trong tab (tối thiểu 44×44px vùng chạm, đúng chuẩn WCAG 2.5.5 site đã dùng ở `navbar.tsx` các nút `h-11 w-11`).

### Bảng xếp hạng ưu tiên (P0 = cao nhất)

| Tier | Element | Vì sao xếp tier này | Kích thước/màu thể hiện | Khoảng cách tới tier trên |
|---|---|---|---|---|
| **P0** | Ô search | Tần suất dùng cao nhất (hành vi #1); là "điểm neo" đầu tiên mắt phải chạm vào | To nhất panel (~60px cao), `rounded-2xl` khác biệt hẳn hình dạng so với mọi phần tử khác, có shadow nhẹ nổi trên nền kính mờ | — (đầu bảng) |
| **P1** | Chip gợi ý + "Xem tất cả sản phẩm" | 1-click, không cần "suy nghĩ" — hưởng lây sự chú ý vừa dừng ở search | Pill nhỏ (32-36px), tối đa 5-6 chip (Miller's Law), CTA "Xem tất cả" cùng dòng nhưng style link (nhẹ hơn chip) | Sát ngay dưới search (~12-16px) — liền mạch, không ngắt |
| **P2** | Tab switcher + grid nội dung | Cần thêm 1 bước quyết định (chọn tab) trước khi thấy kết quả — theo Hick's Law nên tách nhóm | Tab-pill nhỏ hơn chip P1 1 bậc (để không tranh vị trí "hành động chính"); icon-tile bên trong ≥44×44px (Fitts's Law) | Cách rõ tier P1 (~32-40px) — báo hiệu "nhóm chức năng khác" |
| **P3** | Dải logo giao thức | Tín hiệu tiềm thức, không đòi hỏi quyết định | Nhỏ, giữ nguyên màu logo gốc (KHÔNG dùng accent brand — tránh cạnh tranh với CTA) | Cách xa nhất (~48-64px) — tách hẳn khỏi vùng "hành động" |
| **P4** | "Liên hệ tư vấn" | Phục vụ thiểu số (muốn người thật tư vấn thay vì tự tra) nhưng vẫn phải tồn tại (đã có ở Hero gốc) | Text-link nhỏ nhất, không nền/không border, đặt lệch ra khỏi trục trung tâm (góc phải cạnh trust-line) | Tách hẳn khỏi panel chính — không nằm trên trục mắt đang tập trung vào search |

### 3 nguyên tắc bố cục áp dụng

1. **Trục dọc trung tâm duy nhất, không lệch trái/phải.** Đây là mô hình "prompt box" (như ChatGPT/Lovable/v0), khác hẳn mô hình marketing truyền thống 2 cột (text trái/ảnh phải như `protocol-categories.tsx` đang dùng). Mắt chỉ cần di chuyển dọc theo 1 trục, không phải quét ngang — phù hợp nhất với hành vi "tìm nhanh, không đọc kỹ" đã quan sát.
2. **Khoảng cách (spacing) tỷ lệ thuận với chênh lệch priority (Gestalt — proximity grouping).** P0→P1 gần nhau nhất (cùng "cụm hành động search"), P1→P2 xa hơn (ngắt sang "cụm khám phá"), P2→P3 xa nhất (ngắt hẳn sang "cụm tín hiệu uy tín"). Khoảng cách tự thân đã truyền tải phân cấp, không cần thêm đường kẻ hay nhãn phụ.
3. **Thứ tự DOM = thứ tự priority, không dùng CSS `order` để đảo ngược.** Vừa đúng cho SEO/screen reader (đọc đúng thứ tự quan trọng nhất trước), vừa tránh lệch giữa thứ tự hiển thị và thứ tự thao tác bằng phím Tab.

---

## 6. Responsive & tương thích mọi loại thiết bị

### 6.1. Bảng theo breakpoint (dùng đúng breakpoint Tailwind đã chạy toàn site: `sm`640/`md`768/`lg`1024/`xl`1280 — không tự đặt breakpoint mới)

| Breakpoint | Headline + Liên hệ tư vấn | Search (P0) | Chip + Xem tất cả sp (P1) | Tab switcher (P2) | Grid nội dung tab | Logo giao thức (P3) |
|---|---|---|---|---|---|---|
| `<375px` (màn rất nhỏ, iPhone SE...) | Headline giảm thêm 1 bậc cỡ chữ, "Liên hệ tư vấn" thu về icon+text ngắn | Full width, `rounded-2xl` giữ nguyên tỷ lệ | Cuộn ngang bắt buộc (không wrap — 5-6 chip chắc chắn tràn ở 320-374px) | Cuộn ngang pill | 2 cột | Grid 2×2 (đã fix ở bản trước) |
| `375–639px` (mobile) | Headline rút gọn 1 dòng nếu được | Full width, đặt NGAY dưới headline (ưu tiên cao nhất — nhóm ít kiên nhẫn nhất) | Cuộn ngang 1 hàng, ẩn scrollbar (pattern có sẵn ở `value-props.tsx:127`) | Cuộn ngang pill | 2 cột | Grid 2×2 |
| `640–767px` (`sm`, phablet/tablet dọc nhỏ) | Headline đầy đủ | Full width panel | Wrap 2 hàng, căn giữa | Có thể wrap, đứng yên (không cuộn) | 2-3 cột | Grid 2×2 |
| `768–1023px` (`md`, tablet ngang/laptop nhỏ) | Headline đầy đủ | Full width, bắt đầu giới hạn max-width | Wrap 1-2 hàng | 1 hàng nếu đủ chỗ | 3 cột | 1 hàng (đã fix `lg:flex` — *lưu ý: `md` vẫn còn ở dải grid-cols-2 theo fix trước, xem 6.3* ) |
| `≥1024px` (`lg` trở lên) | Headline đầy đủ, cỡ lớn nhất | Max-width ~640-720px, căn giữa panel (không kéo dài hết panel — dòng quá dài khó quét) | 1 hàng, căn giữa | 1 hàng | 6 cột (danh mục) / 4 cột (giải pháp) | 1 hàng |

### 6.2. Orientation — mobile xoay ngang (landscape)

Bug tiềm ẩn của bản CŨ: `h-[90vh]` trên điện thoại xoay ngang (viewport height thực tế chỉ ~375-420px) sẽ ép Hero cao đúng bằng ~340-380px nhưng vẫn phải nhồi đủ ảnh nền + headline — chắc chắn vỡ layout hoặc chữ bị cắt. Việc đổi sang **auto-height** (mục 7) giải quyết triệt để vấn đề này mà không cần thêm media query riêng cho landscape — chiều cao Hero luôn co giãn theo nội dung thật, không phụ thuộc `vh`.

### 6.3. Input method — chuột (hover) vs chạm (touch)

- Tab switcher tái dùng cơ chế từ `protocol-categories.tsx`: chuyển tab bằng `onClick` (không phải `onMouseEnter`) — **đã hoạt động đúng trên cả chuột lẫn cảm ứng**, không cần sửa gì thêm. (Khác với `NavDropdown` ở navbar dùng hover-intent — đó là menu khác, không áp dụng logic đó cho tab trong Hero).
- Ô search dùng `type="search"` (giữ nguyên như `SearchBox` gốc) để bật đúng bàn phím ảo + nút "Tìm kiếm"/"Go" trên iOS/Android, không phải bàn phím mặc định.
- Phím mũi tên trái/phải để chuyển tab (đã có sẵn trong `protocol-categories.tsx`, giữ nguyên) — vẫn hoạt động song song với chuột/chạm, không loại trừ nhau.

### 6.4. Zalo in-app WebView / Android WebView cũ

Đây là ràng buộc **có thật** của tổ chức, không phải giả định — đã được ghi nhận trong chính codebase (`navbar.tsx` comment về việc tránh `grid-template-rows` đơn vị `fr` vì WebView cũ không animate mượt, ảnh hưởng trực tiếp tới traffic B2C Matter Smarthome qua Zalo). Animation của tab switcher trong Hero mới **tái dùng đúng cơ chế `transform: translateX` + `inert`** từ `protocol-categories.tsx` — cơ chế này dùng thuộc tính CSS cơ bản, đã chạy ổn định trên đúng nhóm thiết bị này vì đang chạy thật trên trang chủ hiện tại. Không đổi sang cơ chế animate mới nào khác cho phần tab trong Hero.

### 6.5. `prefers-reduced-motion`

Bắt buộc thêm `motion-reduce:transition-none` (và tương đương) cho **mọi** animation mới: focus ring ô search, hover chip, slide tab — đúng convention `motion-reduce:` đã áp dụng nhất quán toàn site (`hero.tsx`, `navbar.tsx`, `protocol-categories.tsx` đều có).

### 6.6. Màn hình rất rộng (ultra-wide, >1280px)

Panel bị chặn bởi `--container-max: 1280px` (token toàn site) nên không kéo dài vô hạn. Riêng **ô search nên có max-width RIÊNG nhỏ hơn nữa** (~640-720px) dù panel ngoài rộng hơn — 1 input dài quá 800px trên màn 27-32 inch sẽ khó quét chữ theo nguyên tắc line-length UX, kể cả khi có đủ không gian ngang.

### 6.7. Safe-area / notch

Hero không phải phần tử `fixed`/`sticky` (khác navbar) nên không tiếp giáp mép màn hình vật lý — rủi ro bị notch/tai thỏ che khuất thấp, không cần `env(safe-area-inset-*)`. Đã cân nhắc, không cần xử lý thêm.

---

## 7. Chiều cao & vai trò của ảnh nền

Hero hiện tại: `h-[90vh] min-h-[90vh]` (`hero.tsx:73`). Đề xuất đổi sang **chiều cao tự nhiên theo nội dung** (`auto` + padding, bỏ `h-[90vh]`) vì lý do:

- Với hành vi task-driven đã quan sát, buộc khách cuộn hết 90vh mới thấy nội dung tiếp theo (kể cả khi họ không cần đọc phần lifestyle) là ma sát không cần thiết.
- Command panel (search+chip+tab+grid) cần không gian dọc đáng kể — nếu vẫn ép trong 90vh cùng ảnh nền + headline, panel sẽ bị bóp hoặc đẩy tràn khỏi khung ảnh.
- Giải quyết luôn bug tiềm ẩn ở mobile landscape (xem 6.2).

Ảnh kiến trúc nền (`/hero/office-showcase.png`) **vẫn giữ** nhưng vai trò đổi từ "chủ thể chính" thành "lớp nền mờ phía sau panel" — về mặt hình ảnh, tỷ trọng ảnh so với tổng Hero sẽ giảm đáng kể (khi Hero co lại theo nội dung, phần ảnh phía trên panel tự nhiên ngắn hơn 90vh nhiều).

**Phương án thay thế (cần bạn chọn — xem mục 10, câu hỏi 4):** bỏ hẳn ảnh, dùng nền phẳng/gradient tối giản kiểu công cụ SaaS/dev-tool (Linear, Vercel, chính Lovable) — tối đa hoá độ tương phản và tập trung 100% vào command panel, đánh đổi lại là mất tín hiệu "không gian nội thất đẹp" hữu ích cho nhóm B2C Matter Smarthome. Khuyến nghị giữ ảnh (phương án đã mô tả ở trên) vì KNXStore phục vụ cả B2B lẫn B2C, ảnh kiến trúc vẫn có giá trị cho nhóm B2C dù không phải nhóm chính của redesign này.

---

## 8. Ảnh hưởng tới 2 section phía dưới trang chủ — CẦN QUYẾT ĐỊNH

Sau khi Hero có tab "Danh mục sản phẩm" + "Giải pháp", nội dung này **trùng lặp một phần** với 2 section đã có sẵn ngay bên dưới:

- `ProtocolCategories` (`protocol-categories.tsx`) — "Giải pháp theo giao thức", 9 tab chi tiết (Casambi/KNX/DALI-2/DMX512/Zigbee/Modbus/An ninh/Matter/HVAC), mỗi tab có ảnh + mô tả dài + CTA riêng.
- `ShopByCategory` (`shop-by-category.tsx`) — "Danh mục sản phẩm", grid 17 category theo SKU cao nhất.

**3 phương án:**

| Phương án | Mô tả | Ưu điểm | Nhược điểm |
|---|---|---|---|
| **A — Giữ nguyên cả 2 (đề xuất cho Phase 1)** | Hero = fast-path rút gọn (6 nhóm/4 use-case), 2 section dưới = bản đầy đủ/SEO-rich, không đổi gì | Rủi ro thấp nhất, không tốn công sửa 2 component đã hoàn thiện, vẫn có nội dung dài cho SEO crawler + nhóm khách vẫn thích cuộn xem | Có trùng lặp nội dung nhẹ giữa Hero-tab và section dưới (chấp nhận được vì hero là tóm tắt, section dưới là chi tiết) |
| **B — Xoá 2 section, dồn hết chức năng vào Hero** | Hero tab "Danh mục" dùng luôn 17 category, tab "Giải pháp" dùng luôn 9 giao thức đầy đủ (ảnh + mô tả) | Trang ngắn hơn, không trùng lặp | Hero sẽ rất nặng/cao (17 ô + mô tả dài không còn là "hero gọn"), mất nội dung SEO dài hiện có, rủi ro cao, không khớp tinh thần "gọn, chia tab" ban đầu |
| **C — Merge một phần** | Xoá `ShopByCategory` (vì Hero tab Danh mục đã thay thế đủ), giữ `ProtocolCategories` (vì nội dung mô tả kỹ thuật dài, có giá trị SEO/giáo dục riêng mà Hero không nên gánh) | Giảm trùng lặp nhiều nhất mà vẫn giữ nội dung có giá trị dài hạn | Cần sửa `page.tsx`, xoá 1 component đang hoạt động — nên làm ở Phase 2 sau khi Hero mới đã chứng minh hiệu quả |

**Khuyến nghị: Phương án A cho Phase 1.** Lý do chính: tách rủi ro — Hero mới là thay đổi lớn nhất, không nên đồng thời xoá thêm 2 section đang chạy tốt. Đánh giá lại A→C sau khi có dữ liệu thực tế (GA4 — tổ chức đã có MCP `GA4` kết nối, có thể đo tỷ lệ click Hero-tab vs tỷ lệ cuộn xuống section dưới trước khi quyết xoá).

---

## 9. Việc tái dùng vs. việc mới (tránh trùng công + giữ nhất quán)

| Thành phần mới trong Hero | Tái dùng từ | Việc thật sự phải viết mới |
|---|---|---|
| Ô search lớn | `SearchBox` component nguyên bản | Thêm 1 variant style (`"hero"`), không đổi logic |
| Chip gợi ý | `shopCategories`, `searchProducts` (data có sẵn) | UI chip (nhỏ), map dữ liệu → phương án A/B mục 4.2 |
| Tab switcher + slide panel | Cơ chế tablist/`translateX`/`inert`/phím mũi tên từ `protocol-categories.tsx` | Đổi nội dung panel, giữ nguyên cơ chế |
| Icon danh mục | `categoryIcon` (`nav-data.ts`) | Không có gì mới |
| Nội dung tab Danh mục/Giải pháp/Thương hiệu | `productCategories` / `solutions` / `topBrands` (`nav-data.ts`) | Không có gì mới — **lưu ý:** `solutions` trong `nav-data.ts` đang ghi chú "ĐỀ XUẤT — chưa có dữ liệu CMS xác nhận, cần duyệt lại với sales/marketing" (dòng 137) — nếu tab Giải pháp lên Hero (vị trí nổi bật hơn hẳn dropdown navbar hiện tại), nên xác nhận nội dung này với đội sales trước khi tăng độ hiển thị |
| "Xem tất cả sản phẩm" | `href`/label đã định nghĩa ở `product-highlights.tsx:19-20` | Không có gì mới |
| Panel kính mờ bao ngoài | `bg-card/78 backdrop-blur-lg rounded-3xl` (đang dùng cho dải logo giao thức hiện tại) | Mở rộng kích thước, không đổi công thức màu/blur |
| Animation entrance | `Reveal` + `useDelayedUnmount` (`reveal.tsx`) | Không có gì mới |

**Tóm lại:** đây chủ yếu là bài toán **bố cục lại (recompose)**, không phải xây tính năng mới từ đầu — rủi ro kỹ thuật thấp, thời gian implement chủ yếu nằm ở UI/CSS + polish animation, không nằm ở logic/data.

---

## 10. Câu hỏi cần bạn chốt trước khi code

1. **Bộ tab cuối cùng:** 2 tab (Danh mục + Giải pháp) hay 3 tab (thêm Thương hiệu)? → ảnh hưởng độ rộng tablist và chiều cao panel.
2. **2 section phía dưới** (`ProtocolCategories`, `ShopByCategory`): chọn phương án A/B/C ở mục 8 — mặc định đề xuất **A (giữ nguyên, đánh giá lại sau)**.
3. **Chip gợi ý bấm nhanh:** chọn phương án A (link tới trang danh mục) hay B (fill + submit vào ô search) ở mục 4.2 — hay trộn cả 2 loại chip như đề xuất?
4. **Ảnh nền Hero:** giữ ảnh kiến trúc (thu nhỏ vai trò) hay bỏ hẳn, chuyển nền phẳng/gradient kiểu SaaS tool? → mục 7.
5. **Nội dung `solutions`** (4 use-case) hiện chưa được sales/marketing xác nhận chính thức (ghi trong `nav-data.ts:137`) — có cần chờ xác nhận trước khi đưa lên vị trí nổi bật hơn (Hero) không, hay tạm dùng luôn và sửa sau nếu sales phản hồi khác?
6. **Mobile:** grid nội dung tab hiện luôn hay thu gọn dạng accordion (bấm tab mới xổ ra) để tránh Hero quá cao trên màn hình nhỏ? → mục 6.1.
7. **"Liên hệ tư vấn":** giữ lại làm link nhỏ (P4, mục 4.7 + 5) hay bỏ hẳn vì đã có "Liên hệ" trong footer/trang khác?

---

## 11. Lộ trình triển khai code (Phase 1 chia nhỏ thành từng bước review được)

**Ràng buộc đầu tiên, áp dụng cho toàn bộ lộ trình:** **không đụng `src/components/nav/*`** (navbar, dropdown, mobile menu — hành vi/giao diện nav giữ nguyên 100%) và **không đụng `protocol-categories.tsx` / `shop-by-category.tsx`** (Phương án A, mục 8 — 2 section này giữ nguyên, đánh giá lại ở Phase 2/3). Toàn bộ thay đổi nằm trong `src/components/home/hero.tsx` (và có thể thêm data cục bộ ngay trong file đó, không tạo file mới trừ khi ghi rõ).

**Lưu ý 1 chỗ xám cần bạn xác nhận cách hiểu:** Stage 2 bên dưới cần thêm 1 biến thể hiển thị lớn cho ô search — component `SearchBox` hiện nằm ở `src/components/nav/search-box.tsx`. Mình hiểu "không tác động đến nav" là **không đổi giao diện/hành vi nav hiện có**, không phải cấm tuyệt đối đụng vào file trong thư mục `nav/`. Cách làm: **thêm 1 nhánh style mới** (`variant="hero"`) vào đúng component đó — 0 dòng nào trong 2 variant `"desktop"`/`"mobile"` đang chạy trong navbar bị đổi, chỉ cộng thêm case mới. Nếu bạn muốn tuyệt đối không sửa bất kỳ file nào trong `components/nav/` (kể cả kiểu cộng thêm không phá gì), báo mình đổi sang phương án tạo file riêng `components/home/hero-search.tsx` (chấp nhận lặp lại 1 phần logic filter/dropdown).

Mỗi stage dưới đây là **1 commit/checkpoint riêng, có build + screenshot kiểm tra trước khi qua stage tiếp** (đúng quy trình đã làm khi fix logo responsive) — không gộp hết vào 1 lần sửa lớn.

| Stage | Nội dung | Trạng thái |
|---|---|---|
| **0 — Chuẩn bị** | Đọc lại `hero.tsx`, xác nhận đúng đoạn cần thay | ✅ Xong |
| **1 — Khung sườn** | Bỏ `h-[90vh]`→auto-height; rút ngắn `<h1>` 1 bậc; xoá 2 CTA cũ; dựng panel kính mờ thật (border/padding/radius) chứa dải logo | ✅ Xong |
| **2 — Search lớn (P0) + Liên hệ tư vấn** | `SearchBox` thêm `variant="hero"` (icon trái + nút mũi tên tròn); "Liên hệ tư vấn" quay lại với href thật `/lien-he`, đặt ở vị trí P4 | ✅ Xong |
| **3 — Chip + "Xem tất cả sản phẩm" (P1)** | 6 chip từ `shopCategories` (top SKU thật) link thẳng danh mục (Phương án A); "Xem tất cả sản phẩm" tách dòng riêng để luôn thấy được kể cả khi chưa cuộn hết chip | ✅ Xong |
| **4 — Tab switcher (P2)** | 3 tab Danh mục/Giải pháp/Thương hiệu, data thật từ `nav-data.ts`, state viết riêng trong `hero.tsx` (không import chéo `protocol-categories.tsx`) | ✅ Xong (1 điểm lệch khỏi plan gốc — xem bảng dưới) |
| **5 — Responsive & thiết bị pass cuối** | Thêm `max-w-2xl` riêng cho ô search (mục 6.6); quét 320→1920px, mobile landscape, `prefers-reduced-motion` — không tràn ngang, không lỗi console ở mọi mốc | ✅ Xong |
| **6 — Dọn dẹp & bàn giao** | Gỡ 2 comment còn nhắc "Stage N" (dấu vết quá trình build, sẽ rot theo thời gian), viết lại theo hướng giải thích kiến trúc hiện tại; `tsc --noEmit` + `next lint` + `next build` đều sạch | ✅ Xong |

**2 điểm lệch khỏi bản plan gốc, có lý do rõ trong code:**

| Đề xuất ban đầu (mục 4.3) | Thực tế lên code | Vì sao đổi |
|---|---|---|
| Tái dùng animation trượt `translateX` như `protocol-categories.tsx` | Dùng `hidden` ẩn/hiện trực tiếp, không trượt | 3 tab có số ô rất khác nhau (6/4/8), cơ chế trượt cần 1 chiều cao "stage" cố định chứa cả 3 panel chồng nhau → sẽ để dư khoảng trắng lớn ở 2 tab ít ô hơn, ngược mục tiêu Hero gọn. Vẫn giữ đủ ARIA tablist/tab/tabpanel + toàn bộ nội dung nằm trong DOM (chỉ ẩn, không unmount) cho SEO. |
| Không nói rõ icon bên nào cho search hero | Icon search bên TRÁI + nút mũi tên tròn bg-accent bên phải (nav giữ nguyên icon phải, không nút) | Tạo khác biệt thị giác chủ ý giữa ô search hero (hành động chính) và ô search nav (phụ), giống pattern Lovable/v0/ChatGPT — khớp tinh thần mục 2 (nguyên tắc thiết kế #1) dù chưa ghi chi tiết ở bản đầu. |

**Việc còn treo, chưa làm ở Phase 1 (đúng theo phạm vi đã chốt):**
- Phương án A/B/C mục 8 (giữ/xoá `ProtocolCategories`/`ShopByCategory`) — vẫn giữ nguyên cả 2, chưa đánh giá lại.
- Nội dung `solutions` (tab Giải pháp) vẫn chưa được sales/marketing xác nhận chính thức (câu hỏi 5, mục 10) — đã lên hiển thị nhưng cần đối chiếu lại nếu sales phản hồi khác.
- Chip gợi ý vẫn suy từ SKU count, chưa nối dữ liệu truy vấn tìm kiếm thật (GSC/GA4).
- Icon-tile danh mục/giải pháp vẫn là icon Phosphor, chưa có ảnh chụp thật.

Xem Phase 2/3 gốc ở trên (mục này không đổi) cho việc còn lại sau khi có số liệu thực tế.

---

**Phase 1 đã lên code xong, đã build/lint/typecheck sạch — sẵn sàng để bạn xem trực tiếp trên trang chủ.**

# Kế hoạch: Mega Menu full-screen cho Navbar

**Ngày:** 2026-09-04
**Trạng thái:** **ĐÃ DUYỆT HƯỚNG THIẾT KẾ** (full-screen overlay — xem artifact prototype đã duyệt: "KNXStore Mega Menu", 🧭). File này giờ là **kế hoạch triển khai** — chia Phase, checklist theo file, còn 3 câu hỏi cần chốt ở mục 9 trước khi tôi bắt đầu sửa code thật (theo quy tắc xác nhận trước khi viết code).
**Phạm vi:** `src/components/nav/navbar.tsx` (xoá `NavDropdown` + `MobileGroup`), `src/components/nav/nav-data.ts` (mở rộng data — Phase B), thêm mới `src/components/nav/mega-menu.tsx`. Không đụng `hero.tsx`.

---

## 1. Bối cảnh

Navbar hiện có 3 dropdown độc lập (`NavDropdown`, `navbar.tsx:337-445`), hover mở, list dọc tối đa 8 mục, không tìm kiếm/lọc — trong khi catalog thật lớn hơn nhiều bản rút gọn đang hiện:

| Dropdown | Đang hiện | Thực tế | Vấn đề |
|---|---|---|---|
| Danh mục sản phẩm | 6 nhóm gộp | **79 category thô** (`nav-data.ts:17-19`) | Muốn vào thẳng 1 category con phải rời nav, qua trang rồi lọc tiếp |
| Thương hiệu | 8/68 brand | 68 brand thật | Brand ngoài top-8 không có cách nào tìm từ nav |
| Giải pháp | 4/4 mục | 4 mục (đã đủ) | Không cần "xem toàn bộ" |

Bạn đã duyệt hướng: **mega menu full-screen** (phủ kín màn hình dưới header sticky, không phải dropdown nhỏ) — xem artifact đã xem qua và chốt "được đó".

---

## 2. Quyết định thiết kế đã chốt (khớp artifact đã duyệt)

1. **Giữ 3 nhãn nav** ("Danh mục sản phẩm", "Giải pháp", "Thương hiệu") — không gộp thành 1 nhãn mơ hồ. Nhãn rõ nghĩa giúp khách kỹ thuật bấm đúng ý ngay.
2. **Cả 3 mở CHUNG 1 overlay full-screen** (`MegaMenu`) — phủ từ mép dưới header (64px) xuống hết viewport, đè lên toàn bộ nội dung trang (scrim mờ + khoá scroll body). Bên trong overlay có tab-switcher để đổi giữa 3 nhóm mà **không cần đóng lại**.
3. **Header vẫn hiện** khi menu mở (logo, giỏ hàng, tài khoản) — giữ phương hướng, không làm khách thấy "lạc trang". Đóng bằng nút X, click ra ngoài (scrim), hoặc `Esc`.
4. **2 chế độ trong mỗi tab** (trừ "Giải pháp"):
   - **Compact** (mặc định) — lưới ô lớn 3 cột, icon + mô tả ngắn + số lượng, quét nhanh.
   - **Toàn bộ** (bật bằng switch toggle ở rail trái) — hiện ô tìm kiếm, lọc tức thời, danh sách đầy đủ chia theo nhóm cha (danh mục) hoặc lưới dày hơn (thương hiệu).
5. **Tab "Giải pháp"** không có toggle (4/4 mục đã đủ) — layout 4 thẻ lớn, có mô tả, không rail điều hướng phụ.
6. **Rail trái** (danh mục): 6 nút nhảy nhanh tới từng nhóm — bấm sẽ tự bật chế độ Toàn bộ và cuộn tới đúng section.
7. **Mobile dùng CHUNG 1 component** với desktop — bỏ luôn `MobileGroup`/accordion riêng (xem mục 5, đổi so với bản kế hoạch trước). Hamburger mở đúng overlay này, chỉ khác breakpoint: rail chuyển thành hàng ngang cuộn được, lưới co còn 2/1 cột.

→ Mockup layout chi tiết + toàn bộ hành vi tương tác: **xem artifact đã publish**, không lặp lại ASCII ở đây nữa (tránh 2 nguồn ngoài đồng bộ — artifact là bản đặc tả hình ảnh, file này là kế hoạch triển khai).

---

## 3. Vì sao gộp luôn mobile — thay đổi so với bản kế hoạch trước

Bản đầu (trước khi có artifact) định giữ `MobileGroup` accordion riêng cho mobile. Sau khi dựng overlay full-screen, nhận ra: **mobile hiện tại vốn đã là "full-screen panel"** (`navbar.tsx:277-314`, `Reveal show={mobileOpen}`) — cùng bản chất với overlay mới, chỉ khác CSS layout (accordion dọc thay vì tab+grid). Dùng 1 component `MegaMenu` cho cả 2 breakpoint qua responsive CSS (giống cách artifact đã làm — rail chuyển hướng bằng media query, không đổi cấu trúc DOM) giúp:

- Không phải duy trì 2 hệ animation khác nhau (grid-rows cho desktop dropdown cũ, max-height cho `MobileGroup`) — 1 overlay, 1 kiểu transition.
- Tìm kiếm/lọc hoạt động y hệt trên mobile (hiện tại `MobileGroup` không có ô tìm kiếm nội bộ — chỉ liệt kê phẳng).
- Sửa 1 nơi là đồng bộ cả 2 breakpoint, đúng tinh thần "gộp lại" bạn yêu cầu từ đầu.

Đánh đổi: `MegaMenu` phải tự lo layout responsive kỹ hơn (rail ngang cuộn được, lưới co cột) — artifact đã chứng minh việc này khả thi (đã có `@media (max-width: 880px)` trong bản prototype).

---

## 4. ⚠️ Khoảng trống dữ liệu — vẫn chặn Phase B

Chế độ **Toàn bộ** cần 2 tập dữ liệu `nav-data.ts` **chưa có**:

1. **79 category thô**, mỗi cái gắn 1 trong 6 nhóm cha (`CategoryGroupKey`) — hiện `productCategories.items` chỉ có 6 phần tử (chính 6 nhóm cha).
2. **68 brand đầy đủ** (tên, href, SKU) — hiện `topBrands.items` chỉ có top 8.

Không tự bịa — nguồn đúng là MCP `KNXStore_Blog` (`get_products`), đã dùng để lấy 6 nhóm + top-8 brand (`nav-data.ts:17-19`). Cần query lại lấy full list trước khi Toàn bộ hiển thị đúng nghĩa "toàn bộ". Artifact demo phần này bằng chip minh hoạ + ô "chưa có dữ liệu" — **không đưa data minh hoạ đó vào code thật**.

---

## 5. Kế hoạch triển khai theo Phase

### Phase A — Component + interaction, data tạm dùng bản rút gọn hiện có

Mục tiêu: `MegaMenu` chạy đúng 100% hành vi đã duyệt trong artifact (tab switch, toggle compact/toàn bộ, search filter, đóng bằng X/scrim/Esc, responsive mobile), nhưng nội dung "Toàn bộ" tạm dùng đúng 6 category + 8 brand đang có (không có chip subcategory minh hoạ giả — phần đó chỉ tồn tại trong artifact để demo bố cục, KHÔNG đưa vào code thật vì sẽ là data bịa).

| # | Việc | File |
|---|---|---|
| A1 | Tạo `MegaMenu` — nhận `open`, `activeTab`, `onClose`, `onTabChange`; tự quản lý state `mode: "compact" \| "all"` theo tab, state `query` | `src/components/nav/mega-menu.tsx` (mới) |
| A2 | Panel "Danh mục sản phẩm" — grid compact 6 ô (tái dùng `categoryIcon`, `categoryGroupShortLabel`, `productCategories.items`); chế độ Toàn bộ tạm = liệt kê phẳng 6 mục đó (không chia section giả) | cùng file |
| A3 | Panel "Giải pháp" — grid 4 thẻ, không toggle | cùng file |
| A4 | Panel "Thương hiệu" — grid compact 8 brand; chế độ Toàn bộ tạm = 8 brand đó + dòng ghi chú "68 brand — đang chờ đồng bộ dữ liệu đầy đủ" (không vẽ ô ghost giả số lượng 68 như artifact, vì đó là minh hoạ hình ảnh, không phải nội dung production) | cùng file |
| A5 | Search filter dùng `normalizeSearchText()` (`search-data.ts`) — lọc trên data thật đang có, không lọc trên chip minh hoạ | cùng file |
| A6 | Overlay shell: scrim, khoá scroll body khi mở (`document.body.style.overflow`), focus trap cơ bản (focus vào ô search khi mở/bật Toàn bộ, trả focus về nút nav khi đóng), `Esc` để đóng, `aria-modal`, `role="dialog"` | cùng file |
| A7 | Responsive: rail ngang cuộn dưới `880px` hoặc breakpoint Tailwind tương đương (`lg`?), lưới co cột theo `sm`/`md`/`lg` — dùng token spacing/breakpoint sẵn có của site, không hardcode px như bản artifact | cùng file |
| A8 | Sửa `navbar.tsx`: xoá `NavDropdown` (dòng 337-445) và `MobileGroup` (dòng 447-510); 3 nav item desktop + hamburger mobile đều gọi `<MegaMenu>` dùng chung, truyền `activeTab` theo nhãn vừa bấm/hover | `navbar.tsx` |
| A9 | `tsc --noEmit` + kiểm tra thủ công (đóng/mở, đổi tab, toggle, search, Esc, resize xuống mobile width) | — |

### Phase B — Data thật

| # | Việc |
|---|---|
| B1 | Query MCP `KNXStore_Blog` (`get_products` hoặc tool taxonomy phù hợp) lấy đủ 79 category con + nhóm cha tương ứng |
| B2 | Query lấy đủ 68 brand (tên, href, số SKU) |
| B3 | Đổ vào `nav-data.ts` — mở rộng `NavGroupItem`/`productCategories`/`topBrands`, giữ nguyên field cũ (không breaking change cho nơi khác đang import, vd `Hero`, `product-highlights.tsx`) |
| B4 | Bật lại chế độ Toàn bộ với data thật thay bản rút gọn tạm ở Phase A |

---

## 6. Hành vi tương tác (tham chiếu nhanh — chi tiết đầy đủ xem artifact)

| Hành động | Kết quả |
|---|---|
| Click 1 trong 3 nhãn nav (đóng → mở) | Mở overlay full-screen, đúng tab tương ứng, chế độ Compact |
| Click lại đúng nhãn đang mở | Đóng overlay (toggle) |
| Click tab khác trong overlay đang mở | Đổi nội dung, không đóng |
| Bật switch "Toàn bộ" | Chuyển chế độ, auto-focus ô search |
| Gõ vào ô search | Lọc tức thời; nếu đang Compact thì tự bật Toàn bộ |
| `Esc` / click scrim / nút X | Đóng overlay, trả focus về nút nav |
| Hamburger mobile | Mở đúng overlay này (không còn `Reveal` accordion riêng) |

---

## 7. Component/file bị ảnh hưởng

| File | Thay đổi |
|---|---|
| `src/components/nav/mega-menu.tsx` (mới) | Toàn bộ overlay — thay `NavDropdown` + `MobileGroup` |
| `src/components/nav/navbar.tsx` | Xoá `NavDropdown`/`MobileGroup`; 3 nav item + hamburger cùng trigger `MegaMenu`; giữ nguyên logic collapse-on-scroll của Row 2 (không đụng) |
| `src/components/nav/nav-data.ts` | Phase B: thêm category con + mở rộng brand — field mới, không đổi field cũ |
| `src/components/nav/search-data.ts` | Không đổi, chỉ import `normalizeSearchText` vào `mega-menu.tsx` |

---

## 8. QA checklist trước khi coi Phase A xong

- [ ] `tsc --noEmit` sạch
- [ ] Bàn phím: Tab tới nhãn nav → Enter mở → Tab qua lại giữa các tab/switch/search hoạt động, không kẹt focus ngoài overlay
- [ ] `Esc` đóng từ bất kỳ đâu trong overlay, trả focus đúng nút vừa mở
- [ ] Resize desktop → mobile width: rail chuyển ngang, lưới co cột, không tràn ngang trang
- [ ] Body không cuộn được khi overlay mở (kể cả trên mobile, chạm kéo)
- [ ] `prefers-reduced-motion`: tắt animation trượt/slide, chuyển trạng thái tức thời
- [ ] Không còn text/data minh hoạ giả nào lọt vào code thật (chip subcategory, brand ghost) — chỉ dùng đúng data hiện có trong `nav-data.ts`

---

## 9. Câu hỏi cần chốt trước khi bắt đầu Phase A

1. **Bắt đầu code Phase A ngay trong lượt này** (UI/interaction hoàn chỉnh, Toàn bộ tạm dùng data rút gọn hiện có, không data giả) — đúng không?
2. **Phase B** — làm ngay sau Phase A trong cùng phiên, hay để riêng 1 lượt khác sau khi bạn duyệt UI Phase A chạy thật trên site?
3. **Tên nút toggle** trong code thật: "Xem toàn bộ" hay theo đúng `viewAllLabel` đang có sẵn mỗi group (vd "Xem tất cả danh mục") để khỏi tạo 2 cách gọi khác nhau cho cùng 1 ý?

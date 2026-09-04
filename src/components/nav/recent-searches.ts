/**
 * "Lịch sử sản phẩm đã search" — lưu client-side (localStorage), vì site chưa có tài khoản/
 * backend để lưu lịch sử theo user thật. Chỉ lưu DANH SÁCH ID (không lưu full snapshot tên/
 * giá/ảnh) — nơi hiển thị (hero.tsx) tự tra lại record mới nhất từ `searchProducts`
 * (search-data.ts) theo từng id, tránh hiện dữ liệu cũ/lệch nếu catalog đổi sau này.
 *
 * Ghi vào lúc nào: `search-box.tsx` gọi `recordSearchClick(id)` đúng lúc khách BẤM vào 1 kết
 * quả gợi ý cụ thể (không tính lúc gõ chữ, không tính bấm "Xem tất cả kết quả cho ...") — đúng
 * nghĩa "sản phẩm đã search" (khách chủ động chọn), không phải mọi từ khoá đã gõ.
 *
 * Đọc qua `useSyncExternalStore` (hero.tsx) thay vì `useEffect` + `setState` — localStorage
 * không tồn tại lúc SSR nên phải tách snapshot server (luôn rỗng) / client (đọc thật), và
 * `useSyncExternalStore` xử lý đúng bài toán này theo chuẩn React mà KHÔNG cần setState đồng
 * bộ trong effect (tránh lint react-hooks/set-state-in-effect, cùng tinh thần "tính trong lúc
 * render thay vì effect" mà reveal.tsx/mega-menu.tsx đã áp dụng cho case props-driven).
 * `getSnapshot` PHẢI trả về cùng 1 tham chiếu mảng nếu nội dung localStorage không đổi — nếu
 * không, React coi là "đã đổi" ở mọi lần gọi và render lặp vô ích (không dừng hẳn vì
 * useSyncExternalStore có bảo vệ, nhưng vẫn lãng phí) — cache theo đúng chuỗi raw đọc được.
 *
 * Sự kiện đổi dữ liệu: "storage" chuẩn của browser CHỈ bắn sang tab/cửa sổ KHÁC, không bắn lại
 * cho chính tab vừa ghi — `recordSearchClick` không cần báo lại (ghi xong là điều hướng sang
 * trang khác luôn, Hero mount lại từ đầu khi quay về). Nhưng `clearRecentSearches` thì khách
 * BẤM NGAY TRÊN trang đang mở (nút "Xoá lịch sử" ở hero.tsx) và cần thấy cập nhật tức thì
 * TRONG CÙNG tab đó — nên phát thêm 1 CustomEvent nội bộ, `subscribeRecentSearches` lắng nghe
 * cả 2 nguồn.
 */

const STORAGE_KEY = "knxstore:recent-search-products";
const MAX_ENTRIES = 8;
const CHANGE_EVENT = "knxstore:recent-searches-changed";

const EMPTY_IDS: number[] = [];
let cachedRaw: string | null | undefined;
let cachedIds: number[] = EMPTY_IDS;

function readIds(): number[] {
  if (typeof window === "undefined") return EMPTY_IDS;
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // localStorage bị chặn (private mode, quota...) — coi như chưa có lịch sử.
    raw = null;
  }
  if (raw === cachedRaw) return cachedIds; // nội dung không đổi → giữ nguyên tham chiếu cũ
  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cachedIds = Array.isArray(parsed)
      ? parsed.filter((entry): entry is number => typeof entry === "number")
      : EMPTY_IDS;
  } catch {
    cachedIds = EMPTY_IDS;
  }
  return cachedIds;
}

export function getRecentSearchIdsSnapshot(): number[] {
  return readIds();
}

export function getRecentSearchIdsServerSnapshot(): number[] {
  return EMPTY_IDS;
}

export function subscribeRecentSearches(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

export function recordSearchClick(id: number): void {
  if (typeof window === "undefined") return;
  try {
    const withoutDuplicate = readIds().filter((existingId) => existingId !== id);
    const next = [id, ...withoutDuplicate].slice(0, MAX_ENTRIES);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Không phải luồng thiết yếu (điều hướng tới trang sản phẩm mới là chính) — bỏ qua lỗi
    // ghi localStorage thay vì làm gãy click của khách.
  }
}

/** Khách bấm nút "Xoá lịch sử" (hero.tsx) — xoá NGAY trên trang đang mở nên phải tự báo qua
 * CustomEvent (xem comment đầu file), không thể chỉ trông chờ "storage" (không bắn lại chính
 * tab này). */
export function clearRecentSearches(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // bỏ qua — dispatch event dưới đây vẫn chạy để UI tự đọc lại (readIds sẽ trả rỗng dù xoá
    // localStorage thất bại, vì lần đọc kế tiếp coi raw=null nếu getItem cũng lỗi tương tự).
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

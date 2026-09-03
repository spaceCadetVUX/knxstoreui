import { searchProducts, type SearchProduct } from "@/components/nav/search-data";

export type StockStatus = "in-stock" | "backorder";

export type HighlightProduct = SearchProduct & {
  /** null = giá liên hệ (price === 0) — chưa công bố tồn kho cho SKU dạng báo giá. */
  stock: StockStatus | null;
};

// Chọn 8 SKU thật trong searchProducts (KHÔNG chép lại tên/giá/brand — lấy nguyên object gốc)
// để dàn trải đủ giao thức (Casambi/HVAC/An ninh/KNX/Matter/Cảm biến) và cả 2 trạng thái giá
// (có giá / liên hệ báo giá), demo được các state thật UI cần xử lý.
const HIGHLIGHT_IDS = [6, 42, 472, 72, 40, 2, 117, 5];

// TODO khi có nguồn tồn kho thật (Supabase lienminh-inventory?): thay STOCK_BY_ID bằng dữ liệu
// tồn kho thật, có thể theo thời gian thực. Hiện tại là MOCK TĨNH — chỉ để demo 2 trạng thái UI
// (còn hàng giao 24h / hàng đặt trước 5-7 ngày), không phải số liệu tồn kho thật của bất kỳ SKU
// nào trong danh sách dưới đây.
const STOCK_BY_ID: Record<number, StockStatus | null> = {
  6: "in-stock",
  42: "in-stock",
  472: "in-stock",
  72: "in-stock",
  40: "in-stock",
  2: "in-stock",
  117: "backorder",
  5: null,
};

function getSearchProduct(id: number): SearchProduct {
  const product = searchProducts.find((p) => p.id === id);
  if (!product) {
    throw new Error(`product-highlights-data: id ${id} không tồn tại trong searchProducts`);
  }
  return product;
}

export const highlightProducts: HighlightProduct[] = HIGHLIGHT_IDS.map((id) => ({
  ...getSearchProduct(id),
  stock: STOCK_BY_ID[id] ?? null,
}));

/** "SP-000006" — suy từ id, KHÔNG phải mã SKU thật trong ERP/hệ thống kho (chưa có trường này
 * trong catalog). Thay bằng mã thật khi có nguồn dữ liệu tương ứng. */
export function skuOf(id: number): string {
  return `SP-${String(id).padStart(6, "0")}`;
}

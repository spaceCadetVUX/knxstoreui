"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Check,
  CheckCircle,
  Clock,
  DownloadSimple,
  Minus,
  Plus,
  ShoppingCart,
  XCircle,
  type Icon,
} from "@phosphor-icons/react";
import { formatPriceVnd } from "@/components/nav/search-data";
import type { StockStatus } from "@/components/product/product-card";
import type { ProductDetail } from "@/components/product/product-data";
import { DeviceDimensions, DeviceFrontView, DeviceWiring } from "./product-illustrations";

// MOCKUP — SP này đang chưa niêm yết giá thật (product.price = 0, xem product-data.ts, trạng
// thái "backorder — hàng đặt theo dự án"). 2 số dưới đây CHỈ để dựng giao diện giá + giảm giá,
// KHÔNG phải giá thật — thay bằng giá/chiết khấu chính thức khi có báo giá từ Loxone/NPP.
const MOCK_ORIGINAL_PRICE = 2_890_000;
const MOCK_SALE_PRICE = 2_450_000;

const STOCK_LABEL: Record<StockStatus, string> = {
  "in-stock": "Có sẵn",
  backorder: "Đặt trước",
  "out-of-stock": "Hết hàng",
};

// Icon + chữ màu (không khung/nền pill) — rõ nghĩa hơn chấm tròn ở cái nhìn đầu, hợp phong cách
// thông tin thuần cho audience kỹ sư/B2B hơn là badge kiểu "khuyến mãi". Màu giữ đúng semantic đã
// dùng ở product-card.tsx (success/pending/muted).
const STOCK_ICON: Record<StockStatus, Icon> = {
  "in-stock": CheckCircle,
  backorder: Clock,
  "out-of-stock": XCircle,
};

const STOCK_TEXT: Record<StockStatus, string> = {
  "in-stock": "text-success",
  backorder: "text-pending",
  "out-of-stock": "text-muted-foreground",
};

type GalleryView = "front" | "dims" | "wiring";

/**
 * Gallery + buybox trang chi tiết sản phẩm — gộp 1 file vì 2 nửa dùng chung state màu biến thể
 * (`variantIndex`): đổi màu ảnh hưởng cả SVG mặt trước lẫn tên/SKU hiển thị bên buybox. Cùng lý
 * do gộp carousel+card trong `product-highlights.tsx`.
 *
 * "use client" vì cần state (activeView, variantIndex) — import icon @phosphor-icons/react bản
 * top-level AN TOÀN ở đây, xem ghi chú tương tự trong product-highlights.tsx.
 */
export function ProductHero({ product }: { product: ProductDetail }) {
  const [activeView, setActiveView] = useState<GalleryView>("front");
  const [variantIndex, setVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const variant = product.variants[variantIndex];
  const hasPrice = product.price > 0;

  useEffect(() => {
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, []);

  // Mockup — chưa có cart/checkout thật trên site (giống handleAddToCart trong product-card.tsx),
  // bấm chỉ đổi trạng thái nút, KHÔNG lưu giỏ hàng. Hiện luôn bất kể hasPrice (khác quy tắc ẩn
  // cart khi chưa có giá ở product-card.tsx) — SP cần báo giá theo dự án thì giỏ hàng đóng vai trò
  // "yêu cầu báo giá" thay vì mua trực tiếp, theo yêu cầu.
  const handleAddToCart = () => {
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1600);
  };

  return (
    <section className="mx-auto max-w-[var(--container-max)] px-4 pb-10 pt-4 md:px-8 lg:px-16 lg:pb-14">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[44%_1fr] lg:gap-14">
        {/* ---------- gallery ---------- */}
        <div className="flex flex-col gap-3.5">
          <div className="relative flex aspect-square items-center justify-center rounded-2xl border border-border bg-card p-7 shadow-sm">
            <span className="absolute left-3.5 top-3.5 rounded-full bg-foreground/80 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-card">
              Loxone Tree
            </span>
            {activeView === "front" && (
              <DeviceFrontView panelColor={variant.panelColor} inkColor={variant.inkColor} />
            )}
            {activeView === "dims" && <DeviceDimensions />}
            {activeView === "wiring" && <DeviceWiring />}
          </div>

          <div className="flex gap-2.5" role="tablist" aria-label="Chọn hình minh hoạ">
            <GalleryThumb label="Mặt trước" active={activeView === "front"} onClick={() => setActiveView("front")}>
              <DeviceFrontView panelColor={variant.panelColor} inkColor={variant.inkColor} />
            </GalleryThumb>
            <GalleryThumb label="Kích thước" active={activeView === "dims"} onClick={() => setActiveView("dims")}>
              <DeviceDimensions />
            </GalleryThumb>
            <GalleryThumb label="Sơ đồ đấu nối" active={activeView === "wiring"} onClick={() => setActiveView("wiring")}>
              <DeviceWiring />
            </GalleryThumb>
          </div>
        </div>

        {/* ---------- buybox ---------- */}
        <div className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {product.brand}
            </span>
            <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
              {product.categoryLabel}
            </span>
          </div>

          <h1 className="text-balance text-[30px] font-bold leading-tight tracking-tight text-foreground">
            {product.name}
          </h1>
          <p className="max-w-[52ch] text-[15.5px] text-muted-foreground">{product.tagline}</p>

          {/* Nhóm thuộc tính biến thể — dạng label + hàng nút chữ nhật (không phải chấm màu tròn),
              để mở rộng được cho nhiều nhóm thuộc tính sau này (vd "Chất liệu") khi có data thật.
              Hiện sản phẩm chỉ có 1 nhóm thật — "Màu sắc" — lấy đúng từ product.variants, KHÔNG
              bịa thêm màu/chất liệu không có trong datasheet. Active dùng --accent (xanh) để nhất
              quán với tab/focus ring/swatch toàn site, không copy viền đen trung tính tham khảo. */}
          {/* Mã SP hiện luôn (không phụ thuộc số biến thể) — biến thể chỉ ảnh hưởng SKU nào hiển
              thị, không phải việc SKU có hiển thị hay không. */}
          <span className="text-[13px] text-muted-foreground">
            SKU: <span className="tabular-nums font-semibold text-foreground">{variant.sku}</span>
          </span>

          {product.variants.length > 1 && (
            <div className="flex flex-col gap-1.5 pt-0.5">
              <span className="text-[13.5px] font-semibold text-foreground">Màu sắc</span>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Chọn màu">
                {product.variants.map((v, i) => {
                  const shortLabel = v.name.split(" (")[0];
                  const active = i === variantIndex;
                  return (
                    <button
                      key={v.sku}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      aria-label={v.name}
                      onClick={() => setVariantIndex(i)}
                      className={`rounded-lg border-[1.5px] px-3.5 py-2 text-[13.5px] font-semibold transition-colors ${
                        active
                          ? "border-accent text-accent"
                          : "border-border text-muted-foreground hover:border-accent/50"
                      }`}
                    >
                      {shortLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {hasPrice ? (
            <div className="pt-1">
              <div className="text-2xl font-bold tabular-nums text-foreground">
                {formatPriceVnd(product.price)}
              </div>
              <div className="mt-0.5 text-[13px] text-muted-foreground">Giá đã bao gồm VAT</div>
            </div>
          ) : (
            <div className="pt-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-2xl font-bold tabular-nums text-foreground">
                  {formatPriceVnd(MOCK_SALE_PRICE)}
                </span>
                <span className="text-[15px] font-medium tabular-nums text-muted-foreground line-through">
                  {formatPriceVnd(MOCK_ORIGINAL_PRICE)}
                </span>
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">
                  -{Math.round((1 - MOCK_SALE_PRICE / MOCK_ORIGINAL_PRICE) * 100)}%
                </span>
              </div>
              <div className="mt-0.5 text-[13px] text-muted-foreground">Giá đã bao gồm VAT</div>
            </div>
          )}

          {/* Số lượng + thêm giỏ hàng — mockup, xem ghi chú handleAddToCart phía trên. Style tái sử
              dụng đúng pattern stepper/nút giỏ của product-card.tsx, chỉ phóng lên kích thước CTA
              của buybox (h-[46px]/rounded-xl thay vì h-10/rounded-[10px] của card). */}
          <div className="flex items-center gap-2.5">
            <div
              role="group"
              aria-label={`Số lượng ${product.name}`}
              className="flex h-[46px] w-[136px] shrink-0 items-center overflow-hidden rounded-xl border border-border"
            >
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Giảm số lượng"
                className="flex h-full w-11 items-center justify-center text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
              >
                <Minus size={16} weight="bold" aria-hidden="true" />
              </button>
              <output className="flex-1 text-center text-[15px] font-semibold tabular-nums">{quantity}</output>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                aria-label="Tăng số lượng"
                className="flex h-full w-11 items-center justify-center text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
              >
                <Plus size={16} weight="bold" aria-hidden="true" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={`Thêm ${product.name} vào giỏ`}
              className={`flex h-[46px] flex-1 items-center justify-center gap-2 rounded-xl px-6 text-[14.5px] font-semibold text-on-accent transition-[filter,background-color] duration-150 ease-out hover:brightness-110 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                added ? "bg-success" : "bg-accent"
              }`}
            >
              {added ? (
                <Check size={18} weight="bold" aria-hidden="true" />
              ) : (
                <ShoppingCart size={18} weight="bold" aria-hidden="true" />
              )}
              {added ? "Đã thêm vào giỏ" : "Thêm vào giỏ hàng"}
            </button>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {/* TODO: chưa có route/kênh liên hệ thật để gắn link (xem TODO tương tự "Liên hệ"
                trong footer.tsx) — trỏ tạm "#", thay bằng route thật hoặc Zalo deep-link khi có.
                Đổi sang style outline (thay vì solid bg-accent cũ) vì "Thêm vào giỏ hàng" giờ là
                CTA chính — 2 nút solid accent cạnh nhau sẽ tranh nhau độ ưu tiên thị giác. */}
            <a
              href="#"
              className="flex h-[46px] items-center justify-center gap-2 rounded-xl border border-accent px-6 text-[14.5px] font-semibold text-accent transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Liên hệ tư vấn
            </a>
            {product.datasheetUrl && (
              <a
                href={product.datasheetUrl}
                download
                className="flex h-[46px] items-center justify-center gap-2 rounded-xl border border-border px-6 text-[14.5px] font-semibold text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <DownloadSimple size={16} weight="bold" aria-hidden="true" />
                Tải Datasheet (PDF)
              </a>
            )}
          </div>

          {product.stock &&
            (() => {
              const StockIcon = STOCK_ICON[product.stock];
              return (
                <span className={`inline-flex w-fit items-center gap-1.5 text-[13.5px] font-semibold ${STOCK_TEXT[product.stock]}`}>
                  <StockIcon size={16} weight="fill" className="shrink-0" aria-hidden="true" />
                  {STOCK_LABEL[product.stock]}
                </span>
              );
            })()}
        </div>
      </div>
    </section>
  );
}

/**
 * Thumbnail = ảnh preview thu nhỏ THẬT (render lại đúng component minh hoạ ở kích thước nhỏ),
 * không phải icon rời + nhãn như bản trước — khớp đúng kiểu gallery ảnh sản phẩm thông thường
 * (khung viền đậm quanh ảnh đang chọn). Viền chọn dùng --accent (xanh) theo đúng quy ước
 * "trạng thái active" đã dùng nhất quán toàn site (tab, focus ring, swatch màu) — không copy màu
 * viền đen trung tính của trang tham khảo, ưu tiên nhất quán với hệ thống của KNXStore.
 */
function GalleryThumb({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-label={label}
      onClick={onClick}
      className={`flex w-1/6 flex-none flex-col items-center gap-1.5 rounded-xl border-[1.5px] bg-card p-2 transition-colors ${
        active ? "border-accent" : "border-border hover:border-accent/50"
      }`}
    >
      <div className="aspect-square w-full">{children}</div>
    </button>
  );
}

"use client";

import { useState } from "react";
import {
  Broadcast,
  CirclesThreePlus,
  DownloadSimple,
  Image as ImageIcon,
  Info,
  Lightning,
  Ruler,
  ShieldCheck,
  TreeStructure,
  type Icon,
} from "@phosphor-icons/react";
import { formatPriceVnd } from "@/components/nav/search-data";
import type { StockStatus } from "@/components/product/product-card";
import type { ProductDetail, SpecChipIcon } from "@/components/product/product-data";
import { DeviceDimensions, DeviceFrontView, DeviceWiring } from "./product-illustrations";

const CHIP_ICON: Record<SpecChipIcon, Icon> = {
  power: Lightning,
  shield: ShieldCheck,
  nfc: Broadcast,
  bus: TreeStructure,
};

const STOCK_LABEL: Record<StockStatus, string> = {
  "in-stock": "Còn hàng",
  backorder: "Đặt trước — hàng đặt theo dự án",
  "out-of-stock": "Hết hàng",
};

const STOCK_DOT: Record<StockStatus, string> = {
  "in-stock": "bg-success",
  backorder: "bg-pending",
  "out-of-stock": "bg-muted-foreground",
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
  const variant = product.variants[variantIndex];
  const hasPrice = product.price > 0;

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
            <GalleryThumb
              icon={ImageIcon}
              label="Mặt trước"
              active={activeView === "front"}
              onClick={() => setActiveView("front")}
            />
            <GalleryThumb
              icon={Ruler}
              label="Kích thước"
              active={activeView === "dims"}
              onClick={() => setActiveView("dims")}
            />
            <GalleryThumb
              icon={CirclesThreePlus}
              label="Sơ đồ đấu nối"
              active={activeView === "wiring"}
              onClick={() => setActiveView("wiring")}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Hình minh hoạ dựng lại theo datasheet chính hãng (kích thước, sơ đồ đấu nối đúng tỉ
            lệ) — thay bằng ảnh chụp thật khi có hàng mẫu.
          </p>
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

          <ul className="flex flex-wrap gap-2">
            {product.specChips.map((chip) => {
              const ChipIcon = CHIP_ICON[chip.icon];
              return (
                <li
                  key={chip.label}
                  className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground"
                >
                  <ChipIcon size={14} weight="bold" className="shrink-0 text-accent" aria-hidden="true" />
                  {chip.label}
                </li>
              );
            })}
          </ul>

          {product.variants.length > 1 && (
            <div className="flex flex-wrap items-center gap-3 pt-0.5">
              <span className="text-[13.5px] text-muted-foreground">
                Màu: <strong className="text-foreground">{variant.name}</strong>
              </span>
              <div className="flex gap-2" role="radiogroup" aria-label="Chọn màu">
                {product.variants.map((v, i) => (
                  <button
                    key={v.sku}
                    type="button"
                    role="radio"
                    aria-checked={i === variantIndex}
                    aria-label={v.name}
                    onClick={() => setVariantIndex(i)}
                    className={`h-[26px] w-[26px] rounded-full ring-2 ring-offset-2 ring-offset-background transition-shadow ${
                      i === variantIndex ? "ring-accent" : "ring-border hover:ring-muted-foreground"
                    }`}
                    style={{ backgroundColor: v.panelColor }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="pt-1">
            {hasPrice ? (
              <>
                <div className="text-2xl font-bold tabular-nums text-foreground">
                  {formatPriceVnd(product.price)}
                </div>
                <div className="mt-0.5 text-[13px] text-muted-foreground">Giá chưa gồm VAT</div>
              </>
            ) : (
              <>
                <div className="text-[22px] font-bold text-foreground">Liên hệ báo giá</div>
                <div className="mt-0.5 text-[13px] text-muted-foreground">
                  Giá theo dự án / số lượng — hàng nhập khẩu chính hãng {product.brand}
                </div>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5">
            {/* TODO: chưa có route/kênh liên hệ thật để gắn link (xem TODO tương tự "Liên hệ"
                trong footer.tsx) — trỏ tạm "#", thay bằng route thật hoặc Zalo deep-link khi có. */}
            <a
              href="#"
              className="flex h-[46px] items-center justify-center gap-2 rounded-xl bg-accent px-6 text-[14.5px] font-semibold text-on-accent transition-[filter] duration-150 ease-out hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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

          <div className="flex flex-wrap items-center gap-4 text-[13px] text-muted-foreground">
            {product.stock && (
              <span className="flex items-center gap-1.5 font-semibold">
                <i className={`h-[7px] w-[7px] rounded-full ${STOCK_DOT[product.stock]}`} aria-hidden="true" />
                {STOCK_LABEL[product.stock]}
              </span>
            )}
            <span>
              Mã SP: <span className="tabular-nums">{variant.sku}</span>
            </span>
          </div>

          <div className="flex gap-2.5 rounded-lg border border-accent/25 border-l-[3px] border-l-accent bg-accent/5 px-3.5 py-3">
            <Info size={18} weight="bold" className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
            <p className="text-[13.5px] text-foreground">{product.compatibilityNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function GalleryThumb({
  icon: IconComponent,
  label,
  active,
  onClick,
}: {
  icon: Icon;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl border-[1.5px] px-1.5 py-2.5 text-[11.5px] font-semibold transition-colors ${
        active
          ? "border-accent text-accent"
          : "border-border text-muted-foreground hover:border-accent hover:text-accent"
      }`}
    >
      <IconComponent size={20} weight="bold" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

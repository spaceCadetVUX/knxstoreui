import { Cards, CreditCard, Cube, Drop, IdentificationCard, SquaresFour } from "@phosphor-icons/react/ssr";
// `Icon` là type thuần (import type bị erase lúc build, KHÔNG kéo runtime createContext của gói
// chính) — subpath /ssr không tự export lại type này nên phải lấy riêng từ gói gốc.
import type { Icon } from "@phosphor-icons/react";
import type { ProductDetail } from "@/components/product/product-data";

// Icon minh hoạ theo THỨ TỰ khai báo trong product-data.ts (accessories) — danh sách ngắn, cố
// định, không cần gắn key riêng trong data cho từng phụ kiện.
const ACCESSORY_ICONS: Icon[] = [IdentificationCard, CreditCard, Cards, Cube, Drop, SquaresFour];

export function ProductAccessories({ accessories }: { accessories: ProductDetail["accessories"] }) {
  return (
    <section className="mx-auto max-w-[var(--container-max)] px-4 pb-14 md:px-8 lg:px-16">
      <h2 className="mb-5 text-[22px] font-bold text-foreground">Phụ kiện tương thích</h2>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {accessories.map((accessory, i) => {
          const AccessoryIcon = ACCESSORY_ICONS[i % ACCESSORY_ICONS.length];
          return (
            <div
              key={accessory.name}
              className="flex flex-col gap-2.5 rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent"
            >
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-muted">
                <AccessoryIcon size={17} weight="bold" className="text-muted-foreground" aria-hidden="true" />
              </div>
              <div className="text-[13.5px] font-semibold leading-snug text-foreground">{accessory.name}</div>
              <div className="text-xs font-semibold tabular-nums text-muted-foreground">
                {accessory.price ?? "Xem báo giá"}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

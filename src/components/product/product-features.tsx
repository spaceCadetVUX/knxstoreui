import { Drop, Fingerprint, IdentificationCard, LockKey } from "@phosphor-icons/react/ssr";
// `Icon` là type thuần (import type bị erase lúc build, KHÔNG kéo runtime createContext của gói
// chính) — subpath /ssr không tự export lại type này nên phải lấy riêng từ gói gốc.
import type { Icon } from "@phosphor-icons/react";
import type { ProductDetail, ProductFeatureIcon } from "@/components/product/product-data";

// Server Component (không state) — PHẢI import icon qua subpath /ssr, không phải bản top-level
// (createContext) — xem ghi chú trong shop-by-category.tsx/brand-marquee.tsx.
const FEATURE_ICON: Record<ProductFeatureIcon, Icon> = {
  auth: Fingerprint,
  lock: LockKey,
  glass: Drop,
  encrypted: IdentificationCard,
};

export function ProductFeatures({ features }: { features: ProductDetail["features"] }) {
  return (
    <section className="mx-auto max-w-[var(--container-max)] px-4 pb-12 md:px-8 lg:px-16">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => {
          const FeatureIcon = FEATURE_ICON[feature.icon];
          return (
            <div
              key={feature.title}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-[22px] shadow-sm transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <FeatureIcon size={20} weight="bold" className="text-accent" aria-hidden="true" />
              </div>
              <h3 className="text-[15px] font-semibold text-foreground">{feature.title}</h3>
              <p className="text-[13.5px] text-muted-foreground">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

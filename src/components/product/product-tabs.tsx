"use client";

import { useId, useState } from "react";
import { Check } from "@phosphor-icons/react";
import type { ProductDetail } from "@/components/product/product-data";
import { DeviceWiring } from "./product-illustrations";

const TABS = [
  { key: "desc", label: "Mô tả chi tiết" },
  { key: "specs", label: "Thông số kỹ thuật" },
  { key: "install", label: "Lắp đặt & đấu nối" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/**
 * "use client" vì cần state chuyển tab — top-level @phosphor-icons/react AN TOÀN ở đây (giống
 * product-hero.tsx). `idBase` (useId) dùng nối aria-controls/aria-labelledby giữa nút tab và
 * panel — artifact preview chưa nối đủ 2 thuộc tính này, bổ sung ở bản code thật.
 */
export function ProductTabs({ product }: { product: ProductDetail }) {
  const [activeTab, setActiveTab] = useState<TabKey>("desc");
  const idBase = useId();

  return (
    <section className="mx-auto max-w-[var(--container-max)] px-4 pb-14 md:px-8 lg:px-16">
      <div className="flex gap-1 overflow-x-auto border-b border-border" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            id={`${idBase}-tab-${tab.key}`}
            aria-selected={activeTab === tab.key}
            aria-controls={`${idBase}-panel-${tab.key}`}
            onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap border-b-2 px-[18px] py-3 text-[14.5px] font-semibold transition-colors ${
              activeTab === tab.key
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${idBase}-panel-desc`}
        aria-labelledby={`${idBase}-tab-desc`}
        hidden={activeTab !== "desc"}
        className="flex max-w-[75ch] flex-col gap-3.5 pt-7 text-[15px]"
      >
        {product.description.map((paragraph, i) => (
          <p key={i} className="text-foreground">
            {paragraph}
          </p>
        ))}
        <h3 className="mt-1.5 text-base font-semibold text-foreground">Ứng dụng thường gặp</h3>
        <ul className="flex flex-col gap-2">
          {product.useCases.map((useCase) => (
            <li key={useCase} className="flex gap-2.5 text-[14.5px] text-foreground">
              <Check size={16} weight="bold" className="mt-0.5 shrink-0 text-success" aria-hidden="true" />
              {useCase}
            </li>
          ))}
        </ul>
      </div>

      <div
        role="tabpanel"
        id={`${idBase}-panel-specs`}
        aria-labelledby={`${idBase}-tab-specs`}
        hidden={activeTab !== "specs"}
        className="pt-7"
      >
        <div className="flex flex-col gap-7">
          {product.specGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-2.5 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
                {group.title}
              </h3>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full border-collapse">
                  <tbody>
                    {group.rows.map((row, i) => (
                      <tr key={row.label} className={i < group.rows.length - 1 ? "border-b border-border" : ""}>
                        <th
                          scope="row"
                          className="w-[44%] px-4 py-2.5 text-left text-sm font-normal text-muted-foreground"
                        >
                          {row.label}
                        </th>
                        <td className="px-4 py-2.5 text-left text-sm font-semibold tabular-nums text-foreground">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
        <p className="pt-4 text-[12.5px] text-muted-foreground">{product.specSource}</p>
      </div>

      <div
        role="tabpanel"
        id={`${idBase}-panel-install`}
        aria-labelledby={`${idBase}-tab-install`}
        hidden={activeTab !== "install"}
        className="pt-7"
      >
        <div className="grid grid-cols-1 gap-7 md:grid-cols-[42%_1fr]">
          <div className="rounded-2xl border border-border bg-card p-5">
            <DeviceWiring />
          </div>
          <div className="flex flex-col gap-3.5">
            {product.installSteps.map((step, i) => (
              <div key={step.title} className="flex gap-3">
                <span className="mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-foreground">
                  {i + 1}
                </span>
                <div>
                  <h4 className="text-[14.5px] font-bold text-foreground">{step.title}</h4>
                  <p className="text-[13.5px] text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

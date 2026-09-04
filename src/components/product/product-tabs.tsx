"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
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

  // Highlight active tab bằng 1 span trượt (đo offsetLeft/offsetWidth của nút đang chọn) thay vì
  // đổi bg/border ngay trên từng nút — mượt hơn hẳn vì có transition left/width thật sự, không
  // phải "nhảy" tức thì giữa 2 nút. useLayoutEffect để đo NGAY sau khi DOM cập nhật, tránh
  // nhấp nháy vị trí cũ trước khi paint.
  const tabRefs = useRef<Partial<Record<TabKey, HTMLButtonElement | null>>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const el = tabRefs.current[activeTab];
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    measure();
    // Đổi breakpoint (sm:flex/overflow-x-auto) hay resize cửa sổ đều có thể đổi vị trí nút.
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeTab]);

  return (
    <section className="mx-auto max-w-[var(--container-max)] px-4 pb-14 md:px-8 lg:px-16">
      {/* Segmented control — bớt bo tròn (rounded-xl/lg thay vì rounded-full kiểu viên thuốc) +
          tăng độ tương phản highlight cho tab active (border + shadow rõ hơn, không chỉ shadow-sm
          mờ nhạt). Highlight giờ là 1 span trượt mượt giữa các nút (xem indicator/useLayoutEffect
          phía trên) thay vì đổi màu nền tức thì. Căn giữa cụm (mx-auto, có tác dụng khi container
          co theo nội dung ở sm:w-fit) + kẻ ngang bên dưới hết chiều rộng section để phân tách với
          nội dung tab. */}
      <div className="mb-7 border-b border-border pb-5">
        <div
          className="relative mx-auto inline-flex w-full max-w-full gap-1 overflow-x-auto rounded-xl bg-muted p-1 sm:flex sm:w-fit"
          role="tablist"
        >
          {indicator && (
            <span
              aria-hidden="true"
              className="absolute inset-y-1 rounded-lg border border-border bg-card shadow-md transition-[left,width] duration-300 ease-out motion-reduce:transition-none"
              style={{ left: indicator.left, width: indicator.width }}
            />
          )}
          {TABS.map((tab) => (
            <button
              key={tab.key}
              ref={(el) => {
                tabRefs.current[tab.key] = el;
              }}
              type="button"
              role="tab"
              id={`${idBase}-tab-${tab.key}`}
              aria-selected={activeTab === tab.key}
              aria-controls={`${idBase}-panel-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`relative z-10 whitespace-nowrap rounded-lg px-[18px] py-2.5 text-[14.5px] font-semibold transition-colors ${
                activeTab === tab.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`${idBase}-panel-desc`}
        aria-labelledby={`${idBase}-tab-desc`}
        hidden={activeTab !== "desc"}
        className="flex max-w-[75ch] flex-col gap-3.5 text-[15px] animate-[tab-fade-in_250ms_ease-out] motion-reduce:animate-none"
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
        className="animate-[tab-fade-in_250ms_ease-out] motion-reduce:animate-none"
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
        className="animate-[tab-fade-in_250ms_ease-out] motion-reduce:animate-none"
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

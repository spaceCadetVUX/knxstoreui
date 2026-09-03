"use client";

import { useEffect, useRef, useState } from "react";
import {
  CaretLeft,
  CaretRight,
  Handshake,
  Headset,
  ShieldCheck,
  Star,
  Truck,
  type Icon,
} from "@phosphor-icons/react";

const SECTION_EYEBROW = "Giá trị";
const SECTION_TITLE = "Chúng tôi hướng đến";

/** Nội dung theo đúng định vị KNXStore: nhà phân phối chính hãng làm việc trực tiếp với
 * System Integrator/ME Contractor (B2B) và khách Matter Smarthome (B2C) — không dùng copy
 * ecommerce chung chung ("giao hàng siêu tốc", "giá tốt nhất"...). */
const values: { icon: Icon; title: string; description: string }[] = [
  {
    icon: Star,
    title: "Chính hãng",
    description:
      "Phân phối chính hãng KNX, DALI-2, Casambi, Matter và các giao thức BMS phổ biến — mọi sản phẩm có xuất xứ, CO/CQ rõ ràng.",
  },
  {
    icon: Headset,
    title: "Tư vấn kỹ thuật",
    description:
      "Đội ngũ kỹ sư hỗ trợ thiết kế topology, chọn thiết bị đúng nhu cầu cho System Integrator và ME Contractor ngay từ giai đoạn thiết kế.",
  },
  {
    icon: ShieldCheck,
    title: "Bảo hành chính hãng",
    description:
      "Thiết bị bảo hành theo chính sách của từng nhà sản xuất, hỗ trợ đổi trả và xử lý sự cố nhanh chóng.",
  },
  {
    icon: Truck,
    title: "Giao hàng toàn quốc",
    description:
      "Giao hàng trên toàn quốc, ưu tiên tiến độ cho công trình gấp và đơn hàng số lượng lớn.",
  },
  {
    icon: Handshake,
    title: "Đồng hành dài hạn",
    description:
      "Từ tư vấn thiết kế, cung cấp thiết bị đến hỗ trợ vận hành — đồng hành cùng đối tác trong suốt vòng đời dự án.",
  },
];

/**
 * "Chúng tôi hướng đến" — layout theo yêu cầu trực tiếp (đã duyệt qua ảnh preview): cột trái
 * (eyebrow + heading + 2 nút mũi tên) ĐỨNG YÊN, không cuộn theo track; chỉ track thẻ bên phải
 * cuộn ngang. Khác ProductHighlights (heading full-width phía trên, mũi tên nổi absolute đè
 * lên track) — ở đây mũi tên nằm tĩnh trong cột trái nên dùng nút thường, không absolute.
 */
export function ValueProps() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateArrows = () => {
      const maxScroll = track.scrollWidth - track.clientWidth - 1;
      setCanScrollPrev(track.scrollLeft > 0);
      setCanScrollNext(track.scrollLeft < maxScroll);
    };
    updateArrows();

    track.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      track.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const step = card ? card.getBoundingClientRect().width + 20 : track.clientWidth;
    track.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <section className="bg-card py-16 md:py-24">
      <div className="mx-auto flex max-w-[var(--container-max)] flex-col gap-8 px-4 md:flex-row md:items-center md:gap-12 md:px-8 lg:px-16">
        <div className="shrink-0 md:w-72 lg:w-80">
          <div className="text-[13px] font-medium uppercase tracking-[0.012em] text-muted-foreground">
            {SECTION_EYEBROW}
          </div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {SECTION_TITLE}
          </h2>

          <div className="mt-8 hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={!canScrollPrev}
              aria-label="Xem giá trị trước"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-[box-shadow,background-color] duration-150 ease-out hover:bg-muted hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-default disabled:opacity-35 disabled:shadow-sm disabled:hover:bg-card"
            >
              <CaretLeft size={18} weight="bold" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={!canScrollNext}
              aria-label="Xem giá trị tiếp theo"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card shadow-sm transition-[box-shadow,background-color] duration-150 ease-out hover:bg-muted hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-default disabled:opacity-35 disabled:shadow-sm disabled:hover:bg-card"
            >
              <CaretRight size={18} weight="bold" aria-hidden="true" />
            </button>
          </div>
        </div>

        <ul
          ref={trackRef}
          className="flex list-none gap-5 overflow-x-auto p-0 pr-4 [scroll-snap-type:x_mandatory] [scrollbar-width:none] md:pr-8 lg:pr-16 [&::-webkit-scrollbar]:hidden"
        >
          {values.map((value) => (
            <li
              key={value.title}
              className="flex w-72 shrink-0 flex-col gap-4 rounded-xl border border-border bg-card p-6 [scroll-snap-align:start] sm:w-80"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted text-accent">
                <value.icon size={22} weight="regular" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-semibold text-foreground">{value.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {value.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

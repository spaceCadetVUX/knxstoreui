"use client";

import { useEffect, useRef, useState } from "react";
import { CaretDown } from "@phosphor-icons/react";

const SECTION_TITLE = "Câu hỏi thường gặp";

const faqs: { question: string; answer: string }[] = [
  {
    question: "KNXStore cung cấp những loại thiết bị tự động hóa nào?",
    answer:
      "KNXStore phân phối thiết bị theo các giao thức KNX, DALI-2, DMX512, Casambi, BACnet, Modbus và Matter — bao gồm chiếu sáng, rèm/màn, điều hòa (HVAC), an ninh và thiết bị smarthome Matter cho nhà ở.",
  },
  {
    question: "KNXStore có hỗ trợ tư vấn thiết kế hệ thống không?",
    answer:
      "Có. Đội ngũ kỹ thuật hỗ trợ tư vấn topology, chọn thiết bị và bóc tách khối lượng cho System Integrator, ME Contractor và chủ đầu tư ngay từ giai đoạn thiết kế.",
  },
  {
    question: "Thiết bị KNXStore có bảo hành không?",
    answer:
      "Có, thiết bị được bảo hành theo chính sách của từng nhà sản xuất/hãng phân phối. Liên hệ KNXStore để biết thời hạn và điều kiện bảo hành cụ thể theo từng dòng sản phẩm.",
  },
  {
    question: "Khi mua hàng tại KNXStore có được hỗ trợ cấu hình thiết bị không?",
    answer:
      "Có. KNXStore hỗ trợ cấu hình/lập trình cơ bản cho thiết bị đã mua và hướng dẫn kỹ thuật viên thi công vận hành hệ thống.",
  },
  {
    question: "KNXStore phục vụ khu vực nào tại Việt Nam?",
    answer:
      "KNXStore phân phối và hỗ trợ kỹ thuật trên toàn quốc, làm việc trực tiếp với System Integrator, ME Contractor và chủ đầu tư ở mọi tỉnh thành.",
  },
  {
    question: "KNXStore có cung cấp giải pháp điều khiển máy lạnh (HVAC) không?",
    answer:
      "Có. KNXStore cung cấp thiết bị điều khiển máy lạnh VRV/VRF, điều hòa cục bộ và trung tâm, tích hợp trực tiếp vào hệ thống KNX/BMS qua các giao thức chuẩn.",
  },
];

export function Faq() {
  return (
    <section className="bg-card py-16 md:py-24">
      <div className="mx-auto max-w-[var(--container-max)] px-4 md:px-8 lg:px-16">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {SECTION_TITLE}
        </h2>

        <div className="mt-8 divide-y divide-border border-t border-border">
          {faqs.map((faq) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Accordion đo scrollHeight rồi animate max-height (px) thay vì grid-template-rows (fr) —
 * cùng kỹ thuật đã đổi ở MobileGroup (navbar.tsx) vì fr-unit chỉ engine hiện đại mới nội suy
 * mượt, WebView cũ/hạn chế (Zalo in-app browser...) có thể nhảy tức thì thay vì animate. */
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [openHeight, setOpenHeight] = useState(0);

  useEffect(() => {
    if (open && contentRef.current) setOpenHeight(contentRef.current.scrollHeight);
  }, [open]);

  return (
    <div className="py-1">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-4 text-left text-[15px] font-medium text-foreground"
      >
        {question}
        <CaretDown
          size={18}
          aria-hidden="true"
          className={`shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-out motion-reduce:transition-none"
        style={{ maxHeight: open ? openHeight : 0 }}
      >
        <div ref={contentRef} className="pb-4 pr-8 text-sm leading-relaxed text-muted-foreground">
          {answer}
        </div>
      </div>
    </div>
  );
}

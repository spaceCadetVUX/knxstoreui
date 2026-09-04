import { useId } from "react";

/**
 * Minh hoạ kỹ thuật dựng tay bằng SVG — catalog thật CHƯA có ảnh chụp SKU này (xem placeholder
 * "Ảnh sản phẩm đang cập nhật" ở `product-card.tsx` cho pattern khi không có minh hoạ nào).
 * Số đo/layout lấy đúng theo datasheet chính hãng Loxone (xem `product-data.ts`) — không phải
 * hình trang trí. Dùng chung giữa `product-hero.tsx` (gallery) và `product-tabs.tsx` (tab Lắp
 * đặt) nên không có "use client" riêng — chỉ được render từ 2 file đó (đều đã "use client"),
 * `useId()` vẫn chạy đúng vì cả 2 nơi gọi đều nằm trong client tree.
 *
 * Không đặt "use client" ở đây: file này không tự nó là ranh giới client/server, chỉ là
 * component thuần render theo props — Next gộp vào đúng bundle của nơi import nó.
 */

export function DeviceFrontView({ panelColor, inkColor }: { panelColor: string; inkColor: string }) {
  const shadowId = useId();
  const sheenId = useId();
  return (
    <svg
      viewBox="0 0 240 240"
      className="h-full w-full"
      role="img"
      aria-label="Mặt trước thiết bị: 4 đèn LED trạng thái, bàn phím số 1 đến 9, nút chuông, nút 0, phím xác nhận, cảm biến NFC phía dưới"
    >
      <defs>
        <filter id={shadowId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        {/* Sheen kính nhẹ trên nửa trên panel — gợi chiều sâu mặt kính thật, KHÔNG cố giả render
            3D ảnh chụp (xem ghi chú đầu file: không dựng ảnh "giống thật" cho sản phẩm hãng khác). */}
        <linearGradient id={sheenId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.14} />
          <stop offset="40%" stopColor="#ffffff" stopOpacity={0} />
        </linearGradient>
      </defs>

      <ellipse cx="120" cy="222" rx="82" ry="7" fill="#000000" opacity={0.16} filter={`url(#${shadowId})`} />
      <rect x="20" y="20" width="200" height="200" rx="26" fill={panelColor} />
      <rect x="20" y="20" width="200" height="200" rx="26" fill={`url(#${sheenId})`} />

      <g style={{ color: inkColor }}>
        <circle cx="99" cy="46" r="3" fill="currentColor" opacity={0.9} />
        <circle cx="113" cy="46" r="3" fill="currentColor" opacity={0.9} />
        <circle cx="127" cy="46" r="3" fill="currentColor" opacity={0.9} />
        <circle cx="141" cy="46" r="3" fill="currentColor" opacity={0.9} />
        <g fontFamily="var(--font-sans)" fontSize="16" fontWeight={600} textAnchor="middle" fill="currentColor">
          <text x="63" y="101">1</text>
          <text x="101" y="101">2</text>
          <text x="139" y="101">3</text>
          <text x="63" y="135">4</text>
          <text x="101" y="135">5</text>
          <text x="139" y="135">6</text>
          <text x="63" y="169">7</text>
          <text x="101" y="169">8</text>
          <text x="139" y="169">9</text>
          <text x="177" y="135">0</text>
        </g>
        {/* Nút chuông (universal button) — datasheet gọi "Universal button", ảnh thật cho thấy
            đây là icon chuông, không phải vòng tròn trơn như bản trước. */}
        <g transform="translate(177,96)" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round">
          <path d="M-7,4.5 C-7,-4 -4,-8.5 0,-8.5 C4,-8.5 7,-4 7,4.5 L9,7.5 L-9,7.5 Z" />
          <line x1="-2.2" y1="-9" x2="2.2" y2="-9" strokeLinecap="round" />
          <circle cx="0" cy="10" r="1.3" fill="currentColor" stroke="none" />
        </g>
        <polyline
          points="171,164 176,169 184,159"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Cảm biến NFC — vòng tròn + chấm giữa (đúng ảnh thật), bản trước vẽ nhầm thành vệt
            sóng kiểu icon wifi. */}
        <circle cx="120" cy="199" r="7" fill="none" stroke="currentColor" strokeWidth={1.6} />
        <circle cx="120" cy="199" r="2.2" fill="currentColor" />
        <text
          x="120"
          y="216"
          fontFamily="var(--font-sans)"
          fontSize="7"
          fontWeight={700}
          letterSpacing="2"
          textAnchor="middle"
          fill="currentColor"
          opacity={0.85}
        >
          LOXONE
        </text>
      </g>
    </svg>
  );
}

export function DeviceDimensions() {
  const arrowId = useId();
  return (
    <svg
      viewBox="0 0 300 190"
      className="h-full w-full text-muted-foreground"
      role="img"
      aria-label="Kích thước thiết bị: mặt trước 90 bằng 90 milimét, độ sâu 16 milimét"
    >
      <defs>
        <marker id={arrowId} viewBox="0 0 10 10" refX="5" refY="5" markerWidth={6} markerHeight={6} orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
        </marker>
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth={1.3}>
        <rect x="40" y="30" width="110" height="110" rx="10" fill="var(--color-muted)" />
        <line x1="40" y1="18" x2="150" y2="18" markerStart={`url(#${arrowId})`} markerEnd={`url(#${arrowId})`} />
        <line x1="28" y1="30" x2="28" y2="140" markerStart={`url(#${arrowId})`} markerEnd={`url(#${arrowId})`} />
        <rect x="205" y="55" width="18" height="60" fill="var(--color-muted)" />
        <line x1="205" y1="128" x2="223" y2="128" markerStart={`url(#${arrowId})`} markerEnd={`url(#${arrowId})`} />
      </g>
      <g fontFamily="var(--font-sans)" fontSize="12" fill="currentColor" textAnchor="middle">
        <text x="95" y="14">90 mm</text>
        <text x="12" y="88" transform="rotate(-90 12 88)">90 mm</text>
        <text x="214" y="142">16 mm</text>
        <text x="214" y="34" fontSize="11">Mặt cắt</text>
        <text x="95" y="158" fontSize="11">Mặt trước</text>
      </g>
    </svg>
  );
}

export function DeviceWiring() {
  const arrowId = useId();
  return (
    <svg
      viewBox="0 0 320 190"
      className="h-full w-full text-muted-foreground"
      role="img"
      aria-label="Sơ đồ đấu nối: dây Cam Trắng cấp nguồn 24VDC và GND, dây Xanh lá Trắng nối bus Loxone Tree tới Miniserver hoặc Tree Extension"
    >
      <defs>
        <marker id={arrowId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth={6} markerHeight={6} orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
        </marker>
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth={1.3}>
        <rect x="10" y="65" width="86" height="58" rx="10" fill="var(--color-card)" />
        <rect x="224" y="20" width="86" height="46" rx="10" fill="var(--color-card)" />
        <rect x="224" y="122" width="86" height="46" rx="10" fill="var(--color-card)" />
        <path d="M96,82 C160,82 160,43 224,43" markerEnd={`url(#${arrowId})`} stroke="#b45309" />
        <path d="M96,106 C160,106 160,145 224,145" markerEnd={`url(#${arrowId})`} stroke="#1a8f5c" />
      </g>
      <g fontFamily="var(--font-sans)" fill="currentColor" textAnchor="middle">
        <text x="53" y="98" fontSize="11.5" fontWeight={700}>NFC Code</text>
        <text x="53" y="112" fontSize="11.5" fontWeight={700}>Touch Tree</text>
        <text x="267" y="40" fontSize="11" fontWeight={700}>Nguồn 24VDC</text>
        <text x="267" y="53" fontSize="9.5" fill="var(--color-muted-foreground)">PSU / bộ nguồn</text>
        <text x="267" y="142" fontSize="11" fontWeight={700}>Miniserver /</text>
        <text x="267" y="154" fontSize="11" fontWeight={700}>Tree Extension</text>
        <text x="160" y="34" fontSize="10" fill="#b45309" fontWeight={600}>Cam/Trắng · +24VDC / GND</text>
        <text x="160" y="168" fontSize="10" fill="#1a8f5c" fontWeight={600}>Xanh lá/Trắng · Loxone Tree</text>
      </g>
    </svg>
  );
}

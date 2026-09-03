"use client";

import { useEffect, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";

/** Thời lượng transition của Reveal — dùng chung với useDelayedUnmount để panel có đủ thời
 * gian chạy hết hiệu ứng đóng trước khi bị gỡ khỏi DOM. */
export const REVEAL_DURATION_MS = 200;

/**
 * Giữ children trong DOM thêm `duration`ms sau khi `show` chuyển false, đủ để CSS transition
 * exit (Reveal với `show={show}`) chạy hết trước khi unmount — tránh dropdown/mega menu biến
 * mất đột ngột (trước đây conditional-render `{open && <Reveal>}` chỉ có hiệu ứng mở, đóng thì
 * gỡ khỏi DOM ngay lập tức nên trông giật/không mượt).
 */
export function useDelayedUnmount(show: boolean, duration: number = REVEAL_DURATION_MS) {
  const [mounted, setMounted] = useState(show);

  // Điều chỉnh state ngay trong lúc render (pattern chính thức của React cho "adjusting state
  // when a prop changes") thay vì trong effect, để tránh 1 nhịp render thừa khi mở lại.
  if (show && !mounted) {
    setMounted(true);
  }

  useEffect(() => {
    if (show || !mounted) return;
    const id = setTimeout(() => setMounted(false), duration);
    return () => clearTimeout(id);
  }, [show, duration, mounted]);

  return mounted;
}

/**
 * Fade + slide 8px, dùng chung cho mọi panel/dropdown nổi trong nav. Tôn trọng reduced-motion.
 *
 * Mặc định (không truyền `show`) chỉ animate lúc mount — hợp component nào bản thân đã bị
 * unmount ngay khi đóng (vd. từng item bên trong menu, chỉ cần hiệu ứng vào, panel cha lo hiệu
 * ứng ra chung).
 *
 * Truyền `show` khi cần animate CẢ 2 chiều (mở lẫn đóng) — component cha giữ panel mounted qua
 * `useDelayedUnmount` trong lúc đóng, còn Reveal chỉ đổi class theo `show` để chạy transition
 * ngược lại thay vì biến mất tức thì.
 */
export function Reveal({
  children,
  className = "",
  delayMs = 0,
  show,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  show?: boolean;
} & HTMLAttributes<HTMLDivElement>) {
  const [mountEntered, setMountEntered] = useState(false);

  useEffect(() => {
    if (show !== undefined) return;
    const id = requestAnimationFrame(() => setMountEntered(true));
    return () => cancelAnimationFrame(id);
  }, [show]);

  const entered = show ?? mountEntered;

  return (
    <div
      {...rest}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={`transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        entered ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      } ${show !== undefined && !entered ? "pointer-events-none" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

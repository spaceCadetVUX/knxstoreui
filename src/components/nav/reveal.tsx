"use client";

import { useEffect, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";

/** Fade + slide-in 8px khi mount (~200ms). Tôn trọng reduced-motion. Dùng chung cho mọi panel/dropdown nổi trong nav. */
export function Reveal({
  children,
  className = "",
  delayMs = 0,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
} & HTMLAttributes<HTMLDivElement>) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      {...rest}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
      className={`transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        entered ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

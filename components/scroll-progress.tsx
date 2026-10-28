"use client";

import { useEffect, useRef } from "react";

/** Barra de progresso de leitura; atualiza o DOM direto para não re-renderizar a cada scroll. */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      barRef.current?.style.setProperty("transform", `scaleX(${progress})`);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px">
      <div ref={barRef} className="h-full origin-left bg-accent/70" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}

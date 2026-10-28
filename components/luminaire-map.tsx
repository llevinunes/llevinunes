"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

const W = 600;
const H = 440;
const vertical = [40, 160, 290, 420, 545];
const horizontal = [45, 140, 235, 330, 410];

type LumState = "on" | "fault" | "offline";
type Lum = { x: number; y: number; state: LumState };

/** Luminárias ao longo das ruas, em posições fixas (nada de random → sem mismatch de hidratação). */
const luminaires: Lum[] = (() => {
  const points: { x: number; y: number }[] = [];
  horizontal.forEach((y, row) => {
    for (let x = 95 + (row % 2) * 30; x < W - 20; x += 125) points.push({ x, y: y - 9 });
  });
  vertical.forEach((x, col) => {
    for (let y = 92 + (col % 2) * 45; y < H - 20; y += 95) points.push({ x: x + 9, y });
  });
  return points.map((p, i) => ({
    ...p,
    state: i === 9 || i === 31 ? "fault" : i % 11 === 4 ? "offline" : "on",
  }));
})();

// luminária com o tooltip "LUM-04821"
const focus = luminaires[13];

export function LuminaireMap() {
  const t = useTranslations("projects.tgPlus.map");
  const ref = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLit(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative h-full min-h-[300px] overflow-hidden bg-bg-0" data-lit={lit}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={t("label")}
        className="absolute inset-0 size-full"
      >
        <g stroke="var(--street)" strokeWidth="9" strokeLinecap="square">
          {vertical.map((x) => (
            <line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} />
          ))}
          {horizontal.map((y) => (
            <line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} />
          ))}
        </g>
        <g stroke="var(--border)" strokeWidth="1" strokeDasharray="4 8" opacity=".6">
          {vertical.map((x) => (
            <line key={`vc${x}`} x1={x} y1={0} x2={x} y2={H} />
          ))}
          {horizontal.map((y) => (
            <line key={`hc${y}`} x1={0} y1={y} x2={W} y2={y} />
          ))}
        </g>
        {luminaires.map((l, i) => (
          <circle
            key={i}
            className="lum"
            data-state={l.state}
            cx={l.x}
            cy={l.y}
            r={4.5}
            style={{ transitionDelay: `${i * 35}ms` }}
          />
        ))}
        <circle cx={focus.x} cy={focus.y} r={10} fill="none" stroke="var(--accent)" strokeWidth="1.5" />
      </svg>

      <div
        className="absolute rounded-md border border-border bg-bg-1/95 px-2.5 py-1.5 font-mono text-[11px] leading-snug shadow-window"
        style={{ left: `${(focus.x / W) * 100 + 2}%`, top: `${(focus.y / H) * 100 + 3}%` }}
      >
        <div className="font-medium text-text">LUM-04821</div>
        <div className="hidden text-muted dark:block">
          <span className="text-green">●</span> {t("tooltipState")}
        </div>
        <div className="text-muted dark:hidden">
          <span className="text-dim">●</span> {t("tooltipStateDay")}
        </div>
        <div className="text-dim">{t("tooltipUplink", { seconds: 12 })}</div>
      </div>

      <ul className="absolute bottom-3 left-3 flex gap-3 rounded-md bg-bg-0/80 px-2 py-1 font-mono text-[11px] text-dim">
        <li className="hidden dark:list-item">
          <span className="text-lum-on">●</span> {t("on")}
        </li>
        <li className="dark:hidden">
          <span className="text-dim">○</span> {t("off")}
        </li>
        <li>
          <span className="text-red">●</span> {t("fault")}
        </li>
        <li>
          <span className="opacity-60">●</span> {t("offline")}
        </li>
      </ul>
    </div>
  );
}

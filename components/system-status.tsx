"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type Tone = "prompt" | "cmd" | "muted" | "green" | "accent" | "purple" | "plain";
type Segment = { text: string; tone: Tone };

const toneClass: Record<Tone, string> = {
  prompt: "text-accent",
  cmd: "text-text font-medium",
  muted: "text-muted",
  green: "text-green",
  accent: "text-accent font-medium",
  purple: "text-purple",
  plain: "text-text",
};

const DURATION = 1500;
const stackRows = ["frontend", "backend", "data", "iot", "infra"] as const;

export function SystemStatus() {
  const t = useTranslations("status");

  const lines: Segment[][] = [
    [{ text: "$ ", tone: "prompt" }, { text: t("whoami.cmd"), tone: "cmd" }],
    [
      { text: "  " + t("whoami.user"), tone: "green" },
      { text: ` ${t("whoami.out")} `, tone: "muted" },
      { text: t("whoami.company"), tone: "accent" },
    ],
    [],
    [{ text: "$ ", tone: "prompt" }, { text: t("uptime.cmd"), tone: "cmd" }],
    [{ text: "  " + t("uptime.out"), tone: "muted" }],
    [],
    [{ text: "$ ", tone: "prompt" }, { text: t("stack.cmd"), tone: "cmd" }],
    ...stackRows.map((row) => [
      { text: `  ${row.padEnd(10)}`, tone: "purple" as const },
      { text: t(`stack.rows.${row}`), tone: "muted" as const },
    ]),
    [],
    [{ text: "$ ", tone: "prompt" }],
  ];

  const total = lines.flat().reduce((n, s) => n + s.text.length, 0);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    let frame = 0;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      frame = requestAnimationFrame(() => setShown(total));
      return () => cancelAnimationFrame(frame);
    }
    let start: number | null = null;
    const tick = (now: number) => {
      start ??= now;
      const progress = Math.min((now - start) / DURATION, 1);
      setShown(Math.round(progress * total));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // roda uma única vez, na montagem
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let budget = shown;
  const plain = lines.map((line) => line.map((s) => s.text).join("")).join("\n");

  return (
    <>
      <pre className="sr-only">{plain}</pre>
      <pre aria-hidden className="overflow-x-auto whitespace-pre font-mono text-[12px] leading-[1.7]">
        {lines.map((line, i) => (
          <div key={i} className="min-h-[1.7em]">
            {line.map((seg, j) => {
              const visible = seg.text.slice(0, Math.max(budget, 0));
              budget -= seg.text.length;
              return visible ? (
                <span key={j} className={toneClass[seg.tone]}>
                  {visible}
                </span>
              ) : null;
            })}
            {i === lines.length - 1 ? <span className="caret" /> : null}
          </div>
        ))}
      </pre>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { site } from "@/lib/site";

function useClock(locale: string) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, []);

  if (!now) return { yours: "--:--", mine: "--:--" };
  const fmt = (timeZone?: string) =>
    new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hour12: false, timeZone }).format(now);
  return { yours: fmt(), mine: fmt(site.timeZone) };
}

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const { yours, mine } = useClock(locale);

  return (
    <footer className="bg-bg-1">
      <p className="mx-auto max-w-3xl px-4 py-10 text-center text-sm text-muted">{t("tagline")}</p>
      <div className="border-t border-border bg-statusbar">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-1.5 font-mono text-[11px] text-dim sm:px-6">
          <div className="flex flex-wrap gap-x-4">
            <span>⎇ {t("branch")}</span>
            <span>
              <span className="text-green">●</span> {t("operational")}
            </span>
            <span>✕ 0 ⚠ 0</span>
          </div>
          <div className="flex flex-wrap gap-x-4">
            <span suppressHydrationWarning>
              {t("yourTime")} {yours} · {t("myTime")} {mine}
            </span>
            <span className="hidden sm:inline">{t("language")}</span>
            <span className="hidden sm:inline">{t("encoding")}</span>
            <span>© 2026 Levi Nunes</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

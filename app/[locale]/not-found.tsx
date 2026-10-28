"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Window } from "@/components/window";

export default function NotFound() {
  const t = useTranslations("notFound");
  const pathname = usePathname();

  return (
    <main className="hero flex min-h-[70vh] items-center justify-center px-4 py-24">
      <Window file="~ — zsh" meta="404" className="w-full max-w-xl" bodyClassName="p-6 font-mono text-sm leading-relaxed">
        <h1 className="sr-only">{t("title")}</h1>
        <p>
          <span className="text-accent">$</span> <span className="text-text">{pathname}</span>
        </p>
        <p className="text-red">
          {t("error")} {pathname}
        </p>
        <p className="mt-4 text-muted"># {t("hint")}</p>
        <p className="mt-4">
          <span className="text-accent">$</span>{" "}
          <Link href="/" className="text-accent underline-offset-4 hover:underline">
            {t("home")}
          </Link>
          <span className="caret ml-1" aria-hidden />
        </p>
      </Window>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckIcon, CopyIcon } from "./icons";

export function CopyEmail({ email }: { email: string }) {
  const t = useTranslations("contact");
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      location.href = `mailto:${email}`;
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-window py-2 pl-4 pr-2">
      <a href={`mailto:${email}`} className="truncate font-mono text-sm text-text hover:text-accent">
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={t("copyLabel")}
        className="flex shrink-0 items-center gap-1.5 rounded-md bg-accent/10 px-2.5 py-1.5 font-mono text-xs text-accent transition-colors hover:bg-accent/20"
      >
        {copied ? <CheckIcon width={13} height={13} /> : <CopyIcon width={13} height={13} />}
        <span aria-live="polite">{copied ? t("copied") : t("copy")}</span>
      </button>
    </div>
  );
}

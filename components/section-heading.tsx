"use client";

import { useState } from "react";
import { CheckIcon, LinkIcon } from "./icons";

export function SectionHeading({ id, title, lead }: { id: string; title: string; lead?: string }) {
  const [copied, setCopied] = useState(false);

  async function copyAnchor() {
    const url = `${location.origin}${location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      history.replaceState(null, "", `#${id}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      location.hash = id;
    }
  }

  return (
    <header className="mb-8">
      <h2 className="group flex items-center text-[32px] font-bold leading-tight">
        <span className="md-mark" aria-hidden>
          ##
        </span>
        {title}
        <button
          type="button"
          onClick={copyAnchor}
          aria-label={`#${id}`}
          className="ml-3 text-dim opacity-0 transition-opacity hover:text-accent focus-visible:opacity-100 group-hover:opacity-100"
        >
          {copied ? <CheckIcon /> : <LinkIcon />}
        </button>
      </h2>
      {lead ? <p className="mt-4 font-mono text-sm text-muted">&gt; {lead}</p> : null}
    </header>
  );
}

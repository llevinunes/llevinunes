export type MacIconKind = "text" | "image" | "terminal";

/** Ícones de arquivo/app no estilo do macOS, usados na dock do hero. */
export function MacIcon({ kind }: { kind: MacIconKind }) {
  if (kind === "terminal") {
    return (
      <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden>
        <defs>
          <linearGradient id="term-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a4048" />
            <stop offset="1" stopColor="#14181d" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="52" height="52" rx="12" fill="url(#term-bg)" stroke="#5b636d" strokeWidth="1" />
        <rect x="6" y="9" width="44" height="38" rx="4" fill="#0b0e12" />
        <path d="M12 18l6 5-6 5" fill="none" stroke="#e6edf3" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 29h10" stroke="#e6edf3" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg width="48" height="58" viewBox="0 0 48 58" aria-hidden>
      <path d="M4 2h28l14 14v38a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" fill="#f4f6f8" stroke="#c4cbd3" />
      <path d="M32 2v12a2 2 0 0 0 2 2h12" fill="#dde2e8" stroke="#c4cbd3" />
      {kind === "text" ? (
        <g stroke="#9aa3ad" strokeWidth="2" strokeLinecap="round">
          <path d="M9 22h24M9 28h30M9 34h26M9 40h30M9 46h18" />
        </g>
      ) : (
        <g>
          <rect x="7" y="21" width="34" height="28" rx="2" fill="#34b4f3" />
          <circle cx="16" cy="29" r="3.5" fill="#febc2e" />
          <path d="M7 45l10-10 7 7 6-5 11 9v1a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2Z" fill="#1f7a4d" />
        </g>
      )}
    </svg>
  );
}

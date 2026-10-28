import type { HTMLAttributes, ReactNode } from "react";

type Action = { onClick: () => void; label: string };

type TitleBarProps = {
  file: string;
  meta?: ReactNode;
  /** Só janelas do hero recebem ações; em janelas de conteúdo as bolinhas são enfeite. */
  actions?: { close: Action; minimize: Action; zoom: Action };
  /** Handlers de arraste aplicados à barra inteira. */
  handleProps?: HTMLAttributes<HTMLDivElement>;
};

const lights = [
  { key: "close", color: "bg-tl-close", glyph: "×" },
  { key: "minimize", color: "bg-tl-min", glyph: "−" },
  { key: "zoom", color: "bg-tl-zoom", glyph: "+" },
] as const;

const dot =
  "flex size-3 items-center justify-center rounded-full font-mono text-[10px] font-bold leading-none text-black/60";

export function TitleBar({ file, meta, actions, handleProps }: TitleBarProps) {
  const { className: handleClassName = "", ...handlers } = handleProps ?? {};
  return (
    <div
      {...handlers}
      className={`group/bar flex h-9 items-center gap-3 border-b border-border bg-bg-1 px-3.5 ${handleClassName}`}
    >
      <div className="flex gap-2">
        {lights.map(({ key, color, glyph }) => {
          const glyphEl = (
            <span aria-hidden className="opacity-0 transition-opacity group-hover/bar:opacity-100">
              {glyph}
            </span>
          );
          return actions ? (
            <button
              key={key}
              type="button"
              data-no-drag
              onClick={actions[key].onClick}
              aria-label={actions[key].label}
              className={`${dot} ${color} cursor-pointer`}
            >
              {glyphEl}
            </button>
          ) : (
            <span key={key} aria-hidden className={`${dot} ${color}`}>
              {glyphEl}
            </span>
          );
        })}
      </div>
      <span className="truncate font-mono text-xs text-muted">{file}</span>
      {meta ? <span className="ml-auto shrink-0 font-mono text-xs text-dim">{meta}</span> : null}
    </div>
  );
}

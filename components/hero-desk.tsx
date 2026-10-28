"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { MacIcon, type MacIconKind } from "./mac-icon";

type DockItem = { id: string; file: string; icon: MacIconKind };

type Desk = {
  isClosed: (id: string) => boolean;
  close: (item: DockItem) => void;
};

const DeskContext = createContext<Desk | null>(null);

export function useDesk() {
  const desk = useContext(DeskContext);
  if (!desk) throw new Error("useDesk precisa estar dentro de <HeroDesk>");
  return desk;
}

/** Área de trabalho do hero: guarda as janelas fechadas e as mostra numa dock. */
export function HeroDesk({ children }: { children: ReactNode }) {
  const [docked, setDocked] = useState<DockItem[]>([]);

  const desk: Desk = {
    isClosed: (id) => docked.some((d) => d.id === id),
    close: (item) => setDocked((items) => (items.some((d) => d.id === item.id) ? items : [...items, item])),
  };

  return (
    <DeskContext value={desk}>
      {children}
      <Dock items={docked} onOpen={(id) => setDocked((items) => items.filter((d) => d.id !== id))} />
    </DeskContext>
  );
}

function Dock({ items, onOpen }: { items: DockItem[]; onOpen: (id: string) => void }) {
  const t = useTranslations("window");

  return (
    <nav
      aria-label={t("dock")}
      className={`absolute bottom-5 left-1/2 z-40 -translate-x-1/2 transition-[opacity,translate] duration-300 motion-reduce:transition-none ${
        items.length ? "" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ul className="flex items-end gap-2 rounded-2xl border border-border bg-bg-1/60 px-2.5 pb-1.5 pt-2 shadow-window backdrop-blur-xl">
        {items.map((item) => (
          <li key={item.id} className="dock-in group relative flex flex-col items-center">
            <span
              role="tooltip"
              className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md border border-border bg-bg-1 px-2 py-0.5 text-xs text-text opacity-0 shadow-window transition-opacity group-hover:opacity-100 group-has-focus-visible:opacity-100"
            >
              {item.file}
            </span>
            <button
              type="button"
              onClick={() => onOpen(item.id)}
              aria-label={t("open", { file: item.file })}
              className="flex size-12 origin-bottom items-end justify-center transition-[scale,translate] duration-200 hover:-translate-y-1 hover:scale-125 focus-visible:scale-125 motion-reduce:transition-none [&>svg]:h-11 [&>svg]:w-auto"
            >
              <MacIcon kind={item.icon} />
            </button>
            {/* ponto de "app aberto" da dock */}
            <span aria-hidden className="mt-1 size-1 rounded-full bg-muted" />
          </li>
        ))}
      </ul>
    </nav>
  );
}

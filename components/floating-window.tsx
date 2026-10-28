"use client";

import { useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useDesk } from "./hero-desk";
import type { MacIconKind } from "./mac-icon";
import { TitleBar } from "./title-bar";
import { windowFrame } from "./window";

type FloatingWindowProps = {
  file: string;
  meta?: ReactNode;
  /** Ícone que a janela ganha na dock ao ser fechada. */
  icon: MacIconKind;
  /** Posição e camada (z-index) da janela. */
  className?: string;
  bodyClassName?: string;
  /** Ritmo da flutuação, para as janelas não andarem em sincronia. */
  float?: { duration: number; delay: number };
  children: ReactNode;
};

type Drag = {
  pointerX: number;
  pointerY: number;
  originX: number;
  originY: number;
  min: { x: number; y: number };
  max: { x: number; y: number };
};

// arrastar só faz sentido no layout desktop, em que as janelas são absolutas
const DESKTOP = "(min-width: 1024px)";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Janela do hero: flutua, é arrastável pela barra e, fechada, vai para a dock. */
export function FloatingWindow({
  file,
  meta,
  icon,
  className = "",
  bodyClassName = "",
  float = { duration: 7, delay: 0 },
  children,
}: FloatingWindowProps) {
  const t = useTranslations("window");
  const desk = useDesk();
  const closed = desk.isClosed(file);
  const frameRef = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  function startDrag(e: PointerEvent<HTMLElement>) {
    if (e.button !== 0 || (e.target as HTMLElement).closest("[data-no-drag]")) return;
    if (!window.matchMedia(DESKTOP).matches) return;
    const frame = frameRef.current;
    const bounds = frame?.closest(".hero")?.getBoundingClientRect();
    if (!frame || !bounds) return;

    const rect = frame.getBoundingClientRect();
    drag.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      originX: offset.x,
      originY: offset.y,
      min: { x: offset.x + bounds.left - rect.left, y: offset.y + bounds.top - rect.top },
      max: { x: offset.x + bounds.right - rect.right, y: offset.y + bounds.bottom - rect.bottom },
    };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  }

  function moveDrag(e: PointerEvent<HTMLElement>) {
    const d = drag.current;
    if (!d) return;
    setOffset({
      x: clamp(d.originX + e.clientX - d.pointerX, d.min.x, d.max.x),
      y: clamp(d.originY + e.clientY - d.pointerY, d.min.y, d.max.y),
    });
  }

  function endDrag(e: PointerEvent<HTMLElement>) {
    if (!drag.current) return;
    drag.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  }

  function close() {
    setMinimized(false);
    setZoomed(false);
    desk.close({ id: file, file, icon });
  }

  const floatStyle: CSSProperties = {
    animationDuration: `${float.duration}s`,
    animationDelay: `${float.delay}s`,
  };

  return (
    <div
      className={`${className} ${closed ? "pointer-events-none" : ""}`}
      style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)` }}
    >
      <div className="float" data-paused={dragging || closed} style={floatStyle}>
        {/* fechada, a janela encolhe em direção à dock mas segue montada (e ocupando o lugar) */}
        <div
          ref={frameRef}
          aria-hidden={closed || undefined}
          inert={closed}
          className={`${windowFrame} origin-bottom transition-[scale,opacity,translate,visibility] duration-300 ease-out motion-reduce:transition-none ${
            closed ? "invisible translate-y-24 scale-[0.2] opacity-0" : zoomed ? "scale-[1.12]" : ""
          } ${dragging ? "shadow-2xl" : ""}`}
        >
          <TitleBar
            file={file}
            meta={meta}
            handleProps={{
              onPointerDown: startDrag,
              onPointerMove: moveDrag,
              onPointerUp: endDrag,
              onPointerCancel: endDrag,
              className: `lg:touch-none lg:select-none ${dragging ? "lg:cursor-grabbing" : "lg:cursor-grab"}`,
            }}
            actions={{
              close: { onClick: close, label: t("close") },
              minimize: { onClick: () => setMinimized((m) => !m), label: t("minimize") },
              zoom: { onClick: () => setZoomed((z) => !z), label: t("zoom") },
            }}
          />
          {/* minimizar esconde o corpo sem desmontar (o terminal não redigita) */}
          <div className={`${bodyClassName} ${minimized ? "hidden" : ""}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}

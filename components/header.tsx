"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { sections, type SectionId } from "@/lib/site";
import { MarkdownIcon, MoonIcon, SunIcon } from "./icons";
import { ScrollProgress } from "./scroll-progress";

function useScrolled(threshold = 80) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

function useActiveSection() {
  const [active, setActive] = useState<SectionId | null>(null);
  useEffect(() => {
    const visible = new Map<SectionId, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as SectionId;
          if (entry.isIntersecting) visible.set(id, entry.intersectionRatio);
          else visible.delete(id);
        }
        // a primeira seção (na ordem da página) que ainda está visível
        setActive(sections.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);
  return active;
}

/** Sufixo `#secao` do breadcrumb: o antigo sai para cima e, só depois, o novo entra por baixo. */
function BreadcrumbSection({ active }: { active: SectionId | null }) {
  const [shown, setShown] = useState(active);
  const [leaving, setLeaving] = useState<SectionId | null>(null);
  // guarda a seção anterior durante o render (padrão do React para "valor anterior")
  if (active !== shown) {
    setLeaving(shown);
    setShown(active);
  }

  return (
    <span className="inline-grid overflow-hidden align-bottom">
      {leaving ? (
        <span
          key={`out-${leaving}`}
          aria-hidden
          className="crumb-out text-accent [grid-area:1/1]"
          // sem seção nova (voltou ao topo), ninguém mais o remove
          onAnimationEnd={() => !shown && setLeaving(null)}
        >
          #{leaving}
        </span>
      ) : null}
      {shown ? (
        // o que sai só é removido quando o novo termina de entrar; removê-lo antes
        // mudaria o delay no meio da animação e ela pularia para o fim
        <span
          key={`in-${shown}`}
          className={`crumb-in text-accent [grid-area:1/1] ${leaving ? "crumb-in-after" : ""}`}
          onAnimationEnd={() => setLeaving(null)}
        >
          #{shown}
        </span>
      ) : null}
    </span>
  );
}

/** Nav das seções com um único indicador que desliza até o item ativo. */
function SectionNav({ active }: { active: SectionId | null }) {
  const t = useTranslations("header");
  const listRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;

    const place = () => {
      const link = active ? list.querySelector<HTMLElement>(`a[href="#${active}"]`) : null;
      if (!link) {
        indicator.style.opacity = "0";
        return;
      }
      // vindo do estado oculto, aparece direto no item (sem deslizar a partir do anterior)
      const appearing = indicator.style.opacity !== "1";
      if (appearing) indicator.style.transitionProperty = "opacity";
      indicator.style.left = `${link.offsetLeft}px`;
      indicator.style.width = `${link.offsetWidth}px`;
      indicator.style.opacity = "1";
      if (appearing) {
        void indicator.offsetWidth; // aplica a posição antes de religar a transição
        indicator.style.transitionProperty = "";
      }
    };

    place();
    // a largura dos itens muda com a fonte carregando e com o idioma
    const observer = new ResizeObserver(place);
    observer.observe(list);
    return () => observer.disconnect();
  }, [active]);

  return (
    <nav className="mx-auto hidden md:block">
      <ul ref={listRef} className="relative flex gap-6 font-mono text-[13px]">
        {sections.map((id) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              className={`block py-1 transition-colors duration-300 ${
                active === id ? "text-text" : "text-muted hover:text-text"
              }`}
            >
              <span className="text-accent">##</span>
              {t(`nav.${id}`)}
            </a>
          </li>
        ))}
        <span
          ref={indicatorRef}
          aria-hidden
          className="nav-indicator pointer-events-none absolute -bottom-1 left-0 h-0.5 w-0 bg-accent opacity-0"
        />
      </ul>
    </nav>
  );
}

function ThemeToggle() {
  const t = useTranslations("header");
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- tema só é conhecido no cliente
  useEffect(() => setMounted(true), []);

  // só anima depois de um clique (não na correção do tema ao montar)
  const [toggled, setToggled] = useState(false);

  const isDark = !mounted || resolvedTheme !== "light";
  return (
    <button
      type="button"
      onClick={() => {
        setToggled(true);
        setTheme(isDark ? "light" : "dark");
      }}
      aria-label={isDark ? t("themeToLight") : t("themeToDark")}
      className="group flex size-8 items-center justify-center rounded-full text-muted transition-[color,background-color,scale] hover:bg-bg-1 hover:text-text active:scale-90 motion-reduce:transition-none"
    >
      <span className="transition-[rotate] duration-300 group-hover:rotate-[20deg] motion-reduce:transition-none">
        {/* keyframes, não transition: o next-themes desliga transições no instante da troca */}
        <span key={isDark ? "sun" : "moon"} className={`block ${toggled ? "theme-icon-in" : ""}`}>
          {isDark ? <SunIcon /> : <MoonIcon />}
        </span>
      </span>
    </button>
  );
}

const PILL_MS = 260;

function LocaleSwitch() {
  const t = useTranslations("header");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  // a troca de idioma remonta o layout na hora: a pílula desliza primeiro e só então navega
  const [selected, setSelected] = useState(locale);
  // com cacheComponents a rota anterior fica guardada escondida (<Activity>) com o estado do clique.
  // O cleanup roda quando ela é escondida: a pílula volta ao idioma real enquanto está oculta,
  // e reaparece já no lugar, sem deslizar de novo.
  useEffect(() => () => setSelected(locale), [locale]);
  const index = Math.max(routing.locales.indexOf(selected), 0);

  return (
    <nav
      aria-label={t("language")}
      className="relative grid grid-cols-2 rounded-md border border-border p-0.5 font-mono text-xs"
    >
      <span
        aria-hidden
        className="absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded bg-accent/15 transition-transform ease-[cubic-bezier(.3,.8,.3,1)] motion-reduce:transition-none"
        style={{ transform: `translateX(${index * 100}%)`, transitionDuration: `${PILL_MS}ms` }}
      />
      {routing.locales.map((l) => (
        <Link
          key={l}
          href={pathname}
          locale={l}
          onClick={(e) => {
            // ⌘/Ctrl/Shift+clique (nova aba/janela) segue o comportamento normal do link
            if (l === locale || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
            e.preventDefault();
            setSelected(l);
            const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            // push, como o <Link> faria: o "voltar" do navegador retorna ao idioma anterior
            setTimeout(() => router.push(pathname, { locale: l }), reduced ? 0 : PILL_MS);
          }}
          aria-current={l === locale ? "true" : undefined}
          className={`relative rounded px-2 py-0.5 text-center uppercase transition-[color,scale] duration-300 active:scale-90 motion-reduce:transition-none ${
            l === selected ? "text-accent" : "text-dim hover:text-text"
          }`}
        >
          {l}
        </Link>
      ))}
    </nav>
  );
}

export function Header() {
  const t = useTranslations("header");
  const scrolled = useScrolled();
  const active = useActiveSection();

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-200 ${
        scrolled ? "border-border bg-bg-0/80 backdrop-blur-[16px]" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link
          href="/"
          aria-label={t("home")}
          className="flex min-w-0 items-center gap-2 font-mono text-[13px] text-muted hover:text-text"
        >
          <MarkdownIcon className="shrink-0 text-accent" />
          <span className="truncate">
            {t("file")}
            <BreadcrumbSection active={active} />
          </span>
        </Link>

        <SectionNav active={active} />

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <LocaleSwitch />
          <ThemeToggle />
        </div>
      </div>
      <ScrollProgress />
    </header>
  );
}

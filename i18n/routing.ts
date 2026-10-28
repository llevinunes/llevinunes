import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "pt"],
  defaultLocale: "en",
});

/** Valor do atributo `lang` / hreflang de cada locale. */
export const htmlLang: Record<(typeof routing.locales)[number], string> = {
  en: "en",
  pt: "pt-BR",
};

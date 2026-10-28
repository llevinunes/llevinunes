import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import { htmlLang, routing } from "@/i18n/routing";
import { site } from "@/lib/site";
import "../globals.css";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-plex-sans",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-plex-mono",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(site.url),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [htmlLang[l], `/${l}`])),
        "x-default": `/${routing.defaultLocale}`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: htmlLang[locale].replace("-", "_"),
      type: "website",
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html
      lang={htmlLang[locale]}
      className={`${sans.variable} ${mono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider>
          <Providers>
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

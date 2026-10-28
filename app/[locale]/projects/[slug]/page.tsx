import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { TagList } from "@/components/ui";
import { Window } from "@/components/window";
import { Link } from "@/i18n/navigation";
import { htmlLang, routing } from "@/i18n/routing";
import { projects, tgPlusHighlights } from "@/lib/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project || !hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "projects" });
  return {
    title: `${t(`${project.key}.title`)} — Levi Nunes`,
    description: t(`${project.key}.description`),
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: Object.fromEntries(routing.locales.map((l) => [htmlLang[l], `/${l}/projects/${slug}`])),
    },
  };
}

// TODO: quando houver projetos pessoais, os destaques passam a ser por projeto (hoje só o TG+ tem)
export default async function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  // o layout já validou o locale
  setRequestLocale(locale as Locale);
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const t = await getTranslations("projects");

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link href="/#projects" className="font-mono text-sm text-accent hover:underline">
        $ {t("backToProjects")}
      </Link>

      <Window file={`${project.slug}/README.md`} meta={project.year} className="mt-6" bodyClassName="p-6 sm:p-10">
        <p className="font-mono text-xs uppercase tracking-wider text-dim">
          {project.year} · {t(`${project.key}.area`)}
        </p>
        <h1 className="hero-title mt-3 text-4xl">
          <span className="md-mark">#</span>
          {t(`${project.key}.title`)}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">{t(`${project.key}.description`)}</p>
        <p className="mt-4 border-l-2 border-accent pl-4 leading-relaxed text-text">{t(`${project.key}.role`)}</p>
        <div className="mt-6">
          <TagList tags={project.tags} />
        </div>

        <h2 className="mt-12 text-2xl font-bold">
          <span className="md-mark">##</span>
          {t(`${project.key}.highlightsTitle`)}
        </h2>
        <ol className="mt-6 space-y-8">
          {tgPlusHighlights.map((h, i) => (
            <li key={h}>
              <h3 className="flex flex-wrap items-baseline gap-x-3 text-lg font-bold">
                <span>
                  <span className="md-mark">###</span>
                  {i + 1}. {t(`${project.key}.highlights.${h}.title`)}
                </span>
                <span className="font-mono text-xs font-normal text-dim">{t(`${project.key}.highlights.${h}.period`)}</span>
              </h3>
              <p className="mt-2 leading-relaxed text-muted">{t(`${project.key}.highlights.${h}.body`)}</p>
            </li>
          ))}
        </ol>

        <p className="mt-12 border-l-2 border-accent pl-4 font-mono text-sm text-dim">{t("caseStudyPending")}</p>
      </Window>
    </main>
  );
}

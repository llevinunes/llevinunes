import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { projects, tgPlusStats, type Project } from "@/lib/site";
import { LockIcon } from "../icons";
import { LuminaireMap } from "../luminaire-map";
import { SectionHeading } from "../section-heading";
import { buttonClasses, TagList } from "../ui";
import { Window } from "../window";

async function FeaturedProject({ project }: { project: Project }) {
  const t = await getTranslations("projects");

  return (
    <Window
      file={`${project.slug}/README.md`}
      meta={<span>★ {t("featured")}</span>}
      bodyClassName="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"
    >
      <div className="border-b border-border lg:border-b-0 lg:border-r">
        <LuminaireMap />
      </div>

      <div className="p-6 sm:p-8">
        <p className="font-mono text-xs uppercase tracking-wider text-accent">{t("tgPlus.eyebrow")}</p>
        <h3 className="mt-3 text-3xl font-bold">
          <span className="md-mark" aria-hidden>
            ###
          </span>
          {t("tgPlus.title")}
        </h3>
        <p className="mt-4 leading-relaxed text-muted">{t("tgPlus.description")}</p>
        <p className="mt-3 border-l-2 border-accent pl-3 text-sm leading-relaxed text-text">{t("tgPlus.role")}</p>

        <div className="mt-6 rounded-lg border border-border bg-bg-1 p-4">
          <p className="font-mono text-xs text-dim">
            {t("tgPlus.module.label")} <span className="font-bold text-text">{t("tgPlus.module.name")}</span>{" "}
            {t("tgPlus.module.note")}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t("tgPlus.module.description")}</p>
          <p className="mt-3 overflow-x-auto whitespace-nowrap font-mono text-xs">
            <span className="text-purple">POST</span> <span className="text-text">/talq/v1/control</span>{" "}
            <span className="text-dim">{`{"group":"av-central","dim":70}`}</span>{" "}
            <span className="text-green">→ 202</span>
          </p>
        </div>

        <dl className="mt-6 flex gap-8">
          {tgPlusStats.map((s) => (
            <div key={s.key} className="flex flex-col-reverse">
              <dt className="font-mono text-xs text-dim">{t(`tgPlus.stats.${s.key}`)}</dt>
              <dd className="text-2xl font-bold">{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <TagList tags={project.tags} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/projects/${project.slug}`} className={buttonClasses("primary")}>
            {t("readCaseStudy")} →
          </Link>
          {project.private ? (
            <span className={`${buttonClasses("ghost")} cursor-default hover:border-border hover:bg-transparent`}>
              <LockIcon width={14} height={14} /> {t("privateRepo")}
            </span>
          ) : null}
        </div>
      </div>
    </Window>
  );
}

export async function Projects() {
  const t = await getTranslations("projects");
  const featured = projects.find((p) => p.featured)!;

  return (
    <section id="projects" className="rounded-t-section bg-bg-1 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="projects" title={t("title")} lead={t("lead")} />

        <FeaturedProject project={featured} />

        <p className="mt-12 text-center font-mono text-sm text-muted">
          <span className="text-accent">$</span> {t("lsAll")} <span className="text-accent">→</span>
        </p>
      </div>
    </section>
  );
}

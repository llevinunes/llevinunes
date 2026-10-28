import { getTranslations } from "next-intl/server";
import { resumeAvailable } from "@/lib/resume";
import { experience, site } from "@/lib/site";
import { LockIcon } from "../icons";
import { SectionHeading } from "../section-heading";
import { buttonClasses, ButtonLink, TagList } from "../ui";
import { Window } from "../window";

export async function Experience() {
  const t = await getTranslations("experience");

  return (
    <section id="experience" className="bg-bg-2 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="experience" title={t("title")} lead={t("lead")} />

        <Window file={t("window")} meta="zsh" bodyClassName="px-5 py-8 sm:px-8">
          <ol className="relative ml-1.5 border-l border-border">
            {experience.map((e, i) => (
              <li key={e.key} className="relative pb-10 pl-7 sm:pl-9">
                <span
                  aria-hidden
                  className={`absolute -left-1.75 top-1 size-3.5 rounded-full border-2 ${
                    i === 0 ? "border-accent bg-accent" : "border-muted bg-window"
                  }`}
                />
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 font-mono text-xs">
                  <p>
                    <span className="text-yellow">{e.hash}</span>{" "}
                    <span className="text-green">{e.refs}</span>
                  </p>
                  <p className="text-dim">
                    {e.start} — {e.end ?? t("present")}
                  </p>
                </div>
                <h3 className="mt-2 text-xl font-bold">
                  {t(`entries.${e.key}.role`)}{" "}
                  <span className="text-accent">
                    {t("at")} {t(`entries.${e.key}.company`)}
                  </span>
                </h3>
                <ul className="mt-3 space-y-1.5 font-mono text-[13px] leading-relaxed text-muted">
                  {e.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-green" aria-hidden>
                        +
                      </span>
                      <span>{t(`entries.${e.key}.bullets.${b}`)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <TagList tags={e.tags} />
                </div>
              </li>
            ))}
            <li className="relative pl-7 font-mono text-xs text-dim sm:pl-9">
              <span aria-hidden className="absolute -left-1 top-0.5 text-dim">
                *
              </span>
              0000000 {t("initialCommit")} — printf(&quot;hello, world&quot;);
            </li>
          </ol>
        </Window>

        <div className="mt-8 flex flex-wrap gap-3">
          {resumeAvailable ? (
            <ButtonLink variant="ghost" href={site.resume} download>
              ↓ {t("resume")}
            </ButtonLink>
          ) : (
            // bloqueado até o PDF estar em public/ (lib/resume.ts)
            <span
              role="link"
              aria-disabled="true"
              title={t("resumeSoonTitle")}
              className={`${buttonClasses("ghost")} cursor-not-allowed opacity-60 hover:border-border hover:bg-transparent`}
            >
              <LockIcon width={14} height={14} /> {t("resume")}
              <span className="rounded-full border border-border px-1.5 font-mono text-[10px] uppercase tracking-wide text-dim">
                {t("resumeSoon")}
              </span>
            </span>
          )}
          <ButtonLink variant="ghost" href={site.linkedin} target="_blank" rel="noreferrer">
            {t("linkedin")} ↗
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

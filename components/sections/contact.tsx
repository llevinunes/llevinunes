import { getTranslations } from "next-intl/server";
import { resumeAvailable } from "@/lib/resume";
import { site } from "@/lib/site";
import { ContactForm } from "../contact-form";
import { CopyEmail } from "../copy-email";
import { LockIcon } from "../icons";
import { SectionHeading } from "../section-heading";

export async function Contact() {
  const t = await getTranslations("contact");
  const te = await getTranslations("experience");

  const links = [
    { key: "linkedin", href: site.linkedin, label: "/in/levinsousa" },
    { key: "github", href: site.github, label: new URL(site.github).pathname },
    // bloqueado até o PDF estar em public/ (lib/resume.ts)
    { key: "resume", href: resumeAvailable ? site.resume : null, label: site.resume.slice(1) },
  ] as const;

  return (
    <section id="contact" className="rounded-t-section bg-bg-1 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="contact" title={t("title")} />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-green/30 bg-green/10 px-3 py-1 font-mono text-xs text-green">
              <span aria-hidden>●</span> {t("badge")}
            </p>
            <h3 className="hero-title mt-6 text-4xl sm:text-[44px]">
              {t.rich("headline", { accent: (chunks) => <span className="text-accent">{chunks}</span> })}
            </h3>
            <p className="mt-5 max-w-md leading-relaxed text-muted">{t("body")}</p>

            <div className="mt-8 max-w-md">
              <CopyEmail email={site.email} />
            </div>

            <ul className="mt-6 max-w-md divide-y divide-border font-mono text-sm">
              {links.map(({ key, href, label }) => {
                const content = (
                  <>
                    <span>
                      <span className="text-text">[{t(`links.${key}`)}]</span>
                      <span className="text-accent">({label})</span>
                    </span>
                    {href ? (
                      <span aria-hidden className="text-dim">
                        ↗
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-dim">
                        <LockIcon width={12} height={12} /> {te("resumeSoon")}
                      </span>
                    )}
                  </>
                );
                return (
                  <li key={key}>
                    {href ? (
                      <a
                        href={href}
                        target={key === "resume" ? undefined : "_blank"}
                        rel={key === "resume" ? undefined : "noreferrer"}
                        className="flex items-center justify-between py-3 hover:underline"
                      >
                        {content}
                      </a>
                    ) : (
                      <span
                        aria-disabled="true"
                        title={te("resumeSoonTitle")}
                        className="flex cursor-not-allowed items-center justify-between py-3 opacity-60"
                      >
                        {content}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}

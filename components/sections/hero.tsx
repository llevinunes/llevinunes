import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { site } from "@/lib/site";
import profile from "@/public/llevinunes-profile.png";
import { FloatingWindow } from "../floating-window";
import { HeroDesk } from "../hero-desk";
import { GitHubIcon, LinkedInIcon, MailIcon } from "../icons";
import { SystemStatus } from "../system-status";
import { ButtonLink } from "../ui";

const PROFILE = "llevinunes-profile.png";

const coffee = String.raw`
     ( (
      ) )
   .........
   |       |]
   \       /
    '-----'`;

const iconLink =
  "flex size-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-bg-1 hover:text-accent";

export async function Hero() {
  const t = await getTranslations("hero");
  const ts = await getTranslations("status");

  return (
    <section className="hero overflow-hidden">
      <HeroDesk>
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:pt-24">
          <div>
            <h1 className="hero-title text-5xl sm:text-6xl">
              <span className="md-mark">#</span>
              {t("greeting")}
              <br />
              {t("name")}
            </h1>
            <p className="mt-3 text-2xl font-medium text-accent sm:text-[28px]">{t("role")}</p>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
              <span className="font-mono text-sm text-accent/80">&lt;p&gt; </span>
              {t("blurb")}
              <span className="font-mono text-sm text-accent/80"> &lt;/p&gt;</span>
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="#projects">{t("cta")} ↓</ButtonLink>
              <div className="flex items-center gap-1">
                <a href={site.linkedin} target="_blank" rel="noreferrer" aria-label={t("linkedin")} className={iconLink}>
                  <LinkedInIcon />
                </a>
                {site.github ? (
                  <a href={site.github} target="_blank" rel="noreferrer" aria-label={t("github")} className={iconLink}>
                    <GitHubIcon />
                  </a>
                ) : null}
                <a href={`mailto:${site.email}`} aria-label={t("email")} className={iconLink}>
                  <MailIcon />
                </a>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[580px]">
            <div className="hero-glow left-[10%] top-[15%] h-[70%] w-[80%]" aria-hidden />

            {/* camadas: café (z-0) < foto (z-10) < shell (z-20) */}
            <FloatingWindow
              file="coffee.txt"
              icon="text"
              float={{ duration: 8, delay: -3 }}
              className="absolute left-[8%] top-[56px] z-0 hidden w-[220px] lg:block"
              bodyClassName="h-[118px]"
            >
              <pre
                role="img"
                aria-label={t("coffeeLabel")}
                className="px-4 py-2 font-mono text-[12px] leading-tight text-accent"
              >
                {coffee}
              </pre>
            </FloatingWindow>

            <FloatingWindow
              file={PROFILE}
              icon="image"
              float={{ duration: 9, delay: -6 }}
              className="absolute right-0 top-0 z-10 hidden w-[230px] lg:block"
              bodyClassName="h-[190px]"
            >
              <Image
                src={profile}
                alt={t("profileAlt")}
                sizes="230px"
                placeholder="blur"
                fetchPriority="high"
                draggable={false}
                className="size-full object-cover object-[50%_35%]"
              />
            </FloatingWindow>

            <FloatingWindow
              file={ts("file")}
              meta={ts("meta")}
              icon="terminal"
              float={{ duration: 7, delay: 0 }}
              className="relative z-20 lg:absolute lg:bottom-0 lg:right-0 lg:w-full"
              bodyClassName="px-4 py-4 sm:px-5"
            >
              <SystemStatus />
            </FloatingWindow>
          </div>
        </div>
      </HeroDesk>
    </section>
  );
}

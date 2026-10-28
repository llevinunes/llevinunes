import type { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main>
      <Hero />
      <Projects />
      <Experience />
      <Contact />
    </main>
  );
}

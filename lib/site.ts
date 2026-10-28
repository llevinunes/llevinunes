/** Dados que não são texto traduzível: links, anos, tags. */

export const site = {
  email: "llevinsousa@gmail.com",
  linkedin: "https://www.linkedin.com/in/levinsousa/",
  // TODO: GitHub pendente — trocar pelo perfil real
  github: "https://github.com/llevinunes",
  githubPlaceholder: "[llevinunes]",
  // TODO: currículo pendente — adicionar public/levi-nunes-cv.pdf
  resume: "/levi-nunes-cv.pdf",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Fuso usado no relógio "mine" da status bar. */
  timeZone: "America/Sao_Paulo",
} as const;

export const sections = ["projects", "experience", "contact"] as const;
export type SectionId = (typeof sections)[number];

// projetos pessoais entram aqui depois
export type ProjectKey = "tgPlus";

export type Project = {
  key: ProjectKey;
  slug: string;
  year: number;
  tags: string[];
  private: boolean;
  featured?: boolean;
};

// números do levantamento no git (doc "Portfólio — Levi Sousa (SGI-IP)"): autoria, não contagem de commits
export const projects: Project[] = [
  {
    key: "tgPlus",
    slug: "tg-plus",
    year: 2024,
    tags: ["React", "TypeScript", "Leaflet", "WebSocket", "Spring Boot", ".NET", "PostgreSQL", "TALQ"],
    private: true,
    featured: true,
  },
];

export const tgPlusStats = [
  { value: "~53k", key: "lines" },
  { value: "200+", key: "tests" },
  { value: "24/7", key: "production" },
] as const;

/** Seções do estudo de caso do TG+, na ordem de relevância. */
export const tgPlusHighlights = ["frontend", "talq", "commands", "units", "observability"] as const;

export const experience = [
  {
    key: "nepen",
    hash: "a3f9c21",
    refs: "(HEAD → main)",
    start: "2023",
    end: null as string | null,
    bullets: ["frontend", "twoFactor", "talq", "commands", "units", "connectors", "adrs"],
    tags: ["React", "TypeScript", "Leaflet", "Java", "Spring Boot", ".NET", "PostgreSQL", "MQTT", "TALQ"],
  },
] as const;

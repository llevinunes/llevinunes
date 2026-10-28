import { existsSync } from "node:fs";
import path from "node:path";
import { site } from "./site";

/**
 * O currículo só fica clicável quando o PDF está no repositório (public/).
 * Verificado no build: adicionar o arquivo libera o botão sem mudar código.
 * Só importar em componentes de servidor (usa `fs`).
 */
export const resumeAvailable = existsSync(path.join(process.cwd(), "public", site.resume));

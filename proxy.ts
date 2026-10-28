import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Tudo, exceto API, internos do Next/Vercel e arquivos com extensão
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};

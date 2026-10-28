import { notFound } from "next/navigation";

// qualquer rota desconhecida dentro de /[locale] cai no not-found do locale
export default function CatchAll() {
  notFound();
}

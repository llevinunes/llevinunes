import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Levi Nunes — Software Developer";

export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({
    locale: hasLocale(routing.locales, locale) ? locale : routing.defaultLocale,
    namespace: "hero",
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f1217",
          backgroundImage: "radial-gradient(rgba(255,255,255,.12) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      >
        <div
          style={{
            width: 960,
            display: "flex",
            flexDirection: "column",
            borderRadius: 18,
            border: "1px solid #2a2f35",
            background: "#0f1216",
            boxShadow: "0 24px 60px -12px rgba(0,0,0,.5)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              height: 56,
              padding: "0 22px",
              background: "#161a1f",
              borderBottom: "1px solid #2a2f35",
            }}
          >
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ width: 16, height: 16, borderRadius: 999, background: c }} />
            ))}
            <div style={{ marginLeft: 12, fontSize: 22, color: "#bbc5d1" }}>docs/llevinunes.md</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", padding: "56px 64px 64px" }}>
            <div style={{ display: "flex", fontSize: 92, fontWeight: 700, color: "#fff", letterSpacing: -2 }}>
              <span style={{ color: "#34b4f3", marginRight: 28 }}>#</span>
              {t("name")}
            </div>
            <div style={{ fontSize: 44, color: "#34b4f3", marginTop: 8 }}>{t("role")}</div>
            <div style={{ fontSize: 26, color: "#757c83", marginTop: 32 }}>Full Stack @ NEPEN</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

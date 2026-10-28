"use client";

import { useActionState, useRef } from "react";
import { useTranslations } from "next-intl";
import { sendContact, type ContactField, type ContactState } from "@/app/actions/contact";
import { Button } from "./ui";
import { Window } from "./window";

const initial: ContactState = { status: "idle" };

const row = "flex items-baseline gap-4 border-b border-border py-3";
const label = "w-20 shrink-0 font-mono text-xs text-dim";
const input =
  "w-full bg-transparent font-mono text-sm text-text placeholder:text-dim focus:outline-none aria-invalid:text-red";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(sendContact, initial);

  const invalid = (f: ContactField) => state.status === "invalid" && state.fields.includes(f);
  // o React reseta o form após a action; em erro de validação, os valores voltam via defaultValue
  const value = (f: ContactField) => (state.status === "invalid" ? state.values[f] : undefined);

  return (
    <Window file={t("file")} meta={t("meta")} className="h-full" bodyClassName="h-[calc(100%-2.25rem)]">
      <form
        ref={formRef}
        action={action}
        noValidate
        className="relative flex h-full flex-col px-5 sm:px-6"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            formRef.current?.requestSubmit();
          }
        }}
      >
        <div className={row}>
          <span className={label}>{t("to")}</span>
          <span className="font-mono text-sm text-text">Levi Nunes</span>
        </div>
        <label className={row}>
          <span className={label}>{t("from")}</span>
          <input
            name="from"
            type="email"
            required
            autoComplete="email"
            defaultValue={value("from")}
            placeholder={t("fromPlaceholder")}
            aria-invalid={invalid("from") || undefined}
            aria-describedby={invalid("from") ? "err-from" : undefined}
            className={input}
          />
        </label>
        <label className={row}>
          <span className={label}>{t("subject")}</span>
          <input
            name="subject"
            required
            maxLength={150}
            defaultValue={value("subject")}
            placeholder={t("subjectPlaceholder")}
            aria-invalid={invalid("subject") || undefined}
            aria-describedby={invalid("subject") ? "err-subject" : undefined}
            className={input}
          />
        </label>
        <label className="flex flex-1 flex-col pt-4">
          <span className="sr-only">{t("message")}</span>
          <textarea
            name="message"
            required
            rows={8}
            maxLength={5000}
            defaultValue={value("message")}
            placeholder={t("messagePlaceholder")}
            aria-invalid={invalid("message") || undefined}
            aria-describedby={invalid("message") ? "err-message" : undefined}
            className={`${input} min-h-40 flex-1 resize-none leading-relaxed`}
          />
        </label>

        {/* honeypot */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div aria-live="polite" className="space-y-1 font-mono text-xs">
          {(["from", "subject", "message"] as const).map((f) =>
            invalid(f) ? (
              <p key={f} id={`err-${f}`} className="text-red">
                ✗ {t(`errors.${f}`)}
              </p>
            ) : null,
          )}
          {state.status === "success" ? <p className="text-green">✓ {t("success")}</p> : null}
          {state.status === "error" ? <p className="text-red">✗ {t("error")}</p> : null}
        </div>

        <div className="flex items-center justify-between gap-4 py-4">
          <p className="font-mono text-xs text-dim">{t("note")}</p>
          <Button type="submit" disabled={pending} aria-keyshortcuts="Meta+Enter Control+Enter">
            {pending ? t("sending") : t("send")} <kbd className="font-mono text-xs opacity-80">⌘↵</kbd>
          </Button>
        </div>
      </form>
    </Window>
  );
}

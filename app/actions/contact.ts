"use server";

import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  from: z.email(),
  subject: z.string().trim().min(1).max(150),
  message: z.string().trim().min(10).max(5000),
});

export type ContactField = keyof z.infer<typeof schema>;

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error" }
  | { status: "invalid"; fields: ContactField[]; values: Record<ContactField, string> };

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // honeypot: humano não vê o campo; bot preenche → finge sucesso e descarta
  if (formData.get("website")) return { status: "success" };

  const values = {
    from: String(formData.get("from") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
  };
  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map((i) => i.path[0] as ContactField))];
    return { status: "invalid", fields, values };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY não configurada");
    return { status: "error" };
  }

  const { from, subject, message } = parsed.data;
  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
    to: process.env.CONTACT_TO_EMAIL ?? "llevinsousa@gmail.com",
    replyTo: from,
    subject: `[portfolio] ${subject}`,
    text: `from: ${from}\n\n${message}`,
  });

  if (error) {
    console.error("[contact] Resend:", error);
    return { status: "error" };
  }
  return { status: "success" };
}

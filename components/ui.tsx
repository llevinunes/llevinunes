import type { ComponentProps, ReactNode } from "react";

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-accent/25 bg-accent/8 px-2.5 py-0.5 font-mono text-xs text-accent">
      {children}
    </span>
  );
}

export function TagList({ tags }: { tags: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag}>
          <Tag>{tag}</Tag>
        </li>
      ))}
    </ul>
  );
}

type Variant = "primary" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:brightness-110",
  ghost: "border border-border text-text hover:border-accent/60 hover:bg-bg-1",
};

export function buttonClasses(variant: Variant = "primary") {
  return `inline-flex items-center gap-2 rounded-button px-4 py-2 text-sm font-medium transition disabled:opacity-60 ${variants[variant]}`;
}

/** Link externo ou âncora com cara de botão. */
export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"a"> & { variant?: Variant }) {
  return <a className={`${buttonClasses(variant)} ${className}`} {...props} />;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={`${buttonClasses(variant)} ${className}`} {...props} />;
}

import type { ReactNode } from "react";
import { TitleBar } from "./title-bar";

export type WindowProps = {
  file: string;
  meta?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
};

export const windowFrame =
  "overflow-hidden rounded-window border border-border bg-window shadow-window";

export function Window({ file, meta, className = "", bodyClassName = "", children }: WindowProps) {
  return (
    <div className={`${windowFrame} ${className}`}>
      <TitleBar file={file} meta={meta} />
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}

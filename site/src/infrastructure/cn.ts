import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Join class names and resolve Tailwind conflicts, the helper shadcn components expect. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

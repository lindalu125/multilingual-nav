// Keep locales and defaultLocale definitions
export const locales = ["en", "zh", "es"] as const;
export const defaultLocale = "en" as const;
export type Locale = (typeof locales)[number];

// Export localePrefix configuration for middleware
export const localePrefix = "always"; // Or 'as-needed' or 'never'

// Re-export necessary components/hooks from next/link and next/navigation
// next-intl v2 relies on standard Next.js navigation + middleware
export { Link } from "next/link";
export { redirect, usePathname, useRouter } from "next/navigation";

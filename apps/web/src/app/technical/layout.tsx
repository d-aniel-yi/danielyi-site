import type { ReactNode } from "react";
// Server Component layout: MDX components are provided globally via next.config.ts (providerImportSource)

export default function TechnicalLayout({ children }: { children: ReactNode }) {
  return <section className="mx-auto max-w-3xl px-4 py-10">{children}</section>;
}



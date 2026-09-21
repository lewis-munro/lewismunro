import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function SubPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col justify-between bg-paper">
      <SiteHeader />
      <main className="mb-auto w-full px-4 pt-10 pb-24 max-sm:px-2 max-sm:pt-6">
        <h1 className="font-chroma text-lg uppercase max-2xl:text-2xl-lg max-sm:text-sm-lg">{title}</h1>
        <div className="mt-10 grid grid-cols-20 gap-4 max-sm:mt-6 max-sm:grid-cols-10 max-sm:gap-2">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}

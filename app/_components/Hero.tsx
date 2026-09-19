import Image from "next/image";
import { site } from "../_data/site";
import { HERO_LOGO_ID } from "../_lib/heroLogoVisibility";

export function Hero() {
  return (
    <section className="relative -mt-(--header-height) flex h-svh w-full items-center justify-center bg-paper px-4 max-sm:px-2">
      <h1 className="sr-only">{site.name}</h1>
      <Image
        id={HERO_LOGO_ID}
        src="/Lewis-Munro-Signature.gif"
        alt={site.name}
        width={800}
        height={150}
        unoptimized
        preload
        draggable={false}
        className="h-auto w-full max-w-[800px] select-none"
      />
    </section>
  );
}

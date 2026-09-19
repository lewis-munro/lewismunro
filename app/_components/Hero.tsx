import Image from "next/image";
import { site } from "../_data/site";

export function Hero() {
  return (
    <section className="relative -mt-(--header-height) flex h-svh w-full items-center bg-paper px-4 max-sm:px-2">
      <h1 className="sr-only">{site.name}</h1>
      <Image
        src="/Lewis-Munro-Signature.gif"
        alt={site.name}
        width={800}
        height={150}
        unoptimized
        preload
        draggable={false}
        className="h-auto w-full select-none"
      />
    </section>
  );
}

import Image from "next/image";
import { site } from "../_data/site";

export function Hero() {
  return (
    <section className="relative -mt-(--header-height) h-svh w-full">
      <h1 className="sr-only">{site.name}</h1>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 flex items-center justify-center px-4 max-sm:px-2"
      >
        <Image
          src="/Lewis-Munro-Signature.gif"
          alt=""
          width={800}
          height={150}
          unoptimized
          preload
          draggable={false}
          className="h-auto w-full max-w-[800px] select-none"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 z-[1] flex items-end justify-between gap-4 p-4 uppercase max-sm:gap-2 max-sm:p-2">
        <p>Fashion Stylist &amp; Consultant</p>
        <p className="text-right">London, Working Internationally</p>
      </div>
    </section>
  );
}

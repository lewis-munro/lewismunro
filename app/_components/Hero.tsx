import Image from "next/image";
import { site } from "../_data/site";

const heroImage = {
  src: "/media/glass-magazine/glass-magazine-01.jpg",
  alt: "Model in a pink coat sitting beside a dolls house",
};

export function Hero() {
  return (
    <section className="relative h-[calc(100svh-var(--header-height))] w-full overflow-hidden bg-ink">
      <h1 className="sr-only">{site.name}</h1>
      <Image
        src={heroImage.src}
        alt={heroImage.alt}
        fill
        preload
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 text-paper uppercase max-sm:gap-2 max-sm:p-2">
        <p>Fashion Stylist &amp; Consultant</p>
        <p className="text-right">London, Working Internationally</p>
      </div>
    </section>
  );
}

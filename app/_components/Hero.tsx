"use client";

import Image from "next/image";
import { useRef } from "react";
import { site } from "../_data/site";
import { useMountEffect } from "../_hooks/useMountEffect";
import { createFluidReveal } from "../_lib/fluidReveal";
import { createWordmarkPainter } from "../_lib/paintWordmark";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useMountEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const title = titleRef.current;
    if (!section || !canvas || !title) return;

    const tokens = getComputedStyle(section);
    const reveal = createFluidReveal({
      area: section,
      canvas,
      paintBase: createWordmarkPainter(title, section),
      rimColor: tokens.getPropertyValue("--color-accent").trim(),
      revealColor: tokens.getPropertyValue("--color-ink").trim(),
      autopilot: window.matchMedia("(hover: none)").matches,
      onReady: () => {
        section.dataset.ready = "";
      },
    });

    return () => {
      reveal?.destroy();
      delete section.dataset.ready;
    };
  });

  return (
    <section
      ref={sectionRef}
      className="group @container relative -mt-(--header-height) h-svh w-full cursor-default overflow-x-clip bg-paper select-none"
    >
      <div className="invisible absolute inset-0 flex items-center bg-ink group-data-ready:visible">
        <Image
          src="/Lewis-Munro-Signature.gif"
          alt=""
          width={800}
          height={150}
          unoptimized
          loading="eager"
          className="h-auto w-full"
        />
      </div>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 z-[1] block h-[calc(100%+50svh)] w-full" />
      <div className="relative flex h-full items-center">
        <h1
          ref={titleRef}
          className="w-full text-center font-chroma text-[calc(100cqw/8.8)] leading-none tracking-[-.04em] whitespace-nowrap text-ink uppercase group-data-ready:opacity-0"
        >
          {site.name}
        </h1>
      </div>
    </section>
  );
}

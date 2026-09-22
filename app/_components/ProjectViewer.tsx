"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type TouchEvent } from "react";
import { categoryLabels, projectHref, type MediaItem, type Project } from "../_data/projects";
import { useMountEffect } from "../_hooks/useMountEffect";

const easing = "duration-500 ease-[cubic-bezier(.4,0,.2,1)]";

const SWIPE_DISTANCE = 40;

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function mediaLabel(item: MediaItem) {
  return item.kind === "photo" ? item.alt : item.label;
}

type ProjectViewerProps = {
  project: Project;
  media: MediaItem[];
  previous: Project;
  next: Project;
};

export function ProjectViewer({ project, media, previous, next }: ProjectViewerProps) {
  const [index, setIndex] = useState(0);
  const [indexOpen, setIndexOpen] = useState(false);
  const touchStart = useRef<number | null>(null);
  const total = media.length;

  const step = (direction: number) => setIndex((current) => (current + direction + total) % total);

  const show = (target: number) => {
    setIndex(target);
    setIndexOpen(false);
  };

  useMountEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIndexOpen(false);
      if (event.key === "ArrowLeft") setIndex((current) => (current - 1 + total) % total);
      if (event.key === "ArrowRight") setIndex((current) => (current + 1) % total);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const onTouchStart = (event: TouchEvent) => {
    touchStart.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent) => {
    const start = touchStart.current;
    const end = event.changedTouches[0]?.clientX;
    touchStart.current = null;
    if (start === null || end === undefined) return;
    const distance = end - start;
    if (Math.abs(distance) >= SWIPE_DISTANCE) step(distance < 0 ? 1 : -1);
  };

  return (
    <>
      <main className="flex min-h-0 w-full flex-1 flex-col px-4 pb-4 max-sm:px-2 max-sm:pb-2">
        <div
          className="relative min-h-0 flex-1 select-none"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          aria-roledescription="carousel"
          aria-label={project.title}
        >
          {media.map((item, position) => {
            const active = position === index;
            return (
              <figure
                key={item.src}
                aria-hidden={!active}
                className={`absolute inset-0 transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}
              >
                {item.kind === "photo" ? (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="100vw"
                    preload={position === 0}
                    loading={position === 0 ? undefined : Math.abs(position - index) <= 1 ? "eager" : "lazy"}
                    draggable={false}
                    className="object-contain"
                  />
                ) : (
                  active && (
                    <video
                      src={item.src}
                      aria-label={item.label}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="size-full object-contain"
                    />
                  )
                )}
              </figure>
            );
          })}
          {total > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => step(-1)}
                className="absolute inset-y-0 left-0 w-1/2 cursor-w-resize"
              />
              <button
                type="button"
                aria-label="Next image"
                onClick={() => step(1)}
                className="absolute inset-y-0 right-0 w-1/2 cursor-e-resize"
              />
            </>
          )}
        </div>

        <div className="flex items-end justify-between gap-4 pt-3 max-sm:gap-2 max-sm:pt-2">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="uppercase">{categoryLabels[project.category]}</p>
            <h1 className="font-chroma text-md text-balance uppercase max-2xl:text-2xl-md max-sm:text-sm-md">
              {project.title}
            </h1>
          </div>
          <div className="flex shrink-0 items-end gap-6 uppercase max-sm:gap-3">
            <p aria-live="polite">
              {pad(index + 1)} / {pad(total)}
            </p>
            <button
              type="button"
              aria-expanded={indexOpen}
              aria-controls="project-index"
              onClick={() => setIndexOpen(true)}
              className="cursor-pointer uppercase transition-colors duration-300 hover:text-accent focus-visible:text-accent"
            >
              Contact sheet
            </button>
          </div>
        </div>
      </main>

      <button
        type="button"
        aria-label="Close contact sheet"
        tabIndex={-1}
        onClick={() => setIndexOpen(false)}
        className={`fixed inset-0 z-30 cursor-pointer bg-ink/40 transition-opacity ${easing} ${
          indexOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        id="project-index"
        role="dialog"
        aria-modal="true"
        aria-label={`Contact sheet for ${project.title}`}
        inert={!indexOpen}
        className={`fixed inset-x-0 bottom-0 z-30 flex max-h-[85svh] flex-col gap-6 overflow-y-auto bg-accent px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] text-paper transition-[translate,visibility] max-sm:gap-4 max-sm:px-2 max-sm:pt-2 ${easing} ${
          indexOpen ? "visible translate-y-0" : "invisible translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between uppercase">
          <span>
            {project.title} — {total} {total === 1 ? "image" : "images"}
          </span>
          <button
            type="button"
            onClick={() => setIndexOpen(false)}
            className="cursor-pointer uppercase transition-colors duration-300 hover:text-ink focus-visible:text-ink"
          >
            Close
          </button>
        </div>

        <ul className="grid grid-cols-8 gap-2 max-lg:grid-cols-6 max-sm:grid-cols-3">
          {media.map((item, position) => (
            <li key={item.src}>
              <button
                type="button"
                aria-label={`Show image ${position + 1}: ${mediaLabel(item)}`}
                aria-current={position === index ? "true" : undefined}
                onClick={() => show(position)}
                className="group flex w-full cursor-pointer flex-col gap-1 text-left"
              >
                <span
                  className={`relative block aspect-4/5 w-full overflow-hidden bg-ink outline-offset-2 outline-paper transition-[outline-width] duration-300 group-hover:outline-2 ${
                    position === index ? "outline-2" : "outline-0"
                  }`}
                >
                  {item.kind === "photo" ? (
                    <Image src={item.src} alt="" fill sizes="(max-width: 640px) 33vw, 12vw" className="object-cover" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center uppercase">Film</span>
                  )}
                </span>
                <span className="uppercase">{pad(position + 1)}</span>
              </button>
            </li>
          ))}
        </ul>

        <nav aria-label="More projects" className="flex justify-between gap-4 uppercase">
          <Link
            href={projectHref(previous)}
            className="flex flex-col gap-1 transition-colors duration-300 hover:text-ink focus-visible:text-ink"
          >
            <span>Previous project</span>
            <span className="font-chroma text-md max-2xl:text-2xl-md max-sm:text-sm-md">{previous.title}</span>
          </Link>
          <Link
            href={projectHref(next)}
            className="flex flex-col items-end gap-1 text-right transition-colors duration-300 hover:text-ink focus-visible:text-ink"
          >
            <span>Next project</span>
            <span className="font-chroma text-md max-2xl:text-2xl-md max-sm:text-sm-md">{next.title}</span>
          </Link>
        </nav>
      </div>
    </>
  );
}

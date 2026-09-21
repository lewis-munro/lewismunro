import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FadeImage } from "../../_components/FadeImage";
import { SiteFooter } from "../../_components/SiteFooter";
import { SiteHeader } from "../../_components/SiteHeader";
import {
  categoryLabels,
  findProject,
  neighbours,
  projectHref,
  projects,
  type Film,
  type Photo,
  type Project,
} from "../../_data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = findProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: `${project.title}, ${categoryLabels[project.category].toLowerCase()} styling by Lewis Munro.`,
  };
}

const MOBILE = "max-sm:col-start-1 max-sm:col-span-10";

const LANDSCAPE_RATIO = 1.05;
const TALL_RATIO = 0.7;

type MediaItem = ({ kind: "photo" } & Photo) | ({ kind: "film" } & Film);

function mediaOf(project: Project): MediaItem[] {
  return [
    ...project.photos.map((photo) => ({ kind: "photo" as const, ...photo })),
    ...(project.films ?? []).map((film) => ({ kind: "film" as const, ...film })),
  ];
}

function placeMedia(items: MediaItem[]) {
  let upright = 0;
  return items.map((item) => {
    const ratio = item.width / item.height;
    if (ratio > LANDSCAPE_RATIO) {
      return { item, className: `col-start-1 col-span-20 ${MOBILE}`, sizes: "100vw" };
    }
    const left = upright++ % 2 === 0;
    if (ratio < TALL_RATIO) {
      const column = left ? "col-start-1" : "col-start-12";
      return { item, className: `${column} col-span-9 ${MOBILE}`, sizes: "(max-width: 640px) 100vw, 45vw" };
    }
    const column = left ? "col-start-1" : "col-start-8";
    return { item, className: `${column} col-span-13 ${MOBILE}`, sizes: "(max-width: 640px) 100vw, 65vw" };
  });
}

const neighbourLink =
  "flex flex-col gap-1 transition-colors duration-300 hover:text-accent focus-visible:text-accent";

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = findProject(slug);
  if (!project) notFound();

  const { previous, next } = neighbours(project);

  return (
    <div className="flex min-h-screen w-full flex-col justify-between bg-paper">
      <SiteHeader />
      <main className="mb-auto w-full px-4 pt-10 pb-24 max-sm:px-2 max-sm:pt-6">
        <header className="flex flex-col gap-2">
          <p className="uppercase">{categoryLabels[project.category]}</p>
          <h1 className="font-chroma text-lg uppercase max-2xl:text-2xl-lg max-sm:text-sm-lg">{project.title}</h1>
        </header>

        <div className="mt-10 grid grid-cols-20 gap-4 max-sm:mt-6 max-sm:grid-cols-10 max-sm:gap-2">
          {placeMedia(mediaOf(project)).map(({ item, className, sizes }, index) => (
            <div key={item.src} className={className}>
              {item.kind === "photo" ? (
                <FadeImage
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  sizes={sizes}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  className="h-auto w-full"
                />
              ) : (
                <video
                  src={item.src}
                  width={item.width}
                  height={item.height}
                  aria-label={item.label}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="h-auto w-full bg-ink"
                />
              )}
            </div>
          ))}
        </div>

        <nav
          aria-label="More projects"
          className="mt-24 grid grid-cols-20 gap-4 uppercase max-sm:mt-16 max-sm:grid-cols-10 max-sm:gap-2"
        >
          <Link href={projectHref(previous)} className={`col-span-10 max-sm:col-span-5 ${neighbourLink}`}>
            <span>Previous</span>
            <span className="font-chroma text-md max-2xl:text-2xl-md max-sm:text-sm-md">{previous.title}</span>
          </Link>
          <Link
            href={projectHref(next)}
            className={`col-span-10 items-end text-right max-sm:col-span-5 ${neighbourLink}`}
          >
            <span>Next</span>
            <span className="font-chroma text-md max-2xl:text-2xl-md max-sm:text-sm-md">{next.title}</span>
          </Link>
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}

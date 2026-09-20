import type { Project } from "../_data/projects";
import { coverRatio, type Side, type Span } from "../_lib/layoutProjects";
import { FadeImage } from "./FadeImage";
import { ProjectLabel } from "./ProjectLabel";

type Placement = { className: string; sizes: string };

const MOBILE = "max-sm:col-start-1 max-sm:col-span-10";

const singlePlacements: Record<Span, Placement> = {
  left: { className: `col-start-1 col-span-13 ${MOBILE}`, sizes: "(max-width: 640px) 100vw, 65vw" },
  right: { className: `col-start-8 col-span-13 ${MOBILE}`, sizes: "(max-width: 640px) 100vw, 65vw" },
  "left-wide": { className: `col-start-1 col-span-16 ${MOBILE}`, sizes: "(max-width: 640px) 100vw, 80vw" },
  "right-wide": { className: `col-start-5 col-span-16 ${MOBILE}`, sizes: "(max-width: 640px) 100vw, 80vw" },
  full: { className: `col-start-1 col-span-20 ${MOBILE}`, sizes: "100vw" },
};

const pairPlacements: Record<Side, [string, string]> = {
  left: ["col-start-1 col-span-7", "col-start-8 col-span-7"],
  right: ["col-start-7 col-span-7", "col-start-14 col-span-7"],
};

const PAIR_SIZES = "(max-width: 640px) 100vw, 35vw";

type ProjectCardProps = {
  project: Project;
  placement: Placement;
  frameRatio?: number;
};

function ProjectCard({ project, placement, frameRatio }: ProjectCardProps) {
  const [cover] = project.photos;

  return (
    <div className={placement.className}>
      <div className="project-link group block">
        <div style={{ aspectRatio: frameRatio ?? coverRatio(project) }}>
          <FadeImage
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            sizes={placement.sizes}
            className="size-full object-contain"
          />
        </div>
        <ProjectLabel title={project.title} />
      </div>
    </div>
  );
}

export function ProjectSingle({ project, span }: { project: Project; span: Span }) {
  return <ProjectCard project={project} placement={singlePlacements[span]} />;
}

export function ProjectPair({ projects, side }: { projects: [Project, Project]; side: Side }) {
  const frameRatio = Math.min(...projects.map(coverRatio));

  return projects.map((project, index) => (
    <ProjectCard
      key={project.slug}
      project={project}
      frameRatio={frameRatio}
      placement={{ className: `${pairPlacements[side][index]} ${MOBILE}`, sizes: PAIR_SIZES }}
    />
  ));
}

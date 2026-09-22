import Link from "next/link";
import { projectHref, type Project } from "../_data/projects";
import { FadeImage } from "./FadeImage";
import { ProjectLabel } from "./ProjectLabel";

export function ProjectCard({ project }: { project: Project }) {
  const [cover] = project.photos;

  return (
    <Link href={projectHref(project)} className="project-link group block outline-none">
      <div className="relative aspect-3/4">
        <FadeImage
          src={cover.src}
          alt={cover.alt}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          className="object-contain object-bottom"
        />
      </div>
      <ProjectLabel title={project.title} />
    </Link>
  );
}

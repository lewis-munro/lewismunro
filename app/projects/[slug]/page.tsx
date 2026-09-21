import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectViewer } from "../../_components/ProjectViewer";
import { SiteHeader } from "../../_components/SiteHeader";
import { categoryLabels, findProject, neighbours, projectMedia, projects } from "../../_data/projects";

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

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = findProject(slug);
  if (!project) notFound();

  const { previous, next } = neighbours(project);

  return (
    <div className="flex h-svh w-full flex-col overflow-hidden bg-paper">
      <SiteHeader />
      <ProjectViewer
        key={project.slug}
        project={project}
        media={projectMedia(project)}
        previous={previous}
        next={next}
      />
    </div>
  );
}

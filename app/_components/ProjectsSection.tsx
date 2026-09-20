"use client";

import { useState } from "react";
import { projects, type Category } from "../_data/projects";
import { layoutProjects } from "../_lib/layoutProjects";
import { ProjectPair, ProjectSingle } from "./ProjectCard";

type Filter = Category | "all";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "editorial", label: "Editorial" },
  { value: "commercial", label: "Commercial" },
];

export function ProjectsSection() {
  const [filter, setFilter] = useState<Filter>("all");
  const visible = filter === "all" ? projects : projects.filter((project) => project.category === filter);
  const tiles = layoutProjects(visible);

  return (
    <section className="w-full px-4 pt-10 pb-24 max-sm:px-2">
      <nav aria-label="Filter projects" className="mb-10 max-sm:mb-6">
        <ul className="flex flex-wrap gap-x-4 font-chroma text-lg uppercase max-2xl:text-2xl-lg max-sm:gap-x-2 max-sm:text-sm-lg">
          {filters.map(({ value, label }) => (
            <li key={value}>
              <button
                type="button"
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
                className="cursor-pointer uppercase transition-colors duration-300 hover:text-accent aria-pressed:text-accent"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div
        key={filter}
        className="project-grid grid w-full animate-fade-in grid-cols-20 gap-4 max-sm:grid-cols-10 max-sm:gap-2"
      >
        {tiles.map((tile) =>
          tile.kind === "pair" ? (
            <ProjectPair key={tile.projects[0].slug} projects={tile.projects} side={tile.side} />
          ) : (
            <ProjectSingle key={tile.project.slug} project={tile.project} span={tile.span} />
          ),
        )}
      </div>
    </section>
  );
}

"use client";

import { useRef, useState } from "react";
import { projects, type Category } from "../_data/projects";
import { ProjectCard } from "./ProjectCard";

type Filter = Category | "all";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "editorial", label: "Editorial" },
  { value: "commercial", label: "Commercial" },
];

export function ProjectsSection() {
  const [filter, setFilter] = useState<Filter>("all");
  const navRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const visible = filter === "all" ? projects : projects.filter((project) => project.category === filter);

  const selectFilter = (value: Filter) => {
    const nav = navRef.current;
    const grid = gridRef.current;
    if (nav && grid) {
      const navBottom = nav.getBoundingClientRect().bottom;
      const gap = parseFloat(getComputedStyle(nav).marginBottom);
      const gridTop = grid.getBoundingClientRect().top;
      if (gridTop < navBottom + gap) {
        window.scrollTo({ top: window.scrollY + gridTop - navBottom - gap, behavior: "smooth" });
      }
    }
    setFilter(value);
  };

  return (
    <section className="w-full px-4 pt-10 pb-24 max-sm:px-2">
      <nav
        ref={navRef}
        aria-label="Filter projects"
        className="sticky top-(--header-height) z-[1] -mx-4 mb-10 flex items-center px-4 max-sm:-mx-2 max-sm:mb-6 max-sm:px-2"
      >
        <ul className="flex flex-wrap gap-x-4 font-chroma text-lg uppercase max-2xl:text-2xl-lg max-sm:gap-x-2 max-sm:text-sm-lg">
          {filters.map(({ value, label }) => (
            <li key={value}>
              <button
                type="button"
                aria-pressed={filter === value}
                onClick={() => selectFilter(value)}
                className="cursor-pointer uppercase transition-colors duration-300 hover:text-accent aria-pressed:text-accent"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div
        ref={gridRef}
        key={filter}
        className="project-grid grid w-full animate-fade-in grid-cols-3 gap-x-4 gap-y-10 max-sm:grid-cols-2 max-sm:gap-x-2 max-sm:gap-y-6"
      >
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}

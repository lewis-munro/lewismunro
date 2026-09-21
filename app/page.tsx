import { Hero } from "./_components/Hero";
import { ProjectsSection } from "./_components/ProjectsSection";
import { SiteHeader } from "./_components/SiteHeader";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <SiteHeader />
      <Hero />
      <main className="w-full">
        <ProjectsSection />
      </main>
    </div>
  );
}

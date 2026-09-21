import { Hero } from "./_components/Hero";
import { ProjectsSection } from "./_components/ProjectsSection";
import { SiteHeader } from "./_components/SiteHeader";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-clip bg-paper">
      <SiteHeader />
      <Hero />
      <main className="relative z-[1] w-full overflow-x-hidden">
        <ProjectsSection />
      </main>
    </div>
  );
}

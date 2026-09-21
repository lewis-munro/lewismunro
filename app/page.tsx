import { Hero } from "./_components/Hero";
import { ProjectsSection } from "./_components/ProjectsSection";
import { SiteFooter } from "./_components/SiteFooter";
import { SiteHeader } from "./_components/SiteHeader";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col justify-between">
      <SiteHeader />
      <Hero />
      <main className="mb-auto w-full">
        <ProjectsSection />
      </main>
      <SiteFooter />
    </div>
  );
}

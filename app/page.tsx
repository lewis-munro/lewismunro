import { Hero } from "./_components/Hero";
import { SiteHeader } from "./_components/SiteHeader";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-clip bg-paper">
      <SiteHeader />
      <Hero />
    </div>
  );
}

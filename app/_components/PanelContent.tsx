import { site } from "../_data/site";

export type PanelName = "bio" | "contact";

export const panelTitles: Record<PanelName, string> = {
  bio: "Bio",
  contact: "Contact",
};

function BioPanel() {
  return (
    <>
      <p>{site.bio}</p>
      <div>
        <span>Clients</span>
        <p>{site.clients.join(", ")}</p>
      </div>
      <div>
        <span>Publications</span>
        <p>{site.publications.join(", ")}</p>
      </div>
    </>
  );
}

function ContactPanel() {
  return (
    <div className="flex flex-col">
      <a href={`mailto:${site.email}`} className="self-start transition-colors duration-300 hover:text-ink">
        {site.email}
      </a>
      <a href={site.instagram} target="_blank" rel="noreferrer" className="self-start transition-colors duration-300 hover:text-ink">
        Instagram
      </a>
    </div>
  );
}

export function PanelContent({ panel }: { panel: PanelName }) {
  return panel === "bio" ? <BioPanel /> : <ContactPanel />;
}

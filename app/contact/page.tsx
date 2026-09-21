import type { Metadata } from "next";
import { SubPage } from "../_components/SubPage";
import { site } from "../_data/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${site.name}: ${site.email}`,
};

const contactLink =
  "self-start font-chroma text-lg uppercase transition-colors duration-300 hover:text-accent focus-visible:text-accent max-2xl:text-2xl-lg max-sm:text-sm-lg";

export default function ContactPage() {
  return (
    <SubPage title="Contact">
      <ul className="col-span-20 flex flex-col max-sm:col-span-10">
        <li>
          <a href={`mailto:${site.email}`} className={contactLink}>
            {site.email}
          </a>
        </li>
        <li>
          <a href={site.instagram} target="_blank" rel="noreferrer" className={contactLink}>
            Instagram
          </a>
        </li>
      </ul>
    </SubPage>
  );
}

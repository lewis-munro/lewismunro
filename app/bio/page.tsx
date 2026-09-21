import type { Metadata } from "next";
import { SubPage } from "../_components/SubPage";
import { site } from "../_data/site";

export const metadata: Metadata = {
  title: "Bio",
  description: site.bio,
};

const statement = "col-span-14 font-chroma text-md uppercase max-2xl:text-2xl-md max-lg:col-span-20 max-sm:col-span-10 max-sm:text-sm-md";

const listBlock = "col-span-10 mt-16 flex flex-col gap-2 max-sm:mt-8";

const listText = "font-chroma text-md uppercase max-2xl:text-2xl-md max-sm:text-sm-md";

export default function BioPage() {
  return (
    <SubPage title="Bio">
      <p className={statement}>{site.bio}</p>
      <section className={listBlock}>
        <h2 className="uppercase">Clients</h2>
        <p className={listText}>{site.clients.join(", ")}</p>
      </section>
      <section className={listBlock}>
        <h2 className="uppercase">Publications</h2>
        <p className={listText}>{site.publications.join(", ")}</p>
      </section>
    </SubPage>
  );
}

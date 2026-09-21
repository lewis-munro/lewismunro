import { site } from "../_data/site";

export function SiteFooter() {
  return (
    <footer className="relative z-[1] flex w-full items-center justify-between gap-4 p-4 uppercase max-sm:grid max-sm:grid-cols-2 max-sm:gap-2 max-sm:p-2">
      <div className="flex gap-6 max-sm:flex-col max-sm:items-start max-sm:gap-0">
        <span>
          © {site.name} {new Date().getFullYear()}
        </span>
        <span>All rights reserved</span>
      </div>
      <nav>
        <ul className="flex items-center gap-6 max-sm:flex-col max-sm:items-start max-sm:gap-0">
          <li>
            <a href={`mailto:${site.email}`} className="transition-colors duration-300 hover:text-accent">
              {site.email}
            </a>
          </li>
          <li>
            <a
              href={site.instagram}
              target="_blank"
              rel="noreferrer"
              className="transition-colors duration-300 hover:text-accent"
            >
              Instagram
            </a>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { pages, site } from "../_data/site";
import { MenuIcon } from "./Icons";

const barLayout =
  "flex h-(--header-height) w-full items-center gap-4 px-4 pt-1 font-chroma text-lg uppercase max-2xl:text-2xl-lg max-sm:gap-2 max-sm:px-2 max-sm:text-sm-lg";

const easing = "duration-500 ease-[cubic-bezier(.4,0,.2,1)]";

const sheetLink =
  "inline-block cursor-pointer uppercase transition-[color,translate] duration-300 ease-out hover:translate-x-[.2em] hover:text-ink focus-visible:translate-x-[.2em] focus-visible:text-ink aria-[current=page]:text-ink";

const smallLink = "cursor-pointer uppercase transition-colors duration-300 hover:text-ink focus-visible:text-ink";

export function SiteHeader({ showLogo = false }: { showLogo?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {showLogo && (
        <div className={`pointer-events-none fixed top-0 left-0 z-[11] w-auto ${barLayout}`}>
          <Link href="/" className="pointer-events-auto flex">
            <Image
              src="/Lewis-Munro-Signature.gif"
              alt={site.name}
              width={800}
              height={150}
              unoptimized
              draggable={false}
              className="h-[.8em] w-auto select-none"
            />
          </Link>
        </div>
      )}

      <header className={`sticky top-0 z-10 justify-end text-white mix-blend-exclusion ${barLayout}`}>
        <nav>
          <ul className="flex items-center gap-4 max-sm:gap-2">
            <li>
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="site-menu"
                onClick={() => setMenuOpen(true)}
                className="group flex cursor-pointer items-center"
              >
                <MenuIcon />
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <button
        type="button"
        aria-label="Close menu"
        tabIndex={-1}
        onClick={closeMenu}
        className={`fixed inset-0 z-30 cursor-pointer bg-ink/40 transition-opacity ${easing} ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!menuOpen}
        className={`fixed inset-x-0 bottom-0 z-30 flex flex-col gap-10 bg-accent px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] text-paper transition-[translate,visibility] max-sm:gap-8 max-sm:px-2 max-sm:pt-2 ${easing} ${
          menuOpen ? "visible translate-y-0" : "invisible translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between uppercase">
          <span>Menu</span>
          <button type="button" onClick={closeMenu} className={smallLink}>
            Close
          </button>
        </div>
        <ul className="flex flex-col font-chroma text-lg uppercase max-2xl:text-2xl-lg max-sm:text-sm-lg">
          {pages.map(({ href, label }) => (
            <li key={href} className="opacity-60">
              {label}
            </li>
          ))}
          <li>
            <a href={site.instagram} target="_blank" rel="noreferrer" className={sheetLink}>
              Instagram
            </a>
          </li>
        </ul>
        <a href={`mailto:${site.email}`} className={`self-start ${smallLink}`}>
          {site.email}
        </a>
      </div>
    </>
  );
}

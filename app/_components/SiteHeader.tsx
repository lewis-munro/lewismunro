"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useMountEffect } from "../_hooks/useMountEffect";
import { pages, site } from "../_data/site";
import { MenuIcon } from "./Icons";

const barLayout =
  "flex h-(--header-height) w-full items-center gap-4 px-4 pt-1 font-chroma text-lg uppercase max-2xl:text-2xl-lg max-sm:gap-2 max-sm:px-2 max-sm:text-sm-lg";

const easing = "duration-500 ease-[cubic-bezier(.4,0,.2,1)]";

const sheetLink =
  "inline-block cursor-pointer uppercase transition-[color,translate] duration-300 ease-out hover:translate-x-[.2em] hover:text-ink focus-visible:translate-x-[.2em] focus-visible:text-ink aria-[current=page]:text-ink";

const smallLink = "cursor-pointer uppercase transition-colors duration-300 hover:text-ink focus-visible:text-ink";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  useMountEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <>
      <div className={`pointer-events-none fixed top-0 left-0 z-[11] w-auto ${barLayout}`}>
        <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className="pointer-events-auto flex">
          <Image
            src="/Lewis-Munro-Signature.gif"
            alt={site.name}
            width={800}
            height={150}
            unoptimized
            preload
            draggable={false}
            className="h-[.8em] w-auto select-none"
          />
        </Link>
      </div>

      <header className={`sticky top-0 z-10 justify-end bg-paper ${barLayout}`}>
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
        className={`fixed inset-x-0 top-0 z-30 flex flex-col gap-10 bg-accent px-4 pb-10 text-paper transition-[translate,visibility] max-sm:gap-8 max-sm:px-2 max-sm:pb-6 ${easing} ${
          menuOpen ? "visible translate-y-0" : "invisible -translate-y-full"
        }`}
      >
        <div className="flex h-(--header-height) items-center justify-between pt-1 uppercase">
          <span>Menu</span>
          <button type="button" onClick={closeMenu} className={smallLink}>
            Close
          </button>
        </div>
        <ul className="flex flex-col font-chroma text-lg uppercase max-2xl:text-2xl-lg max-sm:text-sm-lg">
          {pages.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={closeMenu}
                aria-current={pathname === href ? "page" : undefined}
                className={sheetLink}
              >
                {label}
              </Link>
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

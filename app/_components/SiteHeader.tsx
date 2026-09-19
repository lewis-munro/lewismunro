"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { site } from "../_data/site";
import {
  isHeroLogoOutOfView,
  isHeroLogoOutOfViewOnServer,
  subscribeToHeroLogo,
} from "../_lib/heroLogoVisibility";
import { MenuIcon } from "./Icons";
import { PanelContent, panelTitles, type PanelName } from "./PanelContent";

const barLayout =
  "flex h-(--header-height) w-full items-center gap-4 px-4 pt-1 font-chroma text-lg uppercase max-2xl:text-2xl-lg max-sm:gap-2 max-sm:px-2 max-sm:text-sm-lg";

const barClasses = `sticky top-0 z-10 justify-between ${barLayout}`;

const easing = "duration-500 ease-[cubic-bezier(.4,0,.2,1)]";

const panelNames: PanelName[] = ["bio", "contact"];

const sheetLink =
  "inline-block cursor-pointer uppercase transition-[color,translate] duration-300 ease-out hover:translate-x-[.2em] hover:text-ink focus-visible:translate-x-[.2em] focus-visible:text-ink";

const smallLink = "cursor-pointer uppercase transition-colors duration-300 hover:text-ink focus-visible:text-ink";

export function SiteHeader() {
  const [panel, setPanel] = useState<PanelName>("bio");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const showLogo = useSyncExternalStore(subscribeToHeroLogo, isHeroLogoOutOfView, isHeroLogoOutOfViewOnServer);

  const openPanel = (name: PanelName) => {
    setPanel(name);
    setMenuOpen(false);
    setDrawerOpen(true);
  };

  return (
    <>
      <div className={`pointer-events-none fixed top-0 left-0 z-10 w-auto ${barLayout}`}>
        <Link
          href="/"
          aria-current="page"
          aria-hidden={!showLogo}
          tabIndex={showLogo ? 0 : -1}
          className={`flex transition-[opacity,translate,visibility] ${easing} ${
            showLogo ? "pointer-events-auto visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
          }`}
        >
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

      <header className={`sticky top-0 z-10 justify-end text-white mix-blend-exclusion ${barLayout}`}>
        <nav>
          <ul className="flex items-center gap-4 max-sm:gap-2">
            <li>
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
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
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-30 cursor-pointer bg-ink/40 transition-opacity ${easing} ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        id="mobile-menu"
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
          <button type="button" onClick={() => setMenuOpen(false)} className={smallLink}>
            Close
          </button>
        </div>
        <ul className="flex flex-col font-chroma text-lg uppercase max-2xl:text-2xl-lg max-sm:text-sm-lg">
          {panelNames.map((name) => (
            <li key={name}>
              <button type="button" onClick={() => openPanel(name)} className={sheetLink}>
                {panelTitles[name]}
              </button>
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

      <div
        inert={!drawerOpen}
        className={`fixed top-0 right-0 z-20 h-full w-[calc(50%+.75rem)] overflow-y-scroll bg-accent text-paper transition-[translate,visibility] max-lg:w-full ${easing} ${
          drawerOpen ? "visible translate-x-0" : "invisible translate-x-full"
        }`}
      >
        <div className={barClasses}>
          <span>{panelTitles[panel]}</span>
          <button type="button" onClick={() => setDrawerOpen(false)} className={smallLink}>
            Close
          </button>
        </div>
        <section className="grid w-full grid-cols-20 gap-4 px-4 max-sm:grid-cols-10 max-sm:gap-2 max-sm:px-2">
          <div className="col-span-20 flex min-h-[calc(100dvh-5rem)] flex-col gap-4 pt-10 pb-4 font-chroma text-md uppercase max-2xl:text-2xl-md max-sm:col-span-10 max-sm:min-h-[calc(100dvh-4rem)] max-sm:gap-2 max-sm:pb-2 max-sm:text-sm-md">
            <PanelContent panel={panel} />
          </div>
        </section>
      </div>
    </>
  );
}

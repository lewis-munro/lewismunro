export const HERO_LOGO_ID = "hero-logo";

let heroLogoOutOfView = false;

export function subscribeToHeroLogo(onChange: () => void) {
  const logo = document.getElementById(HERO_LOGO_ID);
  if (!logo) return () => {};

  const header = document.querySelector("header");
  const headerHeight = header?.getBoundingClientRect().height ?? 0;

  const observer = new IntersectionObserver(
    ([entry]) => {
      heroLogoOutOfView = !entry.isIntersecting;
      onChange();
    },
    { rootMargin: `-${Math.round(headerHeight)}px 0px 0px 0px` },
  );
  observer.observe(logo);

  return () => observer.disconnect();
}

export function isHeroLogoOutOfView() {
  return heroLogoOutOfView;
}

export function isHeroLogoOutOfViewOnServer() {
  return false;
}

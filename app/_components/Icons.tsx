export function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[.75em] w-[.75em]" aria-hidden="true">
      <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="12" cy="12" r="4.75" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="18.1" cy="5.9" r="1.6" fill="currentColor" />
    </svg>
  );
}

export function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[.7em] w-[.8em] overflow-visible" aria-hidden="true">
      <rect
        x="0"
        y="4"
        width="24"
        height="3.5"
        fill="currentColor"
        className="transition-transform duration-300 ease-out group-hover:-translate-y-[3px] group-focus-visible:-translate-y-[3px]"
      />
      <rect
        x="0"
        y="16.5"
        width="24"
        height="3.5"
        fill="currentColor"
        className="transition-transform duration-300 ease-out group-hover:translate-y-[3px] group-focus-visible:translate-y-[3px]"
      />
    </svg>
  );
}

type Props = { name: "cart" | "search" | "user" | "menu" | "close" | "bolt" | "shield" | "truck" | "return" };

export function Icon({ name }: Props) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "cart":
      return (
        <svg viewBox="0 0 24 24" {...common} width={19} height={19}>
          <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" />
          <circle cx="10" cy="20" r="1.4" />
          <circle cx="18" cy="20" r="1.4" />
        </svg>
      );
    case "search":
      return (
        <svg viewBox="0 0 24 24" {...common} width={15} height={15}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      );
    case "user":
      return (
        <svg viewBox="0 0 24 24" {...common} width={19} height={19}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
      );
    case "menu":
      return (
        <svg viewBox="0 0 24 24" {...common} width={20} height={20}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      );
    case "close":
      return (
        <svg viewBox="0 0 24 24" {...common} width={20} height={20}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      );
    case "bolt":
      return (
        <svg viewBox="0 0 24 24" {...common} width={20} height={20}>
          <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" {...common} width={20} height={20}>
          <path d="M12 3l7 3v6c0 4.4-3 8-7 9-4-1-7-4.6-7-9V6z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "truck":
      return (
        <svg viewBox="0 0 24 24" {...common} width={20} height={20}>
          <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
          <circle cx="7" cy="18" r="1.6" />
          <circle cx="17.5" cy="18" r="1.6" />
        </svg>
      );
    case "return":
      return (
        <svg viewBox="0 0 24 24" {...common} width={20} height={20}>
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <path d="M3 4v5h5" />
        </svg>
      );
  }
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "./Icon";

const links = [
  { href: "/products", label: "Όλα τα προϊόντα" },
  { href: "/collections/keyboards", label: "Πληκτρολόγια" },
  { href: "/collections/mice", label: "Ποντίκια" },
  { href: "/collections/headsets", label: "Headsets" },
  { href: "/collections/monitors", label: "Monitors" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="header__toggle"
        aria-expanded={open}
        aria-controls="SiteNav"
        aria-label="Μενού"
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name={open ? "close" : "menu"} />
      </button>

      <nav className={`header__nav${open ? " is-open" : ""}`} id="SiteNav">
        <ul className="header__menu">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

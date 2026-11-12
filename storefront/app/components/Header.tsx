import Link from "next/link";
import { getCartCount } from "@/lib/cart";
import { Icon } from "./Icon";
import { Nav } from "./Nav";

export async function Header() {
  const count = await getCartCount();

  return (
    <header className="header">
      <div className="page-width header__inner">
        <Nav />

        <Link href="/" className="header__logo">
          <span className="header__logo-mark" aria-hidden="true">
            TN
          </span>
          <span>TechNest</span>
        </Link>

        <form action="/search" method="get" role="search" className="header__search">
          <input type="search" name="q" placeholder="Αναζήτηση gear…" aria-label="Αναζήτηση" />
          <button type="submit" aria-label="Αναζήτηση">
            <Icon name="search" />
          </button>
        </form>

        <div className="header__actions">
          <Link className="header__action" href="/search">
            <Icon name="search" />
          </Link>
          <Link className="header__action" href="/cart">
            <Icon name="cart" />
            <span className="label">Καλάθι</span>
            <span className="cart-count" hidden={count === 0} aria-live="polite">
              {count}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

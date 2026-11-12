import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-width site-footer__grid">
        <div>
          <Link href="/" className="header__logo" style={{ marginBottom: ".75rem" }}>
            <span className="header__logo-mark" aria-hidden="true">
              TN
            </span>
            <span>TechNest</span>
          </Link>
          <p className="muted small" style={{ maxWidth: "34ch" }}>
            Gaming gear για παίκτες που δεν συμβιβάζονται. Επιλεγμένα προϊόντα, γρήγορη παράδοση, πραγματική υποστήριξη.
          </p>
        </div>

        <div>
          <h3>Κατάστημα</h3>
          <ul>
            <li><Link href="/products">Όλα τα προϊόντα</Link></li>
            <li><Link href="/collections/keyboards">Πληκτρολόγια</Link></li>
            <li><Link href="/collections/mice">Ποντίκια</Link></li>
            <li><Link href="/collections/headsets">Headsets</Link></li>
            <li><Link href="/collections/monitors">Monitors</Link></li>
          </ul>
        </div>

        <div>
          <h3>Υποστήριξη</h3>
          <ul>
            <li><Link href="/search">Αναζήτηση</Link></li>
            <li><Link href="/cart">Καλάθι</Link></li>
            <li><a href="mailto:support@technest.gr">support@technest.gr</a></li>
            <li><a href="tel:+302610000000">2610 000 000</a></li>
          </ul>
        </div>

        <div>
          <h3>Παράδοση</h3>
          <ul>
            <li><span className="muted small">Δωρεάν άνω των 60€</span></li>
            <li><span className="muted small">Αποστολή 24h</span></li>
            <li><span className="muted small">Επιστροφές 14 ημερών</span></li>
            <li><span className="muted small">Εγγύηση 2 ετών</span></li>
          </ul>
        </div>
      </div>

      <div className="page-width site-footer__bottom">
        <span>© {new Date().getFullYear()} TechNest. Όλα τα δικαιώματα διατηρούνται.</span>
        <span>Powered by Shopify · Next.js</span>
      </div>
    </footer>
  );
}

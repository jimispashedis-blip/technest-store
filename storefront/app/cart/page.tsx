import type { Metadata } from "next";
import Link from "next/link";
import { CartLineControls } from "../components/CartLineControls";
import { getCart } from "@/lib/cart";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = {
  title: "Καλάθι",
  robots: { index: false },
};

const FREE_SHIPPING = 60;

export default async function CartPage() {
  const cart = await getCart();
  const subtotal = Number(cart.subtotal.amount);
  const remaining = Math.max(0, FREE_SHIPPING - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING) * 100);

  return (
    <div className="cart page-width">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Αρχική</Link>
        <span aria-hidden="true">/</span>
        <span>Καλάθι</span>
      </nav>
      <h1>Το καλάθι σου</h1>

      {cart.lines.length === 0 ? (
        <div className="empty-state">
          <h2>Το καλάθι σου είναι άδειο.</h2>
          <p>Ρίξε μια ματιά στα τελευταία drops.</p>
          <Link className="btn" href="/products">
            Συνέχισε τις αγορές
          </Link>
        </div>
      ) : (
        <div className="cart__grid">
          <div>
            <ul className="cart__lines">
              {cart.lines.map((line) => (
                <li className="cart-line" key={line.id}>
                  <Link className="cart-line__media" href={`/products/${line.handle}`}>
                    {line.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={line.image.url} alt={line.image.altText ?? line.title} />
                    ) : null}
                  </Link>
                  <div>
                    <p className="cart-line__title">
                      <Link href={`/products/${line.handle}`}>{line.title}</Link>
                    </p>
                    {line.variantTitle && line.variantTitle !== "Default Title" ? (
                      <p className="cart-line__variant">{line.variantTitle}</p>
                    ) : null}
                    <CartLineControls lineId={line.id} quantity={line.quantity} />
                  </div>
                  <div className="cart-line__price">{formatMoney(line.lineTotal)}</div>
                </li>
              ))}
            </ul>
          </div>

          <aside className="cart-summary">
            <h2>Σύνοψη</h2>
            <div className="cart-summary__row">
              <span>Υποσύνολο</span>
              <span>{formatMoney(cart.subtotal)}</span>
            </div>
            <div className="cart-summary__row">
              <span>Αποστολή</span>
              <span>{remaining === 0 ? "Δωρεάν" : "Υπολογίζεται στο checkout"}</span>
            </div>
            <div className="cart-summary__row cart-summary__row--total">
              <span>Σύνολο</span>
              <span>{formatMoney(cart.total)}</span>
            </div>

            <p className="small muted mt-2">
              {remaining === 0 ? "Έχεις κερδίσει δωρεάν αποστολή 🎉" : `Σου λείπουν ${formatMoney({ amount: remaining.toFixed(2), currencyCode: "EUR" })} για δωρεάν αποστολή.`}
            </p>
            <div className="free-ship-bar">
              <span style={{ width: `${progress}%` }} />
            </div>

            {cart.checkoutUrl ? (
              <a className="btn btn--full" href={cart.checkoutUrl}>
                Ολοκλήρωση παραγγελίας
              </a>
            ) : (
              <>
                <button className="btn btn--full" type="button" disabled>
                  Ολοκλήρωση παραγγελίας
                </button>
                <p className="cart-summary__note">
                  Demo mode: το checkout ενεργοποιείται όταν συνδέσεις το Shopify store σου.
                </p>
              </>
            )}
            <p className="cart-summary__note">Δωρεάν αποστολή για παραγγελίες άνω των 60€</p>
          </aside>
        </div>
      )}
    </div>
  );
}

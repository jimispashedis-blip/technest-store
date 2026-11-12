import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "../components/ProductCard";
import { searchProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Αναζήτηση",
  robots: { index: false },
};

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const term = (q ?? "").trim();
  const results = term ? await searchProducts(term) : [];

  return (
    <div className="page-width section">
      <div className="section__head">
        <div>
          <p className="section__eyebrow">Αναζήτηση</p>
          <h1 className="section__title">{term ? `Αποτελέσματα για “${term}”` : "Τι ψάχνεις;"}</h1>
        </div>
      </div>

      <form action="/search" method="get" role="search" style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <input
          type="search"
          name="q"
          defaultValue={term}
          placeholder="Αναζήτηση προϊόντων, brands…"
          aria-label="Αναζήτηση"
          style={{
            flex: 1,
            minWidth: "240px",
            padding: ".85rem 1rem",
            borderRadius: 999,
            border: "1px solid var(--color-border-strong)",
            background: "var(--color-surface-2)",
            color: "var(--color-text)",
            font: "inherit",
          }}
        />
        <button className="btn" type="submit">
          Αναζήτηση
        </button>
      </form>

      {term ? (
        results.length > 0 ? (
          <>
            <p className="muted">{results.length} αποτελέσματα</p>
            <div className="product-grid">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <h2>Δεν βρήκαμε αποτελέσματα.</h2>
            <p>Δοκίμασε διαφορετικό όρο, π.χ. “headset” ή “keyboard”.</p>
            <Link className="btn" href="/products">
              Δες όλα τα προϊόντα
            </Link>
          </div>
        )
      ) : (
        <div className="chips">
          {["keyboard", "mouse", "headset", "monitor", "stream deck"].map((suggestion) => (
            <Link key={suggestion} className="chip-link" href={`/search?q=${encodeURIComponent(suggestion)}`}>
              {suggestion}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

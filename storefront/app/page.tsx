import Link from "next/link";
import { Newsletter } from "./components/Newsletter";
import { ProductCard } from "./components/ProductCard";
import { Icon } from "./components/Icon";
import { getCollections, getProducts } from "@/lib/shopify";

export default async function HomePage() {
  const [products, collections] = await Promise.all([getProducts(8), getCollections()]);

  return (
    <>
      <section className="hero">
        <div className="page-width hero__grid">
          <div>
            <span className="hero__badge">Νέα συλλογή · 2025</span>
            <h1 className="hero__title">
              Το setup σου <br />
              <em>αξίζει το επόμενο level.</em>
            </h1>
            <p className="hero__text">
              Πληκτρολόγια, ποντίκια, headsets και monitors επιλεγμένα ένα-ένα. Γρήγορη αποστολή σε όλη την Ελλάδα
              και εγγύηση 2 ετών.
            </p>
            <div className="hero__actions">
              <Link className="btn" href="/products">
                Δες τα drops
              </Link>
              <Link className="btn btn--secondary" href="/collections/keyboards">
                Πληκτρολόγια
              </Link>
            </div>
            <div className="hero__stats">
              <div className="hero__stat">
                <strong>24h</strong>
                <span>Αποστολή</span>
              </div>
              <div className="hero__stat">
                <strong>2 έτη</strong>
                <span>Εγγύηση</span>
              </div>
              <div className="hero__stat">
                <strong>4.9/5</strong>
                <span>1.200+ αξιολογήσεις</span>
              </div>
            </div>
          </div>

          <div className="hero__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/hero-setup.jpg" alt="Gaming setup TechNest" />
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="page-width">
          <div className="feature-strip">
            <div className="feature">
              <span className="feature__icon"><Icon name="truck" /></span>
              <div>
                <strong>Δωρεάν αποστολή</strong>
                <span>Άνω των 60€</span>
              </div>
            </div>
            <div className="feature">
              <span className="feature__icon"><Icon name="bolt" /></span>
              <div>
                <strong>Αποστολή 24h</strong>
                <span>Παραγγελίες έως 15:00</span>
              </div>
            </div>
            <div className="feature">
              <span className="feature__icon"><Icon name="shield" /></span>
              <div>
                <strong>Εγγύηση 2 ετών</strong>
                <span>Επίσημος αντιπρόσωπος</span>
              </div>
            </div>
            <div className="feature">
              <span className="feature__icon"><Icon name="return" /></span>
              <div>
                <strong>Επιστροφή 14 ημερών</strong>
                <span>Χωρίς ερωτήσεις</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-width">
          <div className="section__head">
            <div>
              <p className="section__eyebrow">Best sellers</p>
              <h2 className="section__title">Τα αγαπημένα της κοινότητας</h2>
              <p className="section__subtitle">Τα προϊόντα που ζητάνε περισσότεροι παίκτες.</p>
            </div>
            <Link className="link-arrow" href="/products">
              Δες όλα
            </Link>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="page-width">
          <div className="section__head">
            <div>
              <p className="section__eyebrow">Κατηγορίες</p>
              <h2 className="section__title">Βρες το gear σου</h2>
            </div>
          </div>
          <div className="product-grid" style={{ ["--columns" as string]: 3 }}>
            {collections.map((collection) => (
              <Link key={collection.handle} className="product-card" href={`/collections/${collection.handle}`}>
                <div className="product-card__media">
                  {collection.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={collection.image.url} alt={collection.image.altText ?? collection.title} loading="lazy" />
                  ) : null}
                </div>
                <div className="product-card__body">
                  <h3 className="product-card__title">{collection.title}</h3>
                  <p className="product-card__vendor">{collection.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}

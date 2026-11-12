import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartForm } from "../../components/AddToCartForm";
import { Price } from "../../components/Price";
import { ProductCard } from "../../components/ProductCard";
import { getProduct, getProducts } from "@/lib/shopify";

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return { title: "Το προϊόν δεν βρέθηκε" };
  return {
    title: product.title,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: product.featuredImage ? [{ url: product.featuredImage.url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();

  const all = await getProducts(12);
  const related = all.filter((p) => p.handle !== product.handle).slice(0, 4);
  const gallery = product.images.length > 0 ? product.images : [];

  return (
    <div className="page-width">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/">Αρχική</Link>
        <span aria-hidden="true">/</span>
        <Link href="/products">Προϊόντα</Link>
        <span aria-hidden="true">/</span>
        <span>{product.title}</span>
      </nav>

      <div className="product">
        <div className="product__gallery">
          <div className="product__main-image">
            {product.featuredImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.featuredImage.url} alt={product.featuredImage.altText ?? product.title} />
            ) : null}
          </div>
          {gallery.length > 1 ? (
            <div className="detail-gallery__thumbs">
              {gallery.slice(0, 4).map((image, index) => (
                <div className="detail-gallery__thumb" key={image.url + index}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image.url} alt={image.altText ?? product.title} loading="lazy" />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="product__info">
          <p className="product__vendor">{product.vendor}</p>
          <h1 className="product__title">{product.title}</h1>
          <div className="product__price">
            <Price price={product.price} compareAt={product.compareAtPrice} size="lg" />
          </div>
          <p className={`stock${product.availableForSale ? "" : " stock--out"}`}>
            {product.availableForSale ? "Διαθέσιμο" : "Εξαντλημένο"}
          </p>

          <AddToCartForm product={product} />

          <div className="product__meta">
            <div>
              Αποστολή: <span>1–3 εργάσιμες</span>
            </div>
            <div>
              Εγγύηση: <span>2 έτη</span>
            </div>
            <div>
              Επιστροφή: <span>14 ημέρες</span>
            </div>
            <div>
              Πληρωμή: <span>Κάρτα, PayPal, αντικαταβολή</span>
            </div>
          </div>

          <div className="product__description rte">
            <h2>Περιγραφή</h2>
            <p>{product.description}</p>
            <ul className="spec-list">
              <li>
                <span>Brand</span>
                <strong>{product.vendor}</strong>
              </li>
              <li>
                <span>Κατηγορία</span>
                <strong>{product.tags.filter((t) => !t.startsWith("badge:")).slice(0, 2).join(", ") || "Gaming"}</strong>
              </li>
              <li>
                <span>Διαθεσιμότητα</span>
                <strong>{product.availableForSale ? "Άμεσα διαθέσιμο" : "Μη διαθέσιμο"}</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="section">
          <div className="section__head">
            <div>
              <p className="section__eyebrow">Πρόταση</p>
              <h2 className="section__title">Πάει καλά με</h2>
            </div>
            <Link className="link-arrow" href="/products">
              Όλα τα προϊόντα
            </Link>
          </div>
          <div className="product-grid">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

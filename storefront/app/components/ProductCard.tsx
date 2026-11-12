import Link from "next/link";
import type { Product } from "@/lib/types";
import { Price } from "./Price";

export function ProductCard({ product }: { product: Product }) {
  const badge = product.tags.find((tag) => tag.toLowerCase().startsWith("badge:"));
  const onSale = product.compareAtPrice && Number(product.compareAtPrice.amount) > Number(product.price.amount);

  return (
    <article className="product-card">
      <Link className="product-card__media" href={`/products/${product.handle}`} aria-label={product.title}>
        <div className="product-card__badges">
          {!product.availableForSale ? (
            <span className="badge badge--soldout">Εξαντλήθηκε</span>
          ) : onSale ? (
            <span className="badge badge--sale">Προσφορά</span>
          ) : null}
          {badge ? <span className="badge">{badge.split(":")[1]}</span> : null}
        </div>
        {product.featuredImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.featuredImage.url} alt={product.featuredImage.altText ?? product.title} loading="lazy" />
        ) : (
          <div style={{ display: "grid", placeItems: "center", height: "100%", color: "var(--color-muted)" }}>
            No image
          </div>
        )}
      </Link>

      <div className="product-card__body">
        <p className="product-card__vendor">{product.vendor}</p>
        <h3 className="product-card__title">
          <Link href={`/products/${product.handle}`}>{product.title}</Link>
        </h3>
        <div className="product-card__footer">
          <Price price={product.price} compareAt={product.compareAtPrice} />
          <Link className="product-card__quick" href={`/products/${product.handle}`}>
            Δες
          </Link>
        </div>
      </div>
    </article>
  );
}

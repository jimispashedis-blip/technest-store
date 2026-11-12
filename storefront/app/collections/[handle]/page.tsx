import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "../../components/ProductCard";
import { getCollection } from "@/lib/shopify";

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const { collection } = await getCollection(handle);
  if (!collection) return { title: "Η συλλογή δεν βρέθηκε" };
  return {
    title: collection.title,
    description: collection.description || `Η συλλογή ${collection.title} του TechNest.`,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { handle } = await params;
  const { collection, products } = await getCollection(handle);
  if (!collection) notFound();

  return (
    <>
      <div className="collection-hero">
        <div className="page-width">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Αρχική</Link>
            <span aria-hidden="true">/</span>
            <span>{collection.title}</span>
          </nav>
          <h1 className="collection-hero__title">{collection.title}</h1>
          {collection.description ? <p className="collection-hero__description">{collection.description}</p> : null}
        </div>
      </div>

      <div className="page-width">
        <div className="collection-toolbar">
          <span>{products.length} προϊόντα</span>
          <span className="muted small">Ταξινόμηση: Προτεινόμενα</span>
        </div>

        {products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Δεν υπάρχουν προϊόντα σε αυτή τη συλλογή.</h2>
            <Link className="btn mt-2" href="/products">
              Δες όλα τα προϊόντα
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

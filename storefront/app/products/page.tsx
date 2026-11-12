import type { Metadata } from "next";
import { ProductCard } from "../components/ProductCard";
import { getProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Όλα τα προϊόντα",
  description: "Ολόκληρη η συλλογή TechNest: πληκτρολόγια, ποντίκια, headsets και monitors.",
};

export default async function ProductsPage() {
  const products = await getProducts(48);

  return (
    <div className="page-width section">
      <div className="section__head">
        <div>
          <p className="section__eyebrow">Συλλογή</p>
          <h1 className="section__title">Όλα τα προϊόντα</h1>
          <p className="section__subtitle">{products.length} προϊόντα επιλεγμένα από την ομάδα του TechNest.</p>
        </div>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

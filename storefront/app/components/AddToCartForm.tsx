"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { addToCartAction } from "../actions";
import type { Product } from "@/lib/types";

export function AddToCartForm({ product }: { product: Product }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  const firstAvailable = product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  const [selection, setSelection] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    firstAvailable?.selectedOptions?.forEach((option) => {
      initial[option.name] = option.value;
    });
    return initial;
  });
  const [quantity, setQuantity] = useState(1);

  const optionNames = useMemo(() => {
    const names = new Set<string>();
    product.variants.forEach((variant) => variant.selectedOptions?.forEach((o) => names.add(o.name)));
    return [...names];
  }, [product.variants]);

  const valuesFor = (name: string) => {
    const values = new Set<string>();
    product.variants.forEach((variant) => {
      variant.selectedOptions?.forEach((option) => {
        if (option.name === name) values.add(option.value);
      });
    });
    return [...values];
  };

  const selectedVariant =
    product.variants.find((variant) =>
      (variant.selectedOptions ?? []).every((option) => selection[option.name] === option.value),
    ) ?? firstAvailable;

  const unavailable = !selectedVariant || !selectedVariant.availableForSale;

  function submit(formData: FormData) {
    startTransition(async () => {
      await addToCartAction(formData);
      setAdded(true);
      router.refresh();
    });
  }

  return (
    <form action={submit} className="product__form">
      <input type="hidden" name="variantId" value={selectedVariant?.id ?? ""} />
      <input type="hidden" name="quantity" value={quantity} />

      {optionNames
        .filter((name) => name !== "Title")
        .map((name) => (
          <div className="option-group" key={name}>
            <span className="option-group__label">{name}</span>
            <div className="option-pills">
              {valuesFor(name).map((value) => (
                <button
                  key={value}
                  type="button"
                  className="option-pill"
                  aria-pressed={selection[name] === value}
                  onClick={() => {
                    setSelection((prev) => ({ ...prev, [name]: value }));
                    setAdded(false);
                  }}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}

      <div className="option-group">
        <span className="option-group__label">Ποσότητα</span>
        <div className="quantity">
          <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Μείωση">
            −
          </button>
          <input
            type="number"
            min={1}
            max={99}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
            aria-label="Ποσότητα"
          />
          <button type="button" onClick={() => setQuantity((q) => Math.min(99, q + 1))} aria-label="Αύξηση">
            +
          </button>
        </div>
      </div>

      <button className="btn btn--full" type="submit" disabled={unavailable || isPending}>
        {unavailable ? "Εξαντλήθηκε" : isPending ? "Προσθήκη…" : "Προσθήκη στο καλάθι"}
      </button>

      {added ? (
        <p className="added-note">
          ✓ Προστέθηκε στο καλάθι. <Link href="/cart">Ολοκλήρωση αγοράς →</Link>
        </p>
      ) : null}
    </form>
  );
}

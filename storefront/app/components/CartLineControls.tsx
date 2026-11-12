"use client";

import { useTransition } from "react";
import { removeLineAction, updateLineAction } from "../actions";

export function CartLineControls({ lineId, quantity }: { lineId: string; quantity: number }) {
  const [isPending, startTransition] = useTransition();

  const update = (next: number) => {
    const formData = new FormData();
    formData.set("lineId", lineId);
    formData.set("quantity", String(next));
    startTransition(async () => {
      await updateLineAction(formData);
    });
  };

  return (
    <div className="cart-line__actions" style={{ opacity: isPending ? 0.6 : 1 }}>
      <div className="qty-inline">
        <button type="button" onClick={() => update(quantity - 1)} aria-label="Μείωση ποσότητας" disabled={isPending}>
          −
        </button>
        <span>{quantity}</span>
        <button type="button" onClick={() => update(quantity + 1)} aria-label="Αύξηση ποσότητας" disabled={isPending}>
          +
        </button>
      </div>

      <form
        action={(formData) => {
          startTransition(async () => {
            await removeLineAction(formData);
          });
        }}
      >
        <input type="hidden" name="lineId" value={lineId} />
        <button type="submit" className="cart-line__remove" disabled={isPending}>
          Αφαίρεση
        </button>
      </form>
    </div>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { addToCart, removeLine, updateLine } from "@/lib/cart";

export async function addToCartAction(formData: FormData): Promise<void> {
  const variantId = String(formData.get("variantId") ?? "");
  const quantity = Number(formData.get("quantity") ?? 1);
  if (!variantId) return;
  await addToCart(variantId, Number.isFinite(quantity) ? quantity : 1);
  revalidatePath("/");
  revalidatePath("/cart");
}

export async function updateLineAction(formData: FormData): Promise<void> {
  const lineId = String(formData.get("lineId") ?? "");
  const quantity = Number(formData.get("quantity") ?? 0);
  if (!lineId) return;
  await updateLine(lineId, Number.isFinite(quantity) ? quantity : 0);
  revalidatePath("/cart");
}

export async function removeLineAction(formData: FormData): Promise<void> {
  const lineId = String(formData.get("lineId") ?? "");
  if (!lineId) return;
  await removeLine(lineId);
  revalidatePath("/cart");
}

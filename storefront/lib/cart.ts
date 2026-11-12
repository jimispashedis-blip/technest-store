import { cookies } from "next/headers";
import { mockProducts } from "./mock";
import {
  addShopifyLines,
  createShopifyCart,
  getShopifyCart,
  isMockMode,
  removeShopifyLines,
  updateShopifyLine,
} from "./shopify";
import type { Cart, CartLine, Money, Variant } from "./types";

export const CART_COOKIE = "technest_cart_id";
export const MOCK_CART_COOKIE = "technest_cart";

const EMPTY: Money = { amount: "0.0", currencyCode: "EUR" };
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

type MockLine = { v: string; q: number };

function findVariant(variantId: string): { variant: Variant; product: (typeof mockProducts)[number] } | null {
  for (const product of mockProducts) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) return { variant, product };
  }
  return null;
}

function sum(items: number[]): string {
  return items.reduce((acc, n) => acc + n, 0).toFixed(2);
}

function buildMockCart(lines: MockLine[]): Cart {
  const resolved = lines
    .map((line) => {
      const found = findVariant(line.v);
      if (!found) return null;
      const unit = Number(found.variant.price.amount);
      const cartLine: CartLine = {
        id: line.v,
        quantity: line.q,
        title: found.product.title,
        variantTitle: found.variant.title,
        handle: found.product.handle,
        image: found.product.featuredImage,
        price: found.variant.price,
        lineTotal: { amount: (unit * line.q).toFixed(2), currencyCode: "EUR" },
      };
      return { cartLine, unit: unit * line.q };
    })
    .filter((x): x is { cartLine: CartLine; unit: number } => Boolean(x));

  const total = sum(resolved.map((r) => r.unit));
  return {
    id: "mock-cart",
    checkoutUrl: null,
    totalQuantity: resolved.reduce((acc, r) => acc + r.cartLine.quantity, 0),
    subtotal: { amount: total, currencyCode: "EUR" },
    total: { amount: total, currencyCode: "EUR" },
    lines: resolved.map((r) => r.cartLine),
  };
}

async function readMockLines(): Promise<MockLine[]> {
  const store = await cookies();
  const raw = store.get(MOCK_CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as MockLine[];
    return Array.isArray(parsed) ? parsed.filter((l) => l && typeof l.v === "string" && l.q > 0) : [];
  } catch {
    return [];
  }
}

async function writeMockLines(lines: MockLine[]): Promise<Cart> {
  const store = await cookies();
  const cleaned = lines.filter((l) => l.q > 0);
  store.set(MOCK_CART_COOKIE, encodeURIComponent(JSON.stringify(cleaned)), COOKIE_OPTS);
  return buildMockCart(cleaned);
}

export async function getCart(): Promise<Cart> {
  if (isMockMode) return buildMockCart(await readMockLines());

  const store = await cookies();
  const cartId = store.get(CART_COOKIE)?.value;
  if (!cartId) return { id: "", checkoutUrl: null, totalQuantity: 0, subtotal: EMPTY, total: EMPTY, lines: [] };

  try {
    const cart = await getShopifyCart(cartId);
    if (cart) return cart;
  } catch {
    // expired / invalid cart id → start clean
  }
  return { id: "", checkoutUrl: null, totalQuantity: 0, subtotal: EMPTY, total: EMPTY, lines: [] };
}

export async function getCartCount(): Promise<number> {
  const cart = await getCart();
  return cart.totalQuantity;
}

export async function addToCart(variantId: string, quantity = 1): Promise<void> {
  const qty = Math.max(1, Math.min(99, Math.floor(quantity)));
  if (isMockMode) {
    const lines = await readMockLines();
    const existing = lines.find((l) => l.v === variantId);
    if (existing) existing.q = Math.min(99, existing.q + qty);
    else lines.push({ v: variantId, q: qty });
    await writeMockLines(lines);
    return;
  }

  const store = await cookies();
  const cartId = store.get(CART_COOKIE)?.value;
  if (!cartId) {
    const cart = await createShopifyCart(variantId, qty);
    store.set(CART_COOKIE, cart.id, COOKIE_OPTS);
    return;
  }
  try {
    await addShopifyLines(cartId, variantId, qty);
  } catch {
    const cart = await createShopifyCart(variantId, qty);
    store.set(CART_COOKIE, cart.id, COOKIE_OPTS);
  }
}

export async function updateLine(lineId: string, quantity: number): Promise<void> {
  const qty = Math.max(0, Math.min(99, Math.floor(quantity)));
  if (isMockMode) {
    const lines = await readMockLines();
    const next = lines.map((l) => (l.v === lineId ? { ...l, q: qty } : l)).filter((l) => l.q > 0);
    await writeMockLines(next);
    return;
  }

  const store = await cookies();
  const cartId = store.get(CART_COOKIE)?.value;
  if (!cartId) return;
  if (qty === 0) {
    await removeShopifyLines(cartId, [lineId]);
    return;
  }
  await updateShopifyLine(cartId, lineId, qty);
}

export async function removeLine(lineId: string): Promise<void> {
  if (isMockMode) {
    const lines = await readMockLines();
    await writeMockLines(lines.filter((l) => l.v !== lineId));
    return;
  }
  const store = await cookies();
  const cartId = store.get(CART_COOKIE)?.value;
  if (!cartId) return;
  await removeShopifyLines(cartId, [lineId]);
}

export async function clearCart(): Promise<void> {
  const store = await cookies();
  store.delete(MOCK_CART_COOKIE);
  store.delete(CART_COOKIE);
}

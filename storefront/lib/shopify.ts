import { mockCollectionProducts, mockCollections, mockProducts } from "./mock";
import type { Cart, Collection, Money, Product, ProductImage, Variant } from "./types";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_API_VERSION ?? "2025-10";

/** True when no Shopify credentials are configured → the site runs on demo data. */
export const isMockMode = !domain || !token;

const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductCard on Product {
    id
    handle
    title
    vendor
    description
    descriptionHtml
    tags
    availableForSale
    featuredImage { url altText width height }
    images(first: 6) { nodes { url altText width height } }
    priceRange { minVariantPrice { amount currencyCode } }
    compareAtPriceRange { maxVariantPrice { amount currencyCode } }
    variants(first: 20) {
      nodes {
        id
        title
        availableForSale
        price { amount currencyCode }
        selectedOptions { name value }
      }
    }
  }
`;

async function storefront<T>(query: string, variables?: Record<string, unknown>, cache = true): Promise<T> {
  if (isMockMode) throw new Error("Shopify Storefront API is not configured");
  const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token as string,
    },
    body: JSON.stringify({ query, variables }),
    ...(cache ? { next: { revalidate: 60 } } : { cache: "no-store" as RequestCache }),
  });

  if (!res.ok) {
    throw new Error(`Storefront API responded ${res.status} ${res.statusText}`);
  }
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors[0].message);
  if (!json.data) throw new Error("Empty Storefront API response");
  return json.data;
}

/* ---------------------------------- mappers --------------------------------- */

type ApiImage = { url: string; altText: string | null; width?: number; height?: number } | null;

type ApiProduct = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  description: string;
  descriptionHtml: string;
  tags: string[];
  availableForSale: boolean;
  featuredImage: ApiImage;
  images: { nodes: ApiImage[] };
  priceRange: { minVariantPrice: Money };
  compareAtPriceRange: { maxVariantPrice: Money | null };
  variants: {
    nodes: {
      id: string;
      title: string;
      availableForSale: boolean;
      price: Money;
      selectedOptions: { name: string; value: string }[];
    }[];
  };
};

function mapImage(image: ApiImage): ProductImage | null {
  if (!image) return null;
  return { url: image.url, altText: image.altText, width: image.width, height: image.height };
}

function mapProduct(node: ApiProduct): Product {
  const compare = node.compareAtPriceRange?.maxVariantPrice;
  const hasCompare = compare && Number(compare.amount) > Number(node.priceRange.minVariantPrice.amount);
  const variants: Variant[] = node.variants.nodes.map((v) => ({
    id: v.id,
    title: v.title,
    availableForSale: v.availableForSale,
    price: v.price,
    selectedOptions: v.selectedOptions,
  }));

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    vendor: node.vendor,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    tags: node.tags ?? [],
    availableForSale: node.availableForSale,
    featuredImage: mapImage(node.featuredImage),
    images: node.images.nodes.map(mapImage).filter((i): i is ProductImage => Boolean(i)),
    price: node.priceRange.minVariantPrice,
    compareAtPrice: hasCompare ? compare : null,
    variants,
  };
}

/* ---------------------------------- catalog --------------------------------- */

export async function getProducts(limit = 24): Promise<Product[]> {
  if (isMockMode) return mockProducts.slice(0, limit);
  const data = await storefront<{ products: { nodes: ApiProduct[] } }>(
    `${PRODUCT_FRAGMENT}
     query Products($first: Int!) {
       products(first: $first, sortKey: BEST_SELLING) { nodes { ...ProductCard } }
     }`,
    { first: limit },
  );
  return data.products.nodes.map(mapProduct);
}

export async function getProduct(handle: string): Promise<Product | null> {
  if (isMockMode) return mockProducts.find((p) => p.handle === handle) ?? null;
  const data = await storefront<{ product: ApiProduct | null }>(
    `${PRODUCT_FRAGMENT}
     query Product($handle: String!) {
       product(handle: $handle) { ...ProductCard }
     }`,
    { handle },
  );
  return data.product ? mapProduct(data.product) : null;
}

export async function getCollections(): Promise<Collection[]> {
  if (isMockMode) return mockCollections;
  const data = await storefront<{
    collections: {
      nodes: { handle: string; title: string; description: string; image: ApiImage }[];
    };
  }>(`query Collections {
        collections(first: 12) {
          nodes { handle title description image { url altText width height } }
        }
      }`);
  return data.collections.nodes.map((c) => ({
    handle: c.handle,
    title: c.title,
    description: c.description,
    image: mapImage(c.image),
  }));
}

export async function getCollection(handle: string): Promise<{
  collection: Collection | null;
  products: Product[];
}> {
  if (isMockMode) {
    const products = mockCollectionProducts(handle);
    const collection =
      handle === "all"
        ? { handle: "all", title: "Όλα τα προϊόντα", description: "Ολόκληρη η συλλογή TechNest.", image: null }
        : mockCollections.find((c) => c.handle === handle) ?? null;
    return { collection, products };
  }

  const data = await storefront<{
    collection: {
      handle: string;
      title: string;
      description: string;
      image: ApiImage;
      products: { nodes: ApiProduct[] };
    } | null;
  }>(
    `${PRODUCT_FRAGMENT}
     query Collection($handle: String!) {
       collection(handle: $handle) {
         handle
         title
         description
         image { url altText width height }
         products(first: 48) { nodes { ...ProductCard } }
       }
     }`,
    { handle },
  );

  if (!data.collection) return { collection: null, products: [] };
  return {
    collection: {
      handle: data.collection.handle,
      title: data.collection.title,
      description: data.collection.description,
      image: mapImage(data.collection.image),
    },
    products: data.collection.products.nodes.map(mapProduct),
  };
}

export async function searchProducts(term: string): Promise<Product[]> {
  const query = term.trim();
  if (!query) return [];
  if (isMockMode) {
    const needle = query.toLowerCase();
    return mockProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.vendor.toLowerCase().includes(needle) ||
        p.tags.some((t) => t.toLowerCase().includes(needle)),
    );
  }
  const data = await storefront<{ products: { nodes: ApiProduct[] } }>(
    `${PRODUCT_FRAGMENT}
     query Search($query: String!) {
       products(first: 24, query: $query) { nodes { ...ProductCard } }
     }`,
    { query },
  );
  return data.products.nodes.map(mapProduct);
}

/* ------------------------------------ cart ---------------------------------- */

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFull on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost { totalAmount { amount currencyCode } }
        merchandise {
          ... on ProductVariant {
            id
            title
            price { amount currencyCode }
            image { url altText width height }
            product { title handle }
          }
        }
      }
    }
  }
`;

type ApiCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: {
    nodes: {
      id: string;
      quantity: number;
      cost: { totalAmount: Money };
      merchandise: {
        id: string;
        title: string;
        price: Money;
        image: ApiImage;
        product: { title: string; handle: string };
      };
    }[];
  };
};

function mapCart(cart: ApiCart): Cart {
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    subtotal: cart.cost.subtotalAmount,
    total: cart.cost.totalAmount,
    lines: cart.lines.nodes.map((line) => ({
      id: line.id,
      quantity: line.quantity,
      title: line.merchandise.product.title,
      variantTitle: line.merchandise.title,
      handle: line.merchandise.product.handle,
      image: mapImage(line.merchandise.image),
      price: line.merchandise.price,
      lineTotal: line.cost.totalAmount,
    })),
  };
}

export async function createShopifyCart(variantId: string, quantity: number): Promise<Cart> {
  const data = await storefront<{ cartCreate: { cart: ApiCart } }>(
    `${CART_FRAGMENT}
     mutation CartCreate($lines: [CartLineInput!]!) {
       cartCreate(input: { lines: $lines }) { cart { ...CartFull } }
     }`,
    { lines: [{ merchandiseId: variantId, quantity }] },
    false,
  );
  return mapCart(data.cartCreate.cart);
}

export async function getShopifyCart(id: string): Promise<Cart | null> {
  const data = await storefront<{ cart: ApiCart | null }>(
    `${CART_FRAGMENT}
     query Cart($id: ID!) { cart(id: $id) { ...CartFull } }`,
    { id },
    false,
  );
  return data.cart ? mapCart(data.cart) : null;
}

export async function addShopifyLines(cartId: string, variantId: string, quantity: number): Promise<Cart> {
  const data = await storefront<{ cartLinesAdd: { cart: ApiCart } }>(
    `${CART_FRAGMENT}
     mutation LinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
       cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ...CartFull } }
     }`,
    { cartId, lines: [{ merchandiseId: variantId, quantity }] },
    false,
  );
  return mapCart(data.cartLinesAdd.cart);
}

export async function updateShopifyLine(cartId: string, lineId: string, quantity: number): Promise<Cart> {
  const data = await storefront<{ cartLinesUpdate: { cart: ApiCart } }>(
    `${CART_FRAGMENT}
     mutation LinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
       cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ...CartFull } }
     }`,
    { cartId, lines: [{ id: lineId, quantity }] },
    false,
  );
  return mapCart(data.cartLinesUpdate.cart);
}

export async function removeShopifyLines(cartId: string, lineIds: string[]): Promise<Cart> {
  const data = await storefront<{ cartLinesRemove: { cart: ApiCart } }>(
    `${CART_FRAGMENT}
     mutation LinesRemove($cartId: ID!, $lineIds: [ID!]!) {
       cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ...CartFull } }
     }`,
    { cartId, lineIds },
    false,
  );
  return mapCart(data.cartLinesRemove.cart);
}

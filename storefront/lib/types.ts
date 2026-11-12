export type Money = { amount: string; currencyCode: string };

export type ProductImage = {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
};

export type Variant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  selectedOptions?: { name: string; value: string }[];
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  description: string;
  descriptionHtml: string;
  tags: string[];
  availableForSale: boolean;
  featuredImage: ProductImage | null;
  images: ProductImage[];
  price: Money;
  compareAtPrice: Money | null;
  variants: Variant[];
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  image: ProductImage | null;
  productCount?: number;
};

export type CartLine = {
  id: string;
  quantity: number;
  title: string;
  variantTitle: string;
  handle: string;
  image: ProductImage | null;
  price: Money;
  lineTotal: Money;
};

export type Cart = {
  id: string;
  checkoutUrl: string | null;
  totalQuantity: number;
  subtotal: Money;
  total: Money;
  lines: CartLine[];
};

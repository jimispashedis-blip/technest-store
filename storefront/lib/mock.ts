import type { Collection, Product } from "./types";

const EUR = "EUR";
const money = (amount: string) => ({ amount, currencyCode: EUR });

type Seed = {
  handle: string;
  title: string;
  vendor: string;
  collection: string;
  price: string;
  compareAt?: string;
  image: string;
  tags: string[];
  description: string;
  options?: { name: string; values: string[] };
};

const seeds: Seed[] = [
  {
    handle: "apex-pro-tkl-wireless",
    title: "Apex Pro TKL Wireless",
    vendor: "SteelSeries",
    collection: "keyboards",
    price: "219.90",
    compareAt: "249.90",
    image: "/images/keyboard-apex.jpg",
    tags: ["badge:Best seller", "Wireless", "Hall effect"],
    description:
      "Πληκτρολόγιο TKL με OmniPoint 2.0 hall-effect switches, ρυθμιζόμενο actuation 0.1–4.0mm, αλουμινένιο top plate και 2.4GHz/Bluetooth. Για παίκτες που θέλουν απόκριση χωρίς συμβιβασμούς.",
    options: { name: "Switch", values: ["OmniPoint 2.0", "OmniPoint 2.0 Hyper"] },
  },
  {
    handle: "rog-azoth-extreme",
    title: "ROG Azoth Extreme",
    vendor: "ASUS ROG",
    collection: "keyboards",
    price: "329.00",
    image: "/images/keyboard-azoth.jpg",
    tags: ["Premium", "75%"],
    description:
      "75% custom-grade πληκτρολόγιο με carbon plate, gasket mount και OLED οθόνη για live info. Hot-swap, προ-lubed switches και τριπλή συνδεσιμότητα.",
  },
  {
    handle: "viper-v3-pro",
    title: "Viper V3 Pro",
    vendor: "Razer",
    collection: "mice",
    price: "159.90",
    image: "/images/mouse-viper.jpg",
    tags: ["badge:New", "Ultra light", "8K polling"],
    description:
      "Ασύρματο ποντίκι 54g με Focus Pro 35K sensor, 8000Hz polling rate και 95 ώρες μπαταρία. Σχήμα για claw και fingertip grip.",
  },
  {
    handle: "g-pro-x-superlight-2",
    title: "G Pro X Superlight 2",
    vendor: "Logitech G",
    collection: "mice",
    price: "149.00",
    compareAt: "169.00",
    image: "/images/mouse-superlight.jpg",
    tags: ["Best seller", "60g"],
    description:
      "Το ελαφρύτερο Pro ποντίκι της Logitech G στα 60g, με HERO 2 sensor 32K DPI, LIGHTSPEED wireless και USB-C φόρτιση.",
  },
  {
    handle: "cloud-iii-wireless",
    title: "Cloud III Wireless",
    vendor: "HyperX",
    collection: "headsets",
    price: "149.90",
    image: "/images/headset-cloud3.jpg",
    tags: ["best seller", "120h battery"],
    description:
      "Angled 53mm drivers, DTS Spatial Audio και άνεση για 12ωρα sessions. Μπαταρία έως 120 ώρες και detachable mic με LED mute.",
  },
  {
    handle: "arctis-nova-7",
    title: "Arctis Nova 7",
    vendor: "SteelSeries",
    collection: "headsets",
    price: "179.00",
    image: "/images/headset-nova7.jpg",
    tags: ["Multi-platform", "38h"],
    description:
      "Multi-platform headset με 2.4GHz + Bluetooth ταυτόχρονα, Nova Acoustic System και ComfortMAX design για όλη μέρα.",
  },
  {
    handle: "rog-swift-oled-27",
    title: 'ROG Swift OLED 27"',
    vendor: "ASUS ROG",
    collection: "monitors",
    price: "899.00",
    compareAt: "999.00",
    image: "/images/monitor-rog.jpg",
    tags: ["240Hz", "0.03ms"],
    description:
      "QHD OLED panel 240Hz με 0.03ms response, true black και custom heatsink για προστασία από burn-in. Το τέλος του motion blur.",
  },
  {
    handle: "stream-deck-mk2",
    title: "Stream Deck MK.2",
    vendor: "Elgato",
    collection: "streaming",
    price: "149.99",
    image: "/images/deck-streamdeck.jpg",
    tags: ["Creator", "15 keys"],
    description:
      "15 LCD πλήκτρα με ένα tap για scenes, macros, soundboards και shortcuts. Αποσπώμενο stand και detachable USB-C.",
  },
];

function variantsFor(seed: Seed): Product["variants"] {
  if (!seed.options) {
    return [
      {
        id: `gid://mock/ProductVariant/${seed.handle}-default`,
        title: "Default Title",
        availableForSale: true,
        price: money(seed.price),
        selectedOptions: [{ name: "Title", value: "Default Title" }],
      },
    ];
  }
  return seed.options.values.map((value) => ({
    id: `gid://mock/ProductVariant/${seed.handle}-${slug(value)}`,
    title: value,
    availableForSale: true,
    price: money(value.includes("Hyper") ? (Number(seed.price) + 20).toFixed(2) : seed.price),
    selectedOptions: [{ name: seed.options!.name, value }],
  }));
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const mockProducts: Product[] = seeds.map((seed) => {
  const variants = variantsFor(seed);
  return {
    id: `gid://mock/Product/${seed.handle}`,
    handle: seed.handle,
    title: seed.title,
    vendor: seed.vendor,
    description: seed.description,
    descriptionHtml: `<p>${seed.description}</p>`,
    tags: seed.tags,
    availableForSale: true,
    featuredImage: { url: seed.image, altText: seed.title },
    images: [{ url: seed.image, altText: seed.title }],
    price: variants[0].price,
    compareAtPrice: seed.compareAt ? money(seed.compareAt) : null,
    variants,
  };
});

export const mockCollections: Collection[] = [
  {
    handle: "keyboards",
    title: "Πληκτρολόγια",
    description: "Mechanical και hall-effect πληκτρολόγια για κάθε grip και κάθε layout.",
    image: { url: "/images/keyboard-apex.jpg", altText: "Πληκτρολόγια" },
  },
  {
    handle: "mice",
    title: "Ποντίκια",
    description: "Ultra light ασύρματα ποντίκια με κορυφαίους sensors.",
    image: { url: "/images/mouse-viper.jpg", altText: "Ποντίκια" },
  },
  {
    handle: "headsets",
    title: "Headsets",
    description: "Ήχος, mic και άνεση για μεγάλα sessions.",
    image: { url: "/images/headset-cloud3.jpg", altText: "Headsets" },
  },
  {
    handle: "monitors",
    title: "Monitors",
    description: "Υψηλό refresh rate, OLED και χρώμα που δεν κρύβει τίποτα.",
    image: { url: "/images/monitor-rog.jpg", altText: "Monitors" },
  },
  {
    handle: "streaming",
    title: "Streaming",
    description: "Ό,τι χρειάζεσαι για να ανέβεις live.",
    image: { url: "/images/deck-streamdeck.jpg", altText: "Streaming" },
  },
];

export function mockCollectionProducts(handle: string): Product[] {
  if (handle === "all") return mockProducts;
  const seedHandles = seeds.filter((s) => s.collection === handle).map((s) => s.handle);
  return mockProducts.filter((p) => seedHandles.includes(p.handle));
}

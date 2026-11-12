# TechNest — Shopify eshop (theme + headless storefront)

Πλήρες, έτοιμο για deploy **eshop gaming gear** στα ελληνικά, με δύο storefronts πάνω στο ίδιο Shopify κατάστημα:

| | Τι είναι | Πού ζει |
|---|---|---|
| 🎨 **Shopify theme** | Custom **Online Store 2.0** theme (Liquid, sections/blocks, cart drawer, filters, customer accounts). Ανεβαίνει με ένα `git push` μέσω GitHub Actions. | [`theme/`](theme) |
| ⚡ **Headless storefront** | **Next.js 16 + React 19** storefront που μιλάει με το **Shopify Storefront API** (προϊόντα, συλλογές, καλάθι, checkout redirect). | [`storefront/`](storefront) |
| 🤖 **CI/CD** | Theme check, theme deploy, storefront build, προαιρετικό deploy σε Vercel. | [`.github/workflows/`](.github/workflows) |
| 📦 **Demo catalog** | 8 gaming προϊόντα έτοιμα για import + οδηγός automated collections. | [`data/`](data) |

> Το storefront τρέχει **και χωρίς Shopify account** (demo mode με τοπικά δεδομένα & εικόνες), ώστε να δεις αμέσως το αποτέλεσμα. Μόλις βάλεις τα credentials, τραβάει live προϊόντα και κάνει checkout στο Shopify.

---

## Γρήγορη εκκίνηση (5 βήματα)

1. **Φτιάξε Shopify store** → `https://admin.shopify.com` → νέο κατάστημα (π.χ. `technest-gaming.myshopify.com`).
   Αναλυτικά: [`docs/SHOPIFY-SETUP.md`](docs/SHOPIFY-SETUP.md)
2. **Ανέβασε το catalog**: Products → Import → [`data/technest-products.csv`](data/technest-products.csv).
3. **Ανέβασε το theme**: Online Store → Themes → Upload theme (zip του `theme/`) — ή αυτόματα μέσω GitHub Actions.
4. **Σύνδεσε το headless storefront**:
   ```bash
   cd storefront
   cp .env.example .env.local   # βάλε domain + Storefront API token
   npm install && npm run dev
   ```
5. **Ενεργοποίησε το CI/CD**: GitHub → Settings → Secrets and variables → Actions.
   Αναλυτικά: [`docs/GITHUB-ACTIONS.md`](docs/GITHUB-ACTIONS.md)

---

## Τοπική ανάπτυξη

### Theme (Liquid)
```bash
npm i -g @shopify/cli
shopify theme dev --store technest-gaming.myshopify.com
shopify theme check --path theme       # lint (0 errors)
```

### Storefront (Next.js)
```bash
cd storefront
npm install
npm run dev        # http://localhost:3000 — demo mode χωρίς credentials
npm run build      # production build
```

---

## Δομή repo

```
theme/                    Shopify theme (Online Store 2.0)
├─ layout/theme.liquid    Global layout (SEO, fonts, CSS/JS, sections)
├─ sections/              hero, header, footer, featured-collection, main-product,
│                         main-collection, main-cart, cart-drawer, newsletter, …
├─ snippets/              product-card, price, cart-body, icon, breadcrumbs
├─ templates/             index / product / collection / cart / search / page / 404
│  └─ customers/          login, register, account, addresses, order, …
├─ assets/                base.css (design system), theme.js (cart AJAX, gallery, …)
├─ config/                settings_schema.json + settings_data.json
└─ locales/el.default.json  Ελληνικές μεταφράσεις (default locale)

storefront/               Next.js headless storefront
├─ app/                   pages (home, products, collections, cart, search) + server actions
├─ lib/shopify.ts         Storefront API client (GraphQL) + mappers
├─ lib/cart.ts            Cart σε cookies: Shopify cart mutations ή mock cart
├─ lib/mock.ts            Demo catalog & collections
└─ public/images/         AI-generated product photography

data/                     CSV για import + οδηγός collections
docs/                     Setup, GitHub Actions, deployment
.github/workflows/        theme-check · deploy-theme · storefront-ci · deploy-storefront
```

---

## Features

**Theme**
- Dark gaming design system (CSS variables, neon lime/violet accents), πλήρως responsive
- Online Store 2.0: κάθε section με schema/blocks, editable από theme editor
- AJAX add-to-cart + **cart drawer**, quantity steppers, gallery thumbnails
- Collection filters (list/price) & sorting, pagination, breadcrumbs
- Customer accounts (login/register/addresses/order), 404, search
- Product JSON-LD, canonical, Open Graph meta
- `shopify theme check`: **0 errors**

**Storefront**
- Server Components + Server Actions (χωρίς client-side state library)
- Storefront API: products, collection, search, cartCreate/cartLinesAdd/Update/Remove, `checkoutUrl`
- Demo mode όταν λείπουν τα credentials (ίδιο UI, τοπικό καλάθι σε cookie)
- Free-shipping progress bar, SEO metadata ανά σελίδα, ελληνικό formatting (`el-GR`)

---

## Environment variables (storefront)

| Variable | Τι κάνει |
|---|---|
| `SHOPIFY_STORE_DOMAIN` | `technest-gaming.myshopify.com` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Storefront API access token (public token, όχι Admin) |
| `SHOPIFY_API_VERSION` | default `2025-10` |
| `NEXT_PUBLIC_SITE_URL` | canonical/OG URL |

Αν λείπουν τα δύο πρώτα → **demo mode**.

---

## Επόμενα βήματα (ιδέες)

- Domain (`technest.gr`) + email, Google Analytics / Meta Pixel
- Πληρωμές & μεταφορικά στο Shopify admin
- Reviews app, wishlist, loyalty
- Μετάφραση EN (Markets) — το theme είναι έτοιμο για `locales/en.json`

Άδεια: MIT (δες [`LICENSE`](LICENSE)).

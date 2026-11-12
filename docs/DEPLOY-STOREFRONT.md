# Deploy του headless storefront

Το `storefront/` είναι ένα τυπικό Next.js project — τρέχει παντού όπου τρέχει Node 20+.

## Vercel (προτείνεται)
1. <https://vercel.com> → **Add New → Project** → επίλεξε το GitHub repo.
2. **Root Directory**: `storefront`
3. Environment variables (Production + Preview):
   ```
   SHOPIFY_STORE_DOMAIN=technest-gaming.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   SHOPIFY_API_VERSION=2025-10
   NEXT_PUBLIC_SITE_URL=https://technest.gr
   ```
4. Deploy. Κάθε push στο `main` κάνει νέο deploy.
5. Domain: **Settings → Domains** → `technest.gr` (ή `www.technest.gr`) και `shop.technest.gr` για το storefront.

Για deploy μέσω GitHub Actions: πρόσθεσε `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` ως secrets
και όρισε το repo variable `ENABLE_VERCEL_DEPLOY=true`.

## Άλλες επιλογές

**Docker**
```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "start"]
```
```bash
docker build -t technest-storefront ./storefront
docker run -p 3000:3000 --env-file storefront/.env.local technest-storefront
```

**Netlify**: `@netlify/plugin-nextjs`, base directory `storefront`, ίδιες env vars.

**Cloudflare / VPS**: `npm run build && npm start` πίσω από nginx reverse proxy.

## Σημειώσεις
- Το checkout γίνεται **στο Shopify** (`checkoutUrl`): καρτέλα/domain του καταστήματος, όχι δικό μας component. Έτσι μένουν σωστά πληρωμές, φόροι και μεταφορικά.
- Το καλάθι κρατιέται σε **httpOnly cookie** (`technest_cart_id` → Shopify cart, `technest_cart` → demo cart).
- Αν αλλάξεις domain, ενημέρωσε `NEXT_PUBLIC_SITE_URL` για σωστά canonical/Open Graph.

# Σύνδεση Shopify — η γραμμική διαδρομή (10–15 λεπτά)

Αυτό είναι το **μόνο** αρχείο που χρειάζεσαι για να «κουμπώσει» το repo με το Shopify.
Κάν' τα με τη σειρά. Στο τέλος κάθε φάσης υπάρχει ✅ *Έλεγχος* — αν δεν περνάει, μη συνεχίσεις.

> Το Shopify δεν είναι διαθέσιμο ως connector μέσα στο chat. Η σύνδεση γίνεται **με tokens**:
> ένα Admin token (για deploy του theme από GitHub) και ένα Storefront token (για τα live προϊόντα στο headless site).

---

## Φάση 1 — Λογαριασμός & κατάστημα (3′)

1. <https://www.shopify.com> → **Start free trial** (14 μέρες, χωρίς κάρτα).
2. Store name: `technest` → θα πάρεις `technest.myshopify.com` (αν είναι πιασμένο: `technest-gr`).
3. Admin → **Settings → Store details**: Country **Greece**, Currency **EUR**, Timezone **(GMT+02:00) Athens**.
4. **Settings → Languages**: πρόσθεσε **Ελληνικά** → όρισέ τα ως default (το theme έχει ήδη ελληνικό locale).

✅ *Έλεγχος:* στο admin header γράφει `EUR` και η γλώσσα είναι Ελληνικά.

---

## Φάση 2 — Προϊόντα & συλλογές (4′)

1. **Products → Import** → ανέβασε [`data/technest-products.csv`](../data/technest-products.csv) → **Import products**.
2. Άνοιξε 1–2 προϊόντα → **Add media** → ανέβασε την αντίστοιχη εικόνα από `storefront/public/images/`
   (`keyboard-apex.jpg` → Apex Pro TKL, κ.ο.κ.). Προαιρετικό για τώρα — το theme δουλεύει και χωρίς εικόνες.
3. **Products → Collections → Create collection → Automated**, πέντε φορές:

   | Title | Handle | Condition |
   |---|---|---|
   | Πληκτρολόγια | `keyboards` | Product tag equals `keyboards` |
   | Ποντίκια | `mice` | Product tag equals `mice` |
   | Headsets | `headsets` | Product tag equals `headsets` |
   | Monitors | `monitors` | Product tag equals `monitors` |
   | Streaming | `streaming` | Product tag equals `streaming` |

   ⚠️ Τα **handles πρέπει** να είναι ακριβώς αυτά: τα χρησιμοποιούν και το theme και το storefront.

✅ *Έλεγχος:* Products δείχνει 8 προϊόντα, Collections δείχνει 5 με σωστά handles.

---

## Phase 3 — Custom app & τα 2 tokens (4′) 🔑

**Settings → Apps and sales channels → Develop apps → Create app** → όνομα `TechNest CI` → **Create app**.

### 3α. Admin API token → για auto-deploy του theme
1. Tab **Configuration** → **Admin API integration** → **Configure**.
2. Τσέκαρε: `read_products`, `write_products`, `read_themes`, `write_themes`, `read_files`, `write_files`, `read_orders` → **Save**.
3. Tab **Overview** → **Install app** → **Install**.
4. Tab **API credentials** → **Admin API access token** → **Reveal token once** → αντίγραψέ το (`shpat_…`).

### 3β. Storefront API token → για το headless site
1. **Configuration → Storefront API integration → Configure**.
2. Τσέκαρε: `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`,
   `unauthenticated_read_collection_listings`, `unauthenticated_read_content`,
   `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts` → **Save**.
3. **API credentials → Storefront API access token** → αντίγραψε (32 χαρακτήρες, public by design).

✅ *Έλεγχος:* έχεις δύο κωδικούς, `shpat_…` (μυστικό) και ένα 32-ψήφιο (public).

> 🔒 **Μην τους γράψεις στο chat.** Το `shpat_…` δίνει πλήρη πρόσβαση στο κατάστημα.

---

## Φάση 4 — GitHub secrets (2′) 🔑

### Με CLI (γρήγορο)
```bash
cd technest-store

gh secret set SHOPIFY_CLI_THEME_TOKEN        # επικόλλησε το shpat_… όταν το ζητήσει
gh secret set SHOPIFY_STOREFRONT_ACCESS_TOKEN # επικόλλησε το 32-ψήφιο
gh variable set SHOPIFY_STORE --body "technest.myshopify.com"
```

### Από το UI
Repo → **Settings → Secrets and variables → Actions**
- *Secrets* → `SHOPIFY_CLI_THEME_TOKEN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- *Variables* → `SHOPIFY_STORE` = `technest.myshopify.com`

✅ *Έλεγχος:* `gh secret list && gh variable list` δείχνει και τα τρία.

---

## Φάση 5 — Πρώτο deploy του theme (2′)

Το `SHOPIFY_THEME_ID` **δεν το ξέρεις ακόμη** — γι' αυτό το πρώτο push γίνεται *unpublished*.

```bash
# 1) Τρέξε το workflow χωρίς theme id → δημιουργεί "TechNest CI <run>" (preview)
gh workflow run deploy-theme.yml
gh run watch

# 2) Δες το νέο theme και πάρε το ID του
shopify theme list --store technest.myshopify.com --password shpat_…
#   ID         NAME              ROLE
#   123456789  TechNest CI 3     unpublished

# 3) Αποθήκευσέ το, ώστε τα επόμενα deploys να ενημερώνουν το ίδιο theme
gh variable set SHOPIFY_THEME_ID --body "123456789"

# 4) Όταν σου αρέσει το preview → live
gh workflow run deploy-theme.yml -f publish=true
```

**Εναλλακτικά χωρίς GitHub Actions:** Online Store → Themes → **Add theme → Upload zip** με το
`technest-theme.zip` (`cd theme && zip -r ../technest-theme.zip . -x ".*"`).

✅ *Έλεγχος:* Online Store → Themes δείχνει το theme, το **Customize** ανοίγει χωρίς σφάλματα,
και το `shopify theme check --path theme` δίνει 0 errors.

---

## Φάση 6 — Live προϊόντα στο headless storefront (3′)

### Τοπικά
```bash
cd storefront
cp .env.example .env.local
```
Συμπλήρωσε στο `.env.local` (είναι gitignored):
```
SHOPIFY_STORE_DOMAIN=technest.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=το_32ψηφιο
SHOPIFY_API_VERSION=2025-10
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
```bash
npm install && npm run dev    # http://localhost:3000
```

### Production
Vercel → Project → Settings → Environment Variables → τα ίδια 4 → Redeploy.
Λεπτομέρειες: [`DEPLOY-STOREFRONT.md`](DEPLOY-STOREFRONT.md).

✅ *Έλεγχος:* εξαφανίζεται το ροζ banner «Demo mode», τα προϊόντα έχουν τιμές από το Shopify,
και το κουμπί **Ολοκλήρωση παραγγελίας** ανοίγει σελίδα `*.myshopify.com/checkouts/…`.

---

## Φάση 7 — Πριν το launch (10′)

- **Settings → Payments**: Shopify Payments αν είναι διαθέσιμο για Ελλάδα, αλλιώς Stripe/PayPal + Αντικαταβολή.
- **Settings → Shipping and delivery**: Greece courier 3,50€, δωρεάν άνω των 60€· EU 9,90€.
- **Settings → Taxes**: ΦΠΑ 24%, «All prices include tax».
- **Settings → Policies**: επιστροφές, απόρρητο, όροι (εμφανίζονται στο footer του theme).
- **Test παραγγελία**: Settings → Payments → Manual → **Bogus Gateway** → δοκιμαστική αγορά → μετά απενεργοποίησέ το.
- **Domain**: Settings → Domains → `technest.gr` → primary.

---

## Αν κάτι πάει στραβά

| Σύμπτωμα | Αιτία / Λύση |
|---|---|
| `401 Unauthorized` στο deploy | Λείπει scope ή δεν έγινε **Install app** μετά την αλλαγή scopes → re-install. |
| `Storefront API is not configured` (demo mode μένει) | Το `SHOPIFY_STOREFRONT_ACCESS_TOKEN` δεν φορτώθηκε → restart `npm run dev` / redeploy στο Vercel. |
| `Field 'collection' doesn't exist` / 404 σε συλλογή | Λάθος handle συλλογής — πρέπει `keyboards`, `mice`, `headsets`, `monitors`, `streaming`. |
| Κενό `/collections/...` | Τα προϊόντα δεν έχουν το αντίστοιχο **tag** (όχι type) — τα automated collections κοιτούν tag. |
| Το theme δείχνει default εμφάνιση | Το push πήγε σε άλλο theme ID → `shopify theme list` και διόρθωσε το `SHOPIFY_THEME_ID`. |
| `Theme check failed` | `shopify theme check --path theme` τοπικά — τα warnings δεν μπλοκάρουν, μόνο τα errors. |

---

## Πες μου όταν τελειώσεις (χωρίς tokens)

Στείλε μόνο αυτά, ώστε να επιβεβαιώσω από την πλευρά του repo:

1. `technest.myshopify.com` ← το πραγματικό domain
2. «secrets μπήκαν» (ναι/όχι) + το `SHOPIFY_THEME_ID` αν το έχεις
3. Το output του `gh run list --workflow=deploy-theme.yml --limit 3`

Αν κάποιο βήμα δεν υπάρχει στο admin σου (το Shopify αλλάζει ονόματα στα μενού), γράψε μου
**τι βλέπεις στην οθόνη** και σου λέω πού να πατήσεις.

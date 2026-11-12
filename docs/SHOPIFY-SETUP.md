# Shopify setup — από το μηδέν σε live eshop

Χρόνος: ~45–60 λεπτά. Δεν χρειάζεται κώδικας, μόνο admin clicks (εκτός από το βήμα 6).

---

## 1. Δημιουργία καταστήματος
1. Πήγαινε στο <https://www.shopify.com> → **Start free trial**.
2. Store name: `technest` (θα γίνει `technest.myshopify.com` — αν είναι πιασμένο, βάλε `technest-gr` κ.λπ.).
3. **Settings → Store details**: χώρα **Greece**, νόμισμα **EUR**, timezone **Athens**.
4. **Settings → Languages**: πρόσθεσε **Ελληνικά** και βάλε το ως default. (Το theme έχει ήδη `locales/el.default.json`.)

## 2. Προϊόντα
1. **Products → Import** → ανέβασε το [`data/technest-products.csv`](../data/technest-products.csv).
2. Οι εικόνες δεν έρχονται με το CSV (είναι τοπικά αρχεία). Δύο επιλογές:
   - Άνοιξε κάθε προϊόν → **Add media** και ανέβασε την αντίστοιχη εικόνα από `storefront/public/images/`.
   - Ή άφησε τις δικές σου φωτογραφίες από τον προμηθευτή.
3. Έλεγξε τιμές/απόθεμα (το CSV βάζει 25 τεμάχια και `deny` όταν εξαντληθεί).

## 3. Συλλογές (αυτόματες)
Ακολούθως το [`data/collections.md`](../data/collections.md): **Products → Collections → Create collection → Automated** με condition `Product tag equals keyboards` (και αντίστοιχα `mice`, `headsets`, `monitors`, `streaming`).

> Τα handles **πρέπει** να είναι `keyboards`, `mice`, `headsets`, `monitors`, `streaming` — τα χρησιμοποιούν και το theme και το headless storefront.

## 4. Ανέβασμα του theme
**Επιλογή Α — zip (γρήγορο)**
```bash
cd theme && zip -r ../technest-theme.zip . -x ".*"
```
Online Store → Themes → **Add theme → Upload zip** → *Customize* για να ρυθμίσεις hero/συλλογές/μενού.

**Επιλογή Β — CLI (live reload)**
```bash
npm i -g @shopify/cli
shopify theme dev --store technest.myshopify.com     # local preview στο :9292
shopify theme push --store technest.myshopify.com --unpublished
```

**Επιλογή Γ — GitHub Actions** (αυτόματο deploy σε κάθε push): [`GITHUB-ACTIONS.md`](GITHUB-ACTIONS.md).

## 5. Menus
**Online Store → Navigation**
- `main-menu`: Αρχική, Όλα τα προϊόντα, Πληκτρολόγια, Ποντίκια, Headsets, Monitors
- `footer`: Επικοινωνία, Αποστολές, Επιστροφές, Όροι

## 6. API tokens (για CLI & storefront)
**Settings → Apps and sales channels → Develop apps → Create app** (`TechNest CI`).

### 6α. Admin API token (deploy theme από CI)
1. **Configuration → Admin API integration** → ενεργοποίησε scopes:
   `read_products`, `write_products`, `read_themes`, `write_themes`, `read_files`, `write_files`, `read_orders`.
2. **Install app** → **API credentials** → **Admin API access token** → `shpat_…`
3. Αυτό είναι το secret **`SHOPIFY_CLI_THEME_TOKEN`**.

### 6β. Storefront API token (headless)
1. Στο ίδιο app: **Configuration → Storefront API integration** → scopes:
   `unauthenticated_read_product_listings`, `unauthenticated_read_product_inventory`,
   `unauthenticated_read_collection_listings`, `unauthenticated_write_checkouts`,
   `unauthenticated_read_checkouts`.
2. Install/Update → **Storefront API access token** (32 χαρακτήρες).
3. Αυτό είναι το `SHOPIFY_STOREFRONT_ACCESS_TOKEN` (`.env.local` και GitHub secret).

> Το Storefront token είναι **public** (μπαίνει σε client-side κώδικα) — μην το μπερδέψεις με το Admin token, που είναι μυστικό.

## 7. Πληρωμές
**Settings → Payments**. Αν το **Shopify Payments** δεν είναι διαθέσιμο για ελληνικό κατάστημα, πρόσθεσε:
- **Stripe** ή **PayPal Express** για κάρτες/PayPal
- **Αντικαταβολή** (Manual payment method → "Αντικαταβολή", +2€ fee αν θέλεις)

## 8. Αποστολές
**Settings → Shipping and delivery**
- Ζώνη **Greece**: courier 3,50€, δωρεάν άνω των **60€** (δημιούργησε rate "Free over €60" με condition).
- Ζώνη **EU**: 9,90€. Ζώνη **Rest of world**: 19,90€.
- Ενεργοποίησε **Local pickup** αν έχεις φυσικό σημείο.

## 9. Φόροι & νομικά
- **Settings → Taxes**: 24% ΦΠΑ, ενεργοποίησε «All prices include tax».
- **Settings → Policies**: επιστροφές, απόρρητο, όροι (τα links εμφανίζονται στο footer του theme).
- **Settings → Checkout**: ζήτα email/τηλέφωνο, marketing consent.

## 10. Go live
- Πρόσθεσε domain **technest.gr** (Settings → Domains) και όρισε το ως primary.
- **Online Store → Preferences → Password protection**: off.
- Δοκιμαστική παραγγελία με **Bogus Gateway** (Settings → Payments → Manual → Bogus) πριν βάλεις πραγματικές πληρωμές.

---

## Checklist πριν το launch

- [ ] 8+ προϊόντα με εικόνες, τιμές, απόθεμα
- [ ] 5 automated collections
- [ ] Theme ρυθμισμένο (hero image, featured collection, menus)
- [ ] Πληρωμές + μεταφορικά + ΦΠΑ
- [ ] Policies & footer links
- [ ] Domain + SSL (αυτόματο)
- [ ] Test παραγγελία end-to-end
- [ ] GitHub Actions deploy δοκιμασμένο (`workflow_dispatch`)

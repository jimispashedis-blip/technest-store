# GitHub Actions — auto deploy του theme στο Shopify

Τα workflows είναι έτοιμα. Χρειάζονται μόνο **2 μυστικά** και **2 variables** στο repo:

| Όνομα | Τύπος | Τιμή |
|---|---|---|
| `SHOPIFY_CLI_THEME_TOKEN` | secret | Admin API token `shpat_…` (δες [SHOPIFY-SETUP §6α](SHOPIFY-SETUP.md#6-api-tokens-για-cli--storefront)) |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | secret | Storefront API token (για το CI build του storefront) |
| `SHOPIFY_STORE` | variable | `technest-gaming.myshopify.com` (χωρίς `https://`) |
| `SHOPIFY_THEME_ID` | variable | Το ID του theme που θα ενημερώνεται (δες παρακάτω) |

## Μέσω UI
GitHub → repo → **Settings → Secrets and variables → Actions**:
- *Secrets* → **New repository secret** για τα δύο tokens.
- *Variables* → **New repository variable** για store/theme id.

## Μέσω CLI
```bash
# secrets (θα σου ζητήσει την τιμή, δεν γράφεται στο shell history)
gh secret set SHOPIFY_CLI_THEME_TOKEN
gh secret set SHOPIFY_STOREFRONT_ACCESS_TOKEN

# variables
gh variable set SHOPIFY_STORE  --body "technest-gaming.myshopify.com"
gh variable set SHOPIFY_THEME_ID --body "123456789"
```

## Πώς βρίσκω το SHOPIFY_THEME_ID;
```bash
shopify theme list --store technest-gaming.myshopify.com --password shpat_xxx
```
```
ID           NAME                 ROLE      CREATED
123456789    TechNest Gaming      live      2025-11-01
```
Αν δεν υπάρχει theme ακόμη, κάνε **Upload** το zip μία φορά από το admin — ή άφησε το variable κενό:
το workflow θα ανεβάσει νέο *unpublished* theme (`TechNest CI <run>`), ώστε πρώτα να το δεις σε preview και μετά να το κάνεις publish.

## Τα workflows

| Workflow | Trigger | Τι κάνει |
|---|---|---|
| `theme-check.yml` | PR/push στο `theme/**` | `shopify theme check --fail-level error` |
| `deploy-theme.yml` | push στο `main` (`theme/**`) ή manual | check → `theme push` → publish |
| `storefront-ci.yml` | PR/push στο `storefront/**` | `npm ci`, `tsc --noEmit`, `next build` |
| `deploy-storefront.yml` | manual ή `ENABLE_VERCEL_DEPLOY=true` | Vercel production deploy |

### Manual deploy
Actions → **Deploy Shopify theme** → *Run workflow*
- `publish: false` → preview theme (ασφαλές για QA)
- `publish: true` → live σε όλους τους επισκέπτες

### Ροή εργασίας που προτείνουμε
```
feature branch ──PR──▶ theme-check + storefront-ci ──merge──▶ main ──▶ deploy-theme (preview)
                                                                   └─▶ manual publish όταν είσαι έτοιμος
```

## Deploy του storefront
Δες [`DEPLOY-STOREFRONT.md`](DEPLOY-STOREFRONT.md).

## Troubleshooting

**`Missing access token` / 401**
Το token δεν έχει scopes `read_themes` + `write_themes` ή δεν έγινε **Install app** μετά την αλλαγή scopes.

**`Theme check failed`**
Τρέξε τοπικά `shopify theme check --path theme` και διόρθωσε τα errors (τα warnings δεν μπλοκάρουν).

**Δεν εμφανίζονται οι αλλαγές στο live site**
Έγινε push σε preview theme. Τρέξε manual deploy με `publish: true` ή κάνε publish από Online Store → Themes.

**Το storefront CI κάνει build χωρίς credentials**
Είναι αναμενόμενο: πέφτει σε demo mode. Βάλε τα secrets/variables για live data.

# Collections για το Shopify

Δημιούργησε **automated collections** (Products → Collections → Create collection → Automated)
με βάση το tag, ώστε να γεμίζουν μόνες τους όταν προσθέτεις προϊόντα:

| Collection        | Handle       | Condition (product tag) |
|-------------------|--------------|--------------------------|
| Πληκτρολόγια      | `keyboards`  | tag equals `keyboards`   |
| Ποντίκια          | `mice`       | tag equals `mice`        |
| Headsets          | `headsets`   | tag equals `headsets`    |
| Monitors          | `monitors`   | tag equals `monitors`    |
| Streaming         | `streaming`  | tag equals `streaming`   |

Το theme και το headless storefront χρησιμοποιούν αυτά τα handles
(`/collections/keyboards`, κ.λπ.), οπότε κράτησέ τα ίδια.

## Badges
Πρόσθεσε tag της μορφής `badge:Best seller`, `badge:New`, `badge:Premium` σε ένα προϊόν
και εμφανίζεται αυτόματα ως badge στην κάρτα προϊόντος.

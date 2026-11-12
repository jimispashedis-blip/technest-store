import { formatMoney } from "@/lib/format";
import type { Money } from "@/lib/types";

export function Price({
  price,
  compareAt,
  size,
}: {
  price: Money;
  compareAt?: Money | null;
  size?: "lg";
}) {
  const onSale = compareAt && Number(compareAt.amount) > Number(price.amount);
  return (
    <div className={`price${onSale ? " price--sale" : ""}`}>
      <span className="price__current" style={size === "lg" ? { fontSize: "1.65rem" } : undefined}>
        {formatMoney(price)}
      </span>
      {onSale ? <s className="price__compare">{formatMoney(compareAt)}</s> : null}
    </div>
  );
}

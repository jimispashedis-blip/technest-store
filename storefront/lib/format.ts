import type { Money } from "./types";

export function formatMoney(money: Money | null | undefined): string {
  if (!money) return "—";
  const value = Number(money.amount);
  try {
    return new Intl.NumberFormat("el-GR", {
      style: "currency",
      currency: money.currencyCode || "EUR",
      minimumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${money.currencyCode}`;
  }
}

import { currency } from "../constants";

const cards = [
  { key: "totalOrders", label: "Total orders", accent: "text-slate-900" },
  { key: "totalValue", label: "Total order value", accent: "text-slate-900", money: true },
  { key: "pending", label: "Pending", accent: "text-amber-600" },
  { key: "delivered", label: "Delivered", accent: "text-emerald-600" },
];

export default function SummaryCards({ summary }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-slate-500">{card.label}</p>
          <p className={`mt-2 text-3xl font-semibold tabular-nums ${card.accent}`}>
            {card.money ? currency.format(summary[card.key]) : summary[card.key]}
          </p>
        </div>
      ))}
    </div>
  );
}

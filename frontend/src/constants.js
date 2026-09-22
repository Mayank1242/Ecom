export const STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered"];

export const statusStyles = {
  Pending: "bg-amber-100 text-amber-800 ring-amber-200",
  Confirmed: "bg-blue-100 text-blue-800 ring-blue-200",
  Shipped: "bg-violet-100 text-violet-800 ring-violet-200",
  Delivered: "bg-emerald-100 text-emerald-800 ring-emerald-200",
};

export const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

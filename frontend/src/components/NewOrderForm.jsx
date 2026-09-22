import { useState } from "react";

export default function NewOrderForm({ onCreate }) {
  const [customer, setCustomer] = useState("");
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!customer.trim() || Number(amount) <= 0) return;
    setBusy(true);
    try {
      await onCreate(customer.trim(), Number(amount));
      setCustomer("");
      setAmount("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
    >
      <input
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
        placeholder="Customer name"
        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
      />
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        min="1"
        step="0.01"
        placeholder="Amount"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 sm:w-40"
      />
      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-50"
      >
        Add order
      </button>
    </form>
  );
}

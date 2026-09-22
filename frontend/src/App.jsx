import NewOrderForm from "./components/NewOrderForm";
import OrderTable from "./components/OrderTable";
import SummaryCards from "./components/SummaryCards";
import Toolbar from "./components/Toolbar";
import { useOrders } from "./useOrders";

export default function App() {
  const {
    orders,
    summary,
    search,
    setSearch,
    statuses,
    toggleStatus,
    clearFilters,
    changeStatus,
    addOrder,
    loading,
    error,
    live,
  } = useOrders();

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Order Management</h1>
            <p className="text-sm text-slate-500">
              Showing {orders.length} of {summary.totalOrders} orders
            </p>
          </div>
          <span className="flex items-center gap-2 text-sm text-slate-500">
            <span
              className={`h-2 w-2 rounded-full ${live ? "bg-emerald-500" : "bg-slate-300"}`}
            />
            {live ? "Live" : "Offline"}
          </span>
        </header>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <SummaryCards summary={summary} />
        <NewOrderForm onCreate={addOrder} />
        <Toolbar
          search={search}
          setSearch={setSearch}
          statuses={statuses}
          toggleStatus={toggleStatus}
          clearFilters={clearFilters}
        />
        <OrderTable orders={orders} onStatusChange={changeStatus} loading={loading} />
      </div>
    </div>
  );
}

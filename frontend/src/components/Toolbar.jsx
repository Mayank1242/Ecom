import { STATUSES } from "../constants";

export default function Toolbar({ search, setSearch, statuses, toggleStatus, clearFilters }) {
  const filtering = search !== "" || statuses.length > 0;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by order ID or customer"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-slate-900 md:max-w-sm"
      />
      <div className="flex flex-wrap items-center gap-2">
        {STATUSES.map((status) => {
          const active = statuses.includes(status);
          return (
            <button
              key={status}
              onClick={() => toggleStatus(status)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {status}
            </button>
          );
        })}
        {filtering && (
          <button
            onClick={clearFilters}
            className="text-sm font-medium text-slate-500 underline-offset-4 hover:underline"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

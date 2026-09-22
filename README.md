# Order Management Dashboard

React + Tailwind frontend, FastAPI backend, in-memory data store.

## Run

Backend (port 8001):

```
cd backend
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/uvicorn main:app --port 8001 --reload
```

Frontend (port 5173, proxies `/api` and `/ws` to the backend):

```
cd frontend
npm install
npm run dev
```

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/orders?search=&status=` | List orders, filtered server-side |
| GET | `/api/summary` | Totals for the summary cards |
| PATCH | `/api/orders/{id}/status` | Move an order to a new status |
| POST | `/api/orders` | Create an order (starts as Pending) |
| WS | `/ws` | Push channel for order created/updated events |

## Notes on the design

**Data storage.** Orders live in a module-level list in `backend/store.py`, seeded with 18 deterministic mock orders. The brief allows mock data, and keeping it server-side means every client sees the same orders and the summary is computed from one source of truth — local storage would make the state per-browser and break the multi-user story. Swapping the store module for a real repository is the only change a database would need.

**Frontend structure.** `App.jsx` is a thin layout; all data concerns live in the `useOrders` hook, and the components (`SummaryCards`, `Toolbar`, `OrderTable`, `NewOrderForm`) are presentational and take props. No state library is needed at this size — one hook owns orders, summary, search and status filters, and passes callbacks down.

**Search and filtering.** Both are server-side query params. The hook re-fetches whenever `search` or `statuses` change, with the search input debounced 250 ms. Status filters are multi-select and sent as repeated `status` params. Doing this on the server keeps the client honest once the dataset grows past what you would ship to the browser.

**Status updates.** The select fires `PATCH /api/orders/{id}/status`. The row updates optimistically so the UI feels instant, then the hook re-fetches the list and summary; a failed request rolls the row back and surfaces the error banner.

**Live updates.** Every mutation broadcasts over a WebSocket to all connected clients along with the fresh summary, so a status change in one browser tab shows up in the others without a refresh. The header dot shows connection state. For production this would move to Redis pub/sub behind multiple workers, with per-order events applied to the client cache instead of a full re-fetch, and a reconnect-with-backoff that refetches on resume.

## What I would add next

- Sorting and pagination on the orders table
- Status transitions restricted to the forward flow, with an audit trail per order
- Optimistic summary maths so the cards move in the same frame as the row
- Tests: pytest for the API, React Testing Library for the hook and table

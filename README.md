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


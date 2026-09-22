import json
import os
from typing import List, Optional, Set

from fastapi import FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import store

app = FastAPI(title="Order Management API")

default_origins = ",".join([
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://ecom-5g5g.vercel.app",
])
allowed_origins = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", default_origins).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://ecom-5g5g-[\w-]+\.vercel\.app",
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthz")
def healthz():
    return {"status": "ok"}


class StatusUpdate(BaseModel):
    status: str


class NewOrder(BaseModel):
    customer: str = Field(min_length=1)
    amount: float = Field(gt=0)


clients: Set[WebSocket] = set()


async def broadcast(event: str, payload: dict):
    message = json.dumps({"event": event, "payload": payload, "summary": store.summary()})
    dead = []
    for ws in list(clients):
        try:
            await ws.send_text(message)
        except Exception:
            dead.append(ws)
    for ws in dead:
        clients.discard(ws)


@app.get("/api/orders")
def list_orders(
    search: str = "",
    status: Optional[List[str]] = Query(default=None),
):
    result = store.all_orders()
    term = search.strip().lower()
    if term:
        result = [
            o for o in result
            if term in o["id"].lower() or term in o["customer"].lower()
        ]
    if status:
        wanted = set(status)
        result = [o for o in result if o["status"] in wanted]
    return result


@app.get("/api/summary")
def get_summary():
    return store.summary()


@app.patch("/api/orders/{order_id}/status")
async def update_status(order_id: str, body: StatusUpdate):
    if body.status not in store.STATUSES:
        raise HTTPException(status_code=400, detail="Unknown status")
    order = store.find(order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    order["status"] = body.status
    await broadcast("order.updated", order)
    return order


@app.post("/api/orders", status_code=201)
async def create_order(body: NewOrder):
    order = store.add(body.customer.strip(), body.amount)
    await broadcast("order.created", order)
    return order


@app.websocket("/ws")
async def ws_endpoint(ws: WebSocket):
    await ws.accept()
    clients.add(ws)
    try:
        while True:
            await ws.receive_text()
    except WebSocketDisconnect:
        pass
    except Exception:
        pass
    finally:
        clients.discard(ws)

import itertools
import random
from datetime import datetime, timedelta

STATUSES = ["Pending", "Confirmed", "Shipped", "Delivered"]

_customers = [
    "Aarav Sharma", "Diya Patel", "Rohan Mehta", "Ananya Iyer", "Kabir Nair",
    "Ishita Rao", "Vivaan Gupta", "Meera Krishnan", "Arjun Desai", "Sara Khan",
    "Nikhil Verma", "Tara Joshi", "Aditya Bose", "Priya Menon", "Rehan Ali",
]

_counter = itertools.count(1)


def _seed():
    random.seed(7)
    orders = []
    now = datetime.now()
    for i in range(18):
        n = next(_counter)
        orders.append({
            "id": "ORD-{:04d}".format(1000 + n),
            "customer": random.choice(_customers),
            "date": (now - timedelta(days=random.randint(0, 25), hours=random.randint(0, 23))).isoformat(timespec="seconds"),
            "amount": round(random.uniform(499, 24999), 2),
            "status": random.choice(STATUSES),
        })
    return orders


orders = _seed()


def all_orders():
    return sorted(orders, key=lambda o: o["date"], reverse=True)


def find(order_id):
    for o in orders:
        if o["id"] == order_id:
            return o
    return None


def add(customer, amount):
    n = next(_counter)
    order = {
        "id": "ORD-{:04d}".format(1000 + n),
        "customer": customer,
        "date": datetime.now().isoformat(timespec="seconds"),
        "amount": round(float(amount), 2),
        "status": "Pending",
    }
    orders.append(order)
    return order


def summary():
    total_value = sum(o["amount"] for o in orders)
    counts = {s: 0 for s in STATUSES}
    for o in orders:
        counts[o["status"]] += 1
    return {
        "totalOrders": len(orders),
        "totalValue": round(total_value, 2),
        "pending": counts["Pending"],
        "confirmed": counts["Confirmed"],
        "shipped": counts["Shipped"],
        "delivered": counts["Delivered"],
    }

const base = "/api";

async function request(path, options) {
  const res = await fetch(base + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || "Request failed");
  }
  return res.json();
}

export function fetchOrders({ search, statuses }) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  statuses.forEach((s) => params.append("status", s));
  const qs = params.toString();
  return request(`/orders${qs ? `?${qs}` : ""}`);
}

export function fetchSummary() {
  return request("/summary");
}

export function updateOrderStatus(id, status) {
  return request(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function createOrder(customer, amount) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify({ customer, amount }),
  });
}

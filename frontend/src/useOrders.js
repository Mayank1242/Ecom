import { useCallback, useEffect, useRef, useState } from "react";
import { createOrder, fetchOrders, fetchSummary, socketUrl, updateOrderStatus } from "./api";

const emptySummary = {
  totalOrders: 0,
  totalValue: 0,
  pending: 0,
  confirmed: 0,
  shipped: 0,
  delivered: 0,
};

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState(emptySummary);
  const [search, setSearch] = useState("");
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [live, setLive] = useState(false);

  const filters = useRef({ search, statuses });
  filters.current = { search, statuses };

  const load = useCallback(async () => {
    try {
      const [list, totals] = await Promise.all([
        fetchOrders(filters.current),
        fetchSummary(),
      ]);
      setOrders(list);
      setSummary(totals);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(load, search ? 250 : 0);
    return () => clearTimeout(timer);
  }, [search, statuses, load]);

  useEffect(() => {
    const socket = new WebSocket(socketUrl());
    socket.onopen = () => setLive(true);
    socket.onclose = () => setLive(false);
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setSummary(message.summary);
      load();
    };
    return () => socket.close();
  }, [load]);

  const changeStatus = async (id, status) => {
    const previous = orders;
    setOrders((current) =>
      current.map((o) => (o.id === id ? { ...o, status } : o))
    );
    try {
      await updateOrderStatus(id, status);
      await load();
    } catch (err) {
      setOrders(previous);
      setError(err.message);
    }
  };

  const addOrder = async (customer, amount) => {
    await createOrder(customer, amount);
    await load();
  };

  const toggleStatus = (status) => {
    setStatuses((current) =>
      current.includes(status)
        ? current.filter((s) => s !== status)
        : [...current, status]
    );
  };

  return {
    orders,
    summary,
    search,
    setSearch,
    statuses,
    toggleStatus,
    clearFilters: () => {
      setSearch("");
      setStatuses([]);
    },
    changeStatus,
    addOrder,
    loading,
    error,
    live,
  };
}

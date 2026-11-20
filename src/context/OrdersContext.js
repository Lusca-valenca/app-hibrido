import { createContext, useContext } from 'react';
import { usePersistedState } from '../hooks/usePersistedState';
import { KEYS } from '../services/storage';

const OrdersContext = createContext(null);

// Histórico de pedidos salvo no aparelho (o mais recente fica no topo)
export function OrdersProvider({ children }) {
  const [orders, setOrders] = usePersistedState(KEYS.orders, []);

  function addOrder({ items, total, payment, address }) {
    const order = {
      id: `SR${String(Date.now()).slice(-8)}`,
      date: new Date().toISOString(),
      items: items.map(({ book, qty }) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        price: book.price,
        qty,
      })),
      total,
      payment,
      address,
    };
    setOrders((current) => [order, ...current]);
    return order;
  }

  function findOrder(id) {
    return orders.find((order) => order.id === id) || null;
  }

  const value = { orders, addOrder, findOrder };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  return useContext(OrdersContext);
}

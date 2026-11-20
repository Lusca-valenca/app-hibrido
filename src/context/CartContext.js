import { createContext, useContext } from 'react';
import { usePersistedState } from '../hooks/usePersistedState';
import { KEYS } from '../services/storage';

const CartContext = createContext(null);

// Carrinho salvo no aparelho: cada item é { book, qty }
export function CartProvider({ children }) {
  const [items, setItems] = usePersistedState(KEYS.cart, []);

  function addItem(book) {
    setItems((current) => {
      const exists = current.some((item) => item.book.id === book.id);
      if (!exists) return [...current, { book, qty: 1 }];
      return current.map((item) =>
        item.book.id === book.id ? { ...item, qty: item.qty + 1 } : item
      );
    });
  }

  // delta = +1 ou -1; ao chegar em zero o item sai do carrinho
  function changeQty(id, delta) {
    setItems((current) =>
      current
        .map((item) => (item.book.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  }

  function removeItem(id) {
    setItems((current) => current.filter((item) => item.book.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const total = items.reduce((sum, item) => sum + item.book.price * item.qty, 0);

  const value = { items, count, total, addItem, changeQty, removeItem, clearCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

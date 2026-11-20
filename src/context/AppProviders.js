import { AddressProvider } from './AddressContext';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { FavoritesProvider } from './FavoritesContext';
import { OrdersProvider } from './OrdersContext';
import { ToastProvider } from './ToastContext';

// Junta todos os contextos para o layout raiz usar de uma vez só
export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <OrdersProvider>
            <AddressProvider>
              <ToastProvider>{children}</ToastProvider>
            </AddressProvider>
          </OrdersProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}

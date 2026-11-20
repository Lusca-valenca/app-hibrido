import { createContext, useContext } from 'react';
import { usePersistedState } from '../hooks/usePersistedState';
import { KEYS } from '../services/storage';

const AddressContext = createContext(null);

// Endereços de entrega salvos no aparelho
export function AddressProvider({ children }) {
  const [addresses, setAddresses] = usePersistedState(KEYS.addresses, []);

  function addAddress(address) {
    const saved = { ...address, id: String(Date.now()) };
    setAddresses((current) => [...current, saved]);
    return saved;
  }

  function removeAddress(id) {
    setAddresses((current) => current.filter((address) => address.id !== id));
  }

  const value = { addresses, addAddress, removeAddress };

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
}

export function useAddresses() {
  return useContext(AddressContext);
}

import { createContext, useContext } from 'react';
import { usePersistedState } from '../hooks/usePersistedState';
import { KEYS } from '../services/storage';

const FavoritesContext = createContext(null);

// Lista de livros favoritos salva no aparelho
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = usePersistedState(KEYS.favorites, []);

  function isFavorite(id) {
    return favorites.some((book) => book.id === id);
  }

  // Devolve true se o livro passou a ser favorito e false se foi removido
  function toggleFavorite(book) {
    const already = isFavorite(book.id);
    setFavorites((current) =>
      already ? current.filter((item) => item.id !== book.id) : [...current, book]
    );
    return !already;
  }

  const value = { favorites, isFavorite, toggleFavorite };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  return useContext(FavoritesContext);
}

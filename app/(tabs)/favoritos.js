import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BookRow } from '../../src/components/BookRow';
import { Empty } from '../../src/components/Empty';
import { Header } from '../../src/components/Header';
import { useFavorites } from '../../src/context/FavoritesContext';
import { useToast } from '../../src/context/ToastContext';
import { colors } from '../../src/theme';

// Tela 6 - Favoritos: lista salva no armazenamento local
export default function Favoritos() {
  const { favorites, toggleFavorite } = useFavorites();
  const showToast = useToast();

  function remove(book) {
    toggleFavorite(book);
    showToast('Removido dos favoritos.');
  }

  return (
    <View style={s.page}>
      <Header title="Favoritos" />
      <FlatList
        data={favorites}
        keyExtractor={(book) => book.id}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <BookRow book={item}>
            <Pressable
              onPress={() => remove(item)}
              hitSlop={10}
              accessibilityLabel="Remover dos favoritos"
            >
              <Ionicons name="heart" size={23} color="#FF6B6B" />
            </Pressable>
          </BookRow>
        )}
        ListEmptyComponent={
          <Empty
            icon="heart-outline"
            title="Sem favoritos"
            text="Toque no coração na tela de um livro para encontrá-lo rapidamente aqui."
          />
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  list: { flexGrow: 1, padding: 14, gap: 12 },
});

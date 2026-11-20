import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookRow } from '../../src/components/BookRow';
import { Empty } from '../../src/components/Empty';
import { Header } from '../../src/components/Header';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { useCart } from '../../src/context/CartContext';
import { useToast } from '../../src/context/ToastContext';
import { books, findCategory } from '../../src/data';
import { colors } from '../../src/theme';

// Tela 9 - Lista de livros: rota dinâmica /livros/[categoria] ("todos" mostra o catálogo inteiro)
export default function Livros() {
  const router = useRouter();
  const { categoria } = useLocalSearchParams();
  const { addItem } = useCart();
  const showToast = useToast();
  const insets = useSafeAreaInsets();

  const category = findCategory(categoria);
  const list = category ? books.filter((book) => book.category === category.id) : books;
  const title = category ? category.name : 'Todos os livros';

  function add(book) {
    addItem(book);
    showToast('Livro adicionado ao carrinho.');
  }

  function searchOnline() {
    router.push({ pathname: '/busca', params: { q: category ? category.name : '' } });
  }

  return (
    <View style={s.page}>
      <Header
        title={title}
        back
        right={
          <Pressable onPress={searchOnline} hitSlop={10} accessibilityLabel="Buscar no acervo online">
            <Ionicons name="search" size={23} color="#fff" />
          </Pressable>
        }
      />
      <FlatList
        data={list}
        keyExtractor={(book) => book.id}
        contentContainerStyle={[s.list, { paddingBottom: 14 + insets.bottom }]}
        renderItem={({ item }) => (
          <BookRow book={item}>
            <Pressable
              style={s.cartButton}
              onPress={() => add(item)}
              accessibilityLabel="Adicionar ao carrinho"
            >
              <Ionicons name="cart" size={20} color="#fff" />
            </Pressable>
          </BookRow>
        )}
        ListEmptyComponent={
          <Empty
            icon="book-outline"
            title="Nenhum livro na loja"
            text="Ainda não há livros desta categoria na loja, mas você pode procurar no acervo online."
          />
        }
        ListFooterComponent={
          <View style={s.footer}>
            <PrimaryButton title="VER MAIS NO ACERVO ONLINE" outline onPress={searchOnline} />
          </View>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  list: { flexGrow: 1, padding: 14, gap: 12 },
  cartButton: {
    backgroundColor: colors.primary,
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  footer: { marginTop: 4 },
});

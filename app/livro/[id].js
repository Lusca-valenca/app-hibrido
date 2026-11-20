import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Cover } from '../../src/components/Cover';
import { Header } from '../../src/components/Header';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { Stars } from '../../src/components/Stars';
import { ErrorState, Loading } from '../../src/components/StateViews';
import { useCart } from '../../src/context/CartContext';
import { useFavorites } from '../../src/context/FavoritesContext';
import { useToast } from '../../src/context/ToastContext';
import { findLocalBook } from '../../src/data';
import { getBookDetails, getCachedBook } from '../../src/services/openLibrary';
import { colors } from '../../src/theme';
import { money } from '../../src/utils/format';

// Tela 10 - Detalhes: rota dinâmica /livro/[id].
// Livros da loja vêm do catálogo local; livros do acervo online têm a sinopse carregada da API.
export default function Detalhes() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { items, addItem } = useCart();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const showToast = useToast();

  // Procura o livro onde ele já estiver disponível antes de ir à internet
  function findKnownBook() {
    return (
      findLocalBook(id) ||
      getCachedBook(id) ||
      favorites.find((book) => book.id === id) ||
      items.find((item) => item.book.id === id)?.book ||
      null
    );
  }

  const [book, setBook] = useState(findKnownBook);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadDetails() {
    const known = findKnownBook();
    setBook(known);
    setError('');

    // Livro local ou já com sinopse: não precisa consultar a API
    if (known && (known.source !== 'api' || known.description)) return;

    setLoading(true);
    try {
      setBook(await getBookDetails(id));
    } catch (requestError) {
      if (!known) setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDetails();
  }, [id]);

  if (!book) {
    return (
      <View style={s.page}>
        <Header title="Detalhes do livro" back />
        {error ? (
          <ErrorState message={`Não foi possível abrir este livro. ${error}`} onRetry={loadDetails} />
        ) : (
          <Loading text="Carregando livro..." />
        )}
      </View>
    );
  }

  const favorite = isFavorite(book.id);

  function handleFavorite() {
    const added = toggleFavorite(book);
    showToast(added ? 'Adicionado aos favoritos.' : 'Removido dos favoritos.');
  }

  function handleAdd() {
    addItem(book);
    showToast('Livro adicionado ao carrinho.');
  }

  return (
    <View style={s.page}>
      <Header
        title="Detalhes do livro"
        back
        right={
          <Pressable
            onPress={handleFavorite}
            hitSlop={10}
            accessibilityLabel={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={25}
              color={favorite ? '#FF6B6B' : '#fff'}
            />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={s.body}>
        <View style={s.coverBox}>
          <Cover book={book} large />
        </View>

        <Text style={s.title}>{book.title}</Text>
        <Text style={s.author}>{book.author}</Text>
        <Stars value={book.rating} />
        <Text style={s.price}>{money(book.price)}</Text>
        <Text style={s.stock}>Em estoque</Text>

        <View style={s.divider} />
        <Text style={s.section}>Sinopse</Text>
        {loading ? (
          <View style={s.loadingLine}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={s.text}>Carregando sinopse do acervo online...</Text>
          </View>
        ) : (
          <Text style={s.text}>{book.description || 'Sinopse não disponível para este título.'}</Text>
        )}

        <View style={s.divider} />
        <Text style={s.section}>Informações</Text>
        <Text style={s.text}>Formato: Livro físico</Text>
        {book.year ? <Text style={s.text}>Primeira publicação: {book.year}</Text> : null}
        <Text style={s.text}>
          Origem: {book.source === 'api' ? 'Acervo online (Open Library)' : 'Catálogo da loja'}
        </Text>
        <Text style={s.text}>Disponibilidade: Imediata</Text>
      </ScrollView>

      <View style={[s.buyBar, { paddingBottom: 12 + insets.bottom }]}>
        <PrimaryButton title="ADICIONAR AO CARRINHO" onPress={handleAdd} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 20, gap: 8 },
  coverBox: { alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: colors.text, marginTop: 10 },
  author: { color: colors.muted },
  price: { fontSize: 23, fontWeight: '900', color: colors.text, marginTop: 5 },
  stock: { color: colors.success, fontWeight: '700' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 13 },
  section: { fontSize: 17, fontWeight: '800', color: colors.text },
  text: { lineHeight: 23, color: colors.muted },
  loadingLine: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  buyBar: {
    paddingTop: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: colors.border,
  },
});

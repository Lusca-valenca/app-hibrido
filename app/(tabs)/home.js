import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookCard } from '../../src/components/BookCard';
import { Logo } from '../../src/components/Logo';
import { SectionTitle } from '../../src/components/SectionTitle';
import { ErrorState, Loading } from '../../src/components/StateViews';
import { books, categories } from '../../src/data';
import { searchBooks } from '../../src/services/openLibrary';
import { colors, shadow } from '../../src/theme';

const ONLINE_QUERY = 'Machado de Assis';

// Tela 4 - Home: busca, categorias, mais vendidos e uma vitrine vinda da API
export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [online, setOnline] = useState({ loading: true, error: '', books: [] });

  const term = query.trim().toLowerCase();
  const shown = books.filter((book) => (book.title + book.author).toLowerCase().includes(term));

  // Consumo de API: carrega a vitrine de clássicos direto da Open Library
  async function loadOnline() {
    setOnline({ loading: true, error: '', books: [] });
    try {
      const result = await searchBooks(ONLINE_QUERY, 10);
      setOnline({ loading: false, error: '', books: result });
    } catch (error) {
      setOnline({ loading: false, error: error.message, books: [] });
    }
  }

  useEffect(() => {
    loadOnline();
  }, []);

  function openSearch() {
    router.push({ pathname: '/busca', params: { q: query.trim() } });
  }

  return (
    <ScrollView style={s.page} keyboardShouldPersistTaps="handled">
      <View style={[s.top, { paddingTop: insets.top + 16 }]}>
        <View style={s.topRow}>
          <Logo light small />
          <Pressable
            onPress={() => router.push('/carrinho')}
            hitSlop={10}
            accessibilityLabel="Abrir carrinho"
          >
            <Ionicons name="cart-outline" size={25} color="#fff" />
          </Pressable>
        </View>
        <View style={s.search}>
          <Ionicons name="search" size={19} color={colors.muted} />
          <TextInput
            style={s.searchInput}
            placeholder="Buscar livros, autores, títulos..."
            placeholderTextColor={colors.muted}
            returnKeyType="search"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={openSearch}
          />
        </View>
      </View>

      <View style={s.body}>
        {term ? (
          <Pressable style={s.onlineSearch} onPress={openSearch}>
            <Ionicons name="globe-outline" size={20} color={colors.primary} />
            <Text style={s.onlineSearchText} numberOfLines={1}>
              Buscar “{query.trim()}” no acervo online
            </Text>
            <Ionicons name="chevron-forward" size={18} color={colors.primary} />
          </Pressable>
        ) : (
          <View style={s.banner}>
            <View style={s.bannerInfo}>
              <Text style={s.bannerTitle}>Livros que transformam ideias.</Text>
              <Text style={s.bannerSub}>Ofertas para sua próxima leitura</Text>
            </View>
            <Ionicons name="library" size={70} color={colors.accent} />
          </View>
        )}

        <SectionTitle title="Categorias" onAction={() => router.push('/categorias')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.slice(0, 5).map((category) => (
            <Pressable
              key={category.id}
              style={s.category}
              onPress={() =>
                router.push({ pathname: '/livros/[categoria]', params: { categoria: category.id } })
              }
            >
              <View style={s.categoryIcon}>
                <Ionicons name={category.icon} size={23} color={colors.primary} />
              </View>
              <Text style={s.categoryText}>{category.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <SectionTitle
          title={term ? 'Resultados na loja' : 'Mais vendidos'}
          onAction={() =>
            router.push({ pathname: '/livros/[categoria]', params: { categoria: 'todos' } })
          }
        />
        {shown.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {shown.slice(0, 8).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </ScrollView>
        ) : (
          <Text style={s.muted}>Nenhum livro da loja combina com a busca.</Text>
        )}

        <SectionTitle
          title="Clássicos brasileiros · acervo online"
          actionLabel="Ver mais"
          onAction={() => router.push({ pathname: '/busca', params: { q: ONLINE_QUERY } })}
        />
        {online.loading ? <Loading text="Carregando acervo online..." /> : null}
        {online.error ? <ErrorState message={online.error} onRetry={loadOnline} /> : null}
        {!online.loading && !online.error ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {online.books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </ScrollView>
        ) : null}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  top: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingBottom: 16, gap: 14 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  search: {
    height: 46,
    backgroundColor: '#fff',
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: { flex: 1, height: 46, color: colors.text, outlineWidth: 0 },
  body: { padding: 16, paddingBottom: 28 },
  banner: {
    minHeight: 135,
    borderRadius: 13,
    backgroundColor: '#124AA3',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow,
  },
  bannerInfo: { flex: 1 },
  bannerTitle: { color: '#fff', fontWeight: '900', fontSize: 21, maxWidth: 210 },
  bannerSub: { color: '#DCE8FF', marginTop: 8 },
  onlineSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.soft,
    borderRadius: 12,
    padding: 14,
  },
  onlineSearchText: { flex: 1, color: colors.primary, fontWeight: '700' },
  category: { alignItems: 'center', marginRight: 13, width: 68 },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 13,
    backgroundColor: colors.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: { fontSize: 10, textAlign: 'center', marginTop: 6, color: colors.text },
  muted: { color: colors.muted },
});

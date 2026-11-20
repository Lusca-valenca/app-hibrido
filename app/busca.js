import { useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookRow } from '../src/components/BookRow';
import { Empty } from '../src/components/Empty';
import { Header } from '../src/components/Header';
import { ErrorState, Loading } from '../src/components/StateViews';
import { useCart } from '../src/context/CartContext';
import { useToast } from '../src/context/ToastContext';
import { searchBooks } from '../src/services/openLibrary';
import { colors } from '../src/theme';

// Tela 11 - Busca: consome a API Open Library e mostra carregando, erro, vazio ou resultados
export default function Busca() {
  const params = useLocalSearchParams();
  const initialQuery = typeof params.q === 'string' ? params.q : '';
  const { addItem } = useCart();
  const showToast = useToast();
  const insets = useSafeAreaInsets();

  const [text, setText] = useState(initialQuery);
  const [status, setStatus] = useState('idle'); // idle | loading | error | done
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const lastRequest = useRef(0);

  async function search(query) {
    const term = query.trim();
    const request = lastRequest.current + 1;
    lastRequest.current = request;

    if (term.length < 3) {
      setStatus('idle');
      setResults([]);
      return;
    }

    setStatus('loading');
    try {
      const books = await searchBooks(term);
      // Só usa a resposta se ela for da busca mais recente
      if (lastRequest.current !== request) return;
      setResults(books);
      setStatus('done');
    } catch (requestError) {
      if (lastRequest.current !== request) return;
      setError(requestError.message);
      setStatus('error');
    }
  }

  // Espera o usuário parar de digitar por meio segundo antes de chamar a API
  useEffect(() => {
    const timer = setTimeout(() => search(text), 500);
    return () => clearTimeout(timer);
  }, [text]);

  function add(book) {
    addItem(book);
    showToast('Livro adicionado ao carrinho.');
  }

  function clear() {
    setText('');
  }

  return (
    <View style={s.page}>
      <Header title="Buscar no acervo online" back />

      <View style={s.searchBox}>
        <View style={s.search}>
          <Ionicons name="search" size={19} color={colors.muted} />
          <TextInput
            style={s.input}
            placeholder="Digite um título ou autor"
            placeholderTextColor={colors.muted}
            returnKeyType="search"
            autoFocus={!initialQuery}
            value={text}
            onChangeText={setText}
            onSubmitEditing={() => search(text)}
          />
          {text ? (
            <Pressable onPress={clear} hitSlop={10} accessibilityLabel="Limpar busca">
              <Ionicons name="close-circle" size={20} color={colors.muted} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {status === 'idle' ? (
        <Empty
          icon="globe-outline"
          title="Milhares de títulos"
          text="Digite pelo menos 3 letras para buscar livros na Open Library."
        />
      ) : null}

      {status === 'loading' ? <Loading text="Buscando livros..." /> : null}

      {status === 'error' ? <ErrorState message={error} onRetry={() => search(text)} /> : null}

      {status === 'done' ? (
        <FlatList
          data={results}
          keyExtractor={(book) => book.id}
          contentContainerStyle={[s.list, { paddingBottom: 14 + insets.bottom }]}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            results.length ? (
              <Text style={s.count}>
                {results.length} {results.length === 1 ? 'resultado' : 'resultados'} · preços
                simulados
              </Text>
            ) : null
          }
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
              icon="search-outline"
              title="Nada encontrado"
              text="Tente outro título ou o nome do autor."
            />
          }
        />
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  searchBox: { backgroundColor: colors.primary, paddingHorizontal: 16, paddingBottom: 14 },
  search: {
    height: 46,
    backgroundColor: '#fff',
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  input: { flex: 1, height: 46, color: colors.text, outlineWidth: 0 },
  list: { flexGrow: 1, padding: 14, gap: 12 },
  count: { color: colors.muted, fontSize: 12 },
  cartButton: {
    backgroundColor: colors.primary,
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
});

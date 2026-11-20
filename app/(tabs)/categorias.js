import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { books, categories } from '../../src/data';
import { colors, shadow } from '../../src/theme';

// Tela 5 - Categorias: cada linha abre a lista de livros daquela categoria
export default function Categorias() {
  const router = useRouter();

  function countOf(categoryId) {
    const total = books.filter((book) => book.category === categoryId).length;
    return total === 1 ? '1 livro na loja' : `${total} livros na loja`;
  }

  return (
    <View style={s.page}>
      <Header title="Categorias" />
      <ScrollView contentContainerStyle={s.body}>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            style={s.row}
            onPress={() =>
              router.push({ pathname: '/livros/[categoria]', params: { categoria: category.id } })
            }
          >
            <View style={s.icon}>
              <Ionicons name={category.icon} size={25} color={colors.primary} />
            </View>
            <View style={s.info}>
              <Text style={s.name}>{category.name}</Text>
              <Text style={s.count}>{countOf(category.id)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={21} color={colors.muted} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 16, gap: 11 },
  row: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    ...shadow,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 13,
    backgroundColor: colors.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  name: { fontWeight: '800', color: colors.text, fontSize: 15 },
  count: { color: colors.muted, fontSize: 12, marginTop: 4 },
});

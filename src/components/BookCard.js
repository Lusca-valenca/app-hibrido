import { Pressable, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../theme';
import { money } from '../utils/format';
import { Cover } from './Cover';

// Cartão pequeno usado nas listas horizontais da Home
export function BookCard({ book }) {
  const router = useRouter();

  return (
    <Pressable
      style={s.card}
      onPress={() => router.push({ pathname: '/livro/[id]', params: { id: book.id } })}
    >
      <Cover book={book} />
      <Text style={s.title} numberOfLines={2}>
        {book.title}
      </Text>
      <Text style={s.price}>{money(book.price)}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { width: 100, marginRight: 13 },
  title: { fontWeight: '700', fontSize: 13, marginTop: 7, color: colors.text },
  price: { fontWeight: '900', color: colors.text, marginTop: 5 },
});

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, shadow } from '../theme';
import { money } from '../utils/format';
import { Cover } from './Cover';
import { Stars } from './Stars';

// Linha de livro usada nas listas. "children" recebe o botão da direita (carrinho, lixeira...)
export function BookRow({ book, children }) {
  const router = useRouter();

  return (
    <Pressable
      style={s.row}
      onPress={() => router.push({ pathname: '/livro/[id]', params: { id: book.id } })}
    >
      <Cover book={book} />
      <View style={s.info}>
        <Text style={s.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={s.author} numberOfLines={1}>
          {book.author}
          {book.year ? ` · ${book.year}` : ''}
        </Text>
        <Stars value={book.rating} />
        <Text style={s.price}>{money(book.price)}</Text>
      </View>
      {children}
    </Pressable>
  );
}

const s = StyleSheet.create({
  row: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...shadow,
  },
  info: { flex: 1, gap: 4 },
  title: { fontWeight: '800', color: colors.text, fontSize: 15 },
  author: { color: colors.muted, fontSize: 12 },
  price: { fontWeight: '900', color: colors.text, marginTop: 2 },
});

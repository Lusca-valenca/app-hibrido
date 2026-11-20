import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Cover } from '../../src/components/Cover';
import { Empty } from '../../src/components/Empty';
import { Header } from '../../src/components/Header';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { QuantityStepper } from '../../src/components/QuantityStepper';
import { useCart } from '../../src/context/CartContext';
import { colors, shadow } from '../../src/theme';
import { money } from '../../src/utils/format';

// Tela 7 - Carrinho: soma, quantidade e remoção, tudo salvo no aparelho
export default function Carrinho() {
  const router = useRouter();
  const { items, total, changeQty, removeItem } = useCart();

  return (
    <View style={s.page}>
      <Header title="Meu Carrinho" />
      <FlatList
        data={items}
        keyExtractor={(item) => item.book.id}
        contentContainerStyle={s.list}
        renderItem={({ item }) => (
          <View style={s.row}>
            <Cover book={item.book} />
            <View style={s.info}>
              <Text style={s.title} numberOfLines={2}>
                {item.book.title}
              </Text>
              <Text style={s.author} numberOfLines={1}>
                {item.book.author}
              </Text>
              <Text style={s.price}>{money(item.book.price)}</Text>
              <QuantityStepper
                value={item.qty}
                onDecrease={() => changeQty(item.book.id, -1)}
                onIncrease={() => changeQty(item.book.id, 1)}
              />
            </View>
            <Pressable
              onPress={() => removeItem(item.book.id)}
              hitSlop={10}
              accessibilityLabel="Remover do carrinho"
            >
              <Ionicons name="trash-outline" size={21} color={colors.danger} />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Empty
            icon="cart-outline"
            title="Carrinho vazio"
            text="Adicione livros para visualizar o resumo do pedido."
          >
            <PrimaryButton title="VER LIVROS" onPress={() => router.push('/home')} />
          </Empty>
        }
        ListFooterComponent={
          items.length ? (
            <View style={s.summary}>
              <View style={s.line}>
                <Text style={s.label}>Subtotal</Text>
                <Text style={s.value}>{money(total)}</Text>
              </View>
              <View style={s.line}>
                <Text style={s.label}>Frete</Text>
                <Text style={s.free}>Grátis</Text>
              </View>
              <View style={s.divider} />
              <View style={s.line}>
                <Text style={s.totalLabel}>Total</Text>
                <Text style={s.total}>{money(total)}</Text>
              </View>
              <PrimaryButton title="FINALIZAR COMPRA" onPress={() => router.push('/checkout')} />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  list: { flexGrow: 1, padding: 14, gap: 12 },
  row: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...shadow,
  },
  info: { flex: 1, gap: 3 },
  title: { fontWeight: '800', color: colors.text, fontSize: 15 },
  author: { color: colors.muted, fontSize: 12 },
  price: { fontWeight: '900', color: colors.text },
  summary: { backgroundColor: '#fff', padding: 17, borderRadius: 12, gap: 12, ...shadow },
  line: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: colors.muted },
  value: { color: colors.text, fontWeight: '600' },
  free: { color: colors.success, fontWeight: '700' },
  divider: { height: 1, backgroundColor: colors.border },
  totalLabel: { fontSize: 17, fontWeight: '800', color: colors.text },
  total: { fontSize: 20, fontWeight: '900', color: colors.text },
});

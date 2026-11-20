import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addressLine } from '../src/components/AddressForm';
import { Empty } from '../src/components/Empty';
import { Header } from '../src/components/Header';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { useOrders } from '../src/context/OrdersContext';
import { colors, shadow } from '../src/theme';
import { formatDate, money } from '../src/utils/format';

// Tela 14 - Meus pedidos: histórico lido do armazenamento local
export default function Pedidos() {
  const router = useRouter();
  const { orders } = useOrders();
  const insets = useSafeAreaInsets();

  return (
    <View style={s.page}>
      <Header title="Meus pedidos" back />
      <FlatList
        data={orders}
        keyExtractor={(order) => order.id}
        contentContainerStyle={[s.list, { paddingBottom: 14 + insets.bottom }]}
        renderItem={({ item }) => (
          <View style={s.card}>
            <View style={s.line}>
              <Text style={s.id}>Pedido #{item.id}</Text>
              <Text style={s.status}>Confirmado</Text>
            </View>
            <Text style={s.muted}>{formatDate(item.date)}</Text>

            <View style={s.divider} />
            {item.items.map((book) => (
              <View key={book.id} style={s.line}>
                <Text style={s.item} numberOfLines={1}>
                  {book.qty}x {book.title}
                </Text>
                <Text style={s.itemPrice}>{money(book.price * book.qty)}</Text>
              </View>
            ))}
            <View style={s.divider} />

            <Text style={s.muted}>Pagamento: {item.payment}</Text>
            <Text style={s.muted}>Entrega: {addressLine(item.address)}</Text>
            <View style={s.line}>
              <Text style={s.totalLabel}>Total</Text>
              <Text style={s.total}>{money(item.total)}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Empty
            icon="receipt-outline"
            title="Nenhum pedido ainda"
            text="Quando você finalizar uma compra, ela aparece aqui."
          >
            <PrimaryButton title="VER LIVROS" onPress={() => router.dismissTo('/home')} />
          </Empty>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  list: { flexGrow: 1, padding: 14, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, gap: 8, ...shadow },
  line: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  id: { fontWeight: '900', color: colors.text, fontSize: 15 },
  status: {
    color: colors.success,
    fontWeight: '800',
    fontSize: 12,
    backgroundColor: '#E7F6EE',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  muted: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
  item: { flex: 1, color: colors.text },
  itemPrice: { color: colors.text, fontWeight: '700' },
  totalLabel: { fontWeight: '800', color: colors.text, fontSize: 15 },
  total: { fontWeight: '900', color: colors.text, fontSize: 18 },
});

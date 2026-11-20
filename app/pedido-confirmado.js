import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { addressLine } from '../src/components/AddressForm';
import { Header } from '../src/components/Header';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { useOrders } from '../src/context/OrdersContext';
import { colors, shadow } from '../src/theme';
import { money } from '../src/utils/format';

// Tela 13 - Pedido confirmado: recebe o número do pedido pela rota e mostra o resumo
export default function PedidoConfirmado() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { findOrder } = useOrders();
  const order = findOrder(id);
  const insets = useSafeAreaInsets();

  return (
    <View style={s.page}>
      <Header title="Pedido confirmado" />

      <View style={[s.body, { paddingBottom: 24 + insets.bottom }]}>
        <View style={s.icon}>
          <Ionicons name="checkmark" size={46} color="#fff" />
        </View>
        <Text style={s.title}>Compra realizada!</Text>
        <Text style={s.text}>
          Este é um pedido simulado para demonstração. Nenhum pagamento foi cobrado.
        </Text>

        {order ? (
          <View style={s.card}>
            <View style={s.line}>
              <Text style={s.label}>Pedido</Text>
              <Text style={s.value}>#{order.id}</Text>
            </View>
            <View style={s.line}>
              <Text style={s.label}>Pagamento</Text>
              <Text style={s.value}>{order.payment}</Text>
            </View>
            <View style={s.line}>
              <Text style={s.label}>Total</Text>
              <Text style={s.value}>{money(order.total)}</Text>
            </View>
            <Text style={s.address}>Entrega em: {addressLine(order.address)}</Text>
          </View>
        ) : null}

        <View style={s.actions}>
          <PrimaryButton title="VER MEUS PEDIDOS" onPress={() => router.replace('/pedidos')} />
          <PrimaryButton
            title="CONTINUAR COMPRANDO"
            outline
            onPress={() => router.dismissTo('/home')}
          />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  icon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 23, fontWeight: '900', color: colors.text, marginTop: 6 },
  text: { color: colors.muted, textAlign: 'center', lineHeight: 21, maxWidth: 340 },
  card: {
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 10,
    marginTop: 8,
    ...shadow,
  },
  line: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: colors.muted },
  value: { color: colors.text, fontWeight: '800' },
  address: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  actions: { alignSelf: 'stretch', gap: 10, marginTop: 10 },
});

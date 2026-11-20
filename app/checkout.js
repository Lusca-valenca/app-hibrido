import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AddressForm, addressLine } from '../src/components/AddressForm';
import { Empty } from '../src/components/Empty';
import { Header } from '../src/components/Header';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { useAddresses } from '../src/context/AddressContext';
import { useCart } from '../src/context/CartContext';
import { useOrders } from '../src/context/OrdersContext';
import { useToast } from '../src/context/ToastContext';
import { colors, shadow } from '../src/theme';
import { formatCep, money } from '../src/utils/format';

const PAYMENTS = [
  { id: 'Pix', icon: 'qr-code-outline' },
  { id: 'Cartão de crédito', icon: 'card-outline' },
  { id: 'Boleto', icon: 'barcode-outline' },
];

// Tela 12 - Checkout: endereço (com CEP via API), pagamento e confirmação do pedido
export default function Checkout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, total, clearCart } = useCart();
  const { addresses, addAddress } = useAddresses();
  const { addOrder } = useOrders();
  const showToast = useToast();

  const [addressId, setAddressId] = useState(addresses[0]?.id || null);
  const [showForm, setShowForm] = useState(addresses.length === 0);
  const [payment, setPayment] = useState(PAYMENTS[0].id);
  const [error, setError] = useState('');

  const address = addresses.find((item) => item.id === addressId) || null;

  function saveAddress(data) {
    const saved = addAddress(data);
    setAddressId(saved.id);
    setShowForm(false);
    setError('');
    showToast('Endereço salvo.');
  }

  function confirm() {
    if (!address) {
      setError('Escolha ou cadastre um endereço de entrega.');
      return;
    }

    const order = addOrder({ items, total, payment, address });
    clearCart();
    router.replace({ pathname: '/pedido-confirmado', params: { id: order.id } });
  }

  if (!items.length) {
    return (
      <View style={s.page}>
        <Header title="Finalizar compra" back />
        <Empty
          icon="cart-outline"
          title="Carrinho vazio"
          text="Adicione livros ao carrinho antes de finalizar a compra."
        >
          <PrimaryButton title="VER LIVROS" onPress={() => router.dismissTo('/home')} />
        </Empty>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={s.page} behavior="padding">
      <Header title="Finalizar compra" back />

      <ScrollView contentContainerStyle={s.body} keyboardShouldPersistTaps="handled">
        <Text style={s.section}>1. Endereço de entrega</Text>
        {addresses.map((item) => {
          const selected = item.id === addressId;
          return (
            <Pressable
              key={item.id}
              style={[s.choice, selected && s.choiceSelected]}
              onPress={() => {
                setAddressId(item.id);
                setError('');
              }}
            >
              <Ionicons
                name={selected ? 'radio-button-on' : 'radio-button-off'}
                size={22}
                color={selected ? colors.primary : colors.muted}
              />
              <View style={s.choiceInfo}>
                <Text style={s.choiceTitle}>{addressLine(item)}</Text>
                <Text style={s.choiceSub}>CEP {formatCep(item.cep)}</Text>
              </View>
            </Pressable>
          );
        })}

        {showForm ? (
          <View style={s.card}>
            <AddressForm onSubmit={saveAddress} submitLabel="USAR ESTE ENDEREÇO" />
          </View>
        ) : (
          <Pressable style={s.addLink} onPress={() => setShowForm(true)}>
            <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
            <Text style={s.addLinkText}>Cadastrar novo endereço</Text>
          </Pressable>
        )}

        <Text style={s.section}>2. Forma de pagamento</Text>
        {PAYMENTS.map((item) => {
          const selected = item.id === payment;
          return (
            <Pressable
              key={item.id}
              style={[s.choice, selected && s.choiceSelected]}
              onPress={() => setPayment(item.id)}
            >
              <Ionicons
                name={selected ? 'radio-button-on' : 'radio-button-off'}
                size={22}
                color={selected ? colors.primary : colors.muted}
              />
              <Text style={[s.choiceTitle, s.choiceInfo]}>{item.id}</Text>
              <Ionicons name={item.icon} size={22} color={colors.text} />
            </Pressable>
          );
        })}

        <Text style={s.section}>3. Resumo do pedido</Text>
        <View style={s.card}>
          {items.map((item) => (
            <View key={item.book.id} style={s.line}>
              <Text style={s.itemTitle} numberOfLines={1}>
                {item.qty}x {item.book.title}
              </Text>
              <Text style={s.itemPrice}>{money(item.book.price * item.qty)}</Text>
            </View>
          ))}
          <View style={s.divider} />
          <View style={s.line}>
            <Text style={s.muted}>Frete</Text>
            <Text style={s.free}>Grátis</Text>
          </View>
          <View style={s.line}>
            <Text style={s.totalLabel}>Total</Text>
            <Text style={s.total}>{money(total)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[s.bar, { paddingBottom: 12 + insets.bottom }]}>
        {error ? <Text style={s.error}>{error}</Text> : null}
        <PrimaryButton title={`CONFIRMAR PEDIDO · ${money(total)}`} onPress={confirm} />
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 16, gap: 10 },
  section: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 10 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, gap: 10, ...shadow },
  choice: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  choiceSelected: { borderColor: colors.primary, backgroundColor: '#F7FAFF' },
  choiceInfo: { flex: 1 },
  choiceTitle: { color: colors.text, fontWeight: '600' },
  choiceSub: { color: colors.muted, fontSize: 12, marginTop: 3 },
  addLink: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  addLinkText: { color: colors.primary, fontWeight: '700' },
  line: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  itemTitle: { flex: 1, color: colors.text },
  itemPrice: { color: colors.text, fontWeight: '700' },
  divider: { height: 1, backgroundColor: colors.border },
  muted: { color: colors.muted },
  free: { color: colors.success, fontWeight: '700' },
  totalLabel: { fontSize: 16, fontWeight: '800', color: colors.text },
  total: { fontSize: 19, fontWeight: '900', color: colors.text },
  bar: {
    paddingTop: 12,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  error: { color: colors.danger, fontSize: 13, textAlign: 'center' },
});

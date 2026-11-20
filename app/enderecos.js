import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AddressForm, addressLine } from '../src/components/AddressForm';
import { Header } from '../src/components/Header';
import { useAddresses } from '../src/context/AddressContext';
import { useToast } from '../src/context/ToastContext';
import { colors, shadow } from '../src/theme';
import { formatCep } from '../src/utils/format';

// Tela 15 - Endereços: lista salva no aparelho e cadastro com busca de CEP na API ViaCEP
export default function Enderecos() {
  const { addresses, addAddress, removeAddress } = useAddresses();
  const showToast = useToast();
  const insets = useSafeAreaInsets();

  function save(address) {
    addAddress(address);
    showToast('Endereço salvo.');
  }

  function remove(id) {
    removeAddress(id);
    showToast('Endereço removido.');
  }

  return (
    <KeyboardAvoidingView style={s.page} behavior="padding">
      <Header title="Endereços" back />
      <ScrollView
        contentContainerStyle={[s.body, { paddingBottom: 32 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={s.section}>Endereços salvos</Text>
        {addresses.length ? (
          addresses.map((address) => (
            <View key={address.id} style={s.row}>
              <Ionicons name="location-outline" size={23} color={colors.primary} />
              <View style={s.info}>
                <Text style={s.title}>{addressLine(address)}</Text>
                <Text style={s.sub}>CEP {formatCep(address.cep)}</Text>
              </View>
              <Pressable
                onPress={() => remove(address.id)}
                hitSlop={10}
                accessibilityLabel="Remover endereço"
              >
                <Ionicons name="trash-outline" size={21} color={colors.danger} />
              </Pressable>
            </View>
          ))
        ) : (
          <Text style={s.muted}>Você ainda não salvou nenhum endereço.</Text>
        )}

        <Text style={s.section}>Novo endereço</Text>
        <View style={s.card}>
          <AddressForm onSubmit={save} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 16, gap: 10 },
  section: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 10 },
  row: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...shadow,
  },
  info: { flex: 1 },
  title: { color: colors.text, fontWeight: '600' },
  sub: { color: colors.muted, fontSize: 12, marginTop: 3 },
  muted: { color: colors.muted },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, ...shadow },
});

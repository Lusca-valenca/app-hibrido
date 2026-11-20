import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Header } from '../../src/components/Header';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { useAddresses } from '../../src/context/AddressContext';
import { useAuth } from '../../src/context/AuthContext';
import { useFavorites } from '../../src/context/FavoritesContext';
import { useOrders } from '../../src/context/OrdersContext';
import { colors, shadow } from '../../src/theme';

// Tela 8 - Perfil: dados da sessão e atalhos para pedidos, favoritos e endereços
export default function Perfil() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { orders } = useOrders();
  const { favorites } = useFavorites();
  const { addresses } = useAddresses();

  const options = [
    { icon: 'receipt-outline', label: 'Meus pedidos', count: orders.length, href: '/pedidos' },
    { icon: 'heart-outline', label: 'Favoritos', count: favorites.length, href: '/favoritos' },
    { icon: 'location-outline', label: 'Endereços', count: addresses.length, href: '/enderecos' },
    { icon: 'search-outline', label: 'Buscar no acervo online', href: '/busca' },
  ];

  function leave() {
    signOut();
    router.replace('/login');
  }

  return (
    <View style={s.page}>
      <Header title="Meu Perfil" />
      <ScrollView contentContainerStyle={s.body}>
        <View style={s.card}>
          <View style={s.avatar}>
            <Ionicons name="person" size={37} color={colors.primary} />
          </View>
          <View style={s.info}>
            <Text style={s.name}>{user?.name || 'Visitante'}</Text>
            <Text style={s.email}>
              {user?.guest ? 'Você está navegando sem conta' : user?.email}
            </Text>
          </View>
        </View>

        {user?.guest ? (
          <View style={s.guest}>
            <PrimaryButton title="CRIAR CONTA" onPress={() => router.push('/cadastro')} />
          </View>
        ) : null}

        <View style={s.options}>
          {options.map((option) => (
            <Pressable key={option.label} style={s.option} onPress={() => router.push(option.href)}>
              <Ionicons name={option.icon} size={22} color={colors.text} />
              <Text style={s.optionText}>{option.label}</Text>
              {option.count ? <Text style={s.count}>{option.count}</Text> : null}
              <Ionicons name="chevron-forward" size={20} color={colors.muted} />
            </Pressable>
          ))}
          <Pressable style={[s.option, s.last]} onPress={leave}>
            <Ionicons name="log-out-outline" size={22} color={colors.danger} />
            <Text style={[s.optionText, s.danger]}>Sair da conta</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 16, gap: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    ...shadow,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  name: { fontWeight: '800', color: colors.text, fontSize: 16 },
  email: { color: colors.muted, fontSize: 12, marginTop: 4 },
  guest: { gap: 10 },
  options: { backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', ...shadow },
  option: {
    minHeight: 58,
    borderBottomWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingHorizontal: 14,
  },
  last: { borderBottomWidth: 0 },
  optionText: { flex: 1, color: colors.text },
  count: {
    minWidth: 24,
    textAlign: 'center',
    backgroundColor: colors.soft,
    color: colors.primary,
    fontWeight: '800',
    fontSize: 12,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  danger: { color: colors.danger },
});

import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';
import { useCart } from '../../src/context/CartContext';
import { colors } from '../../src/theme';

// Desenha o ícone da aba: preenchido quando a aba está ativa
function tabIcon(name) {
  return ({ color, focused }) => (
    <Ionicons name={focused ? name : `${name}-outline`} size={22} color={color} />
  );
}

// Barra de abas inferior do Expo Router (substitui a BottomNav feita à mão)
export default function TabsLayout() {
  const { user, ready } = useAuth();
  const { count } = useCart();
  const insets = useSafeAreaInsets();

  // Sem sessão não entra na loja: volta para o login
  if (!ready) return null;
  if (!user) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
        // Altura fixa + área segura do aparelho, para o texto das abas não ficar cortado
        tabBarStyle: { height: 64 + insets.bottom, paddingTop: 4, paddingBottom: insets.bottom + 4 },
        tabBarBadgeStyle: { backgroundColor: colors.danger, color: '#fff', fontSize: 10 },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: tabIcon('home') }} />
      <Tabs.Screen
        name="categorias"
        options={{ title: 'Categorias', tabBarIcon: tabIcon('grid') }}
      />
      <Tabs.Screen
        name="favoritos"
        options={{ title: 'Favoritos', tabBarIcon: tabIcon('heart') }}
      />
      <Tabs.Screen
        name="carrinho"
        options={{
          title: 'Carrinho',
          tabBarIcon: tabIcon('cart'),
          tabBarBadge: count > 0 ? count : undefined,
        }}
      />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', tabBarIcon: tabIcon('person') }} />
    </Tabs>
  );
}

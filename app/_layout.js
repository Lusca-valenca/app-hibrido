import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProviders } from '../src/context/AppProviders';
import { colors } from '../src/theme';

// Layout raiz: toda tela dentro de app/ vira uma rota do Expo Router.
// Os providers ficam aqui para que qualquer tela acesse login, carrinho, favoritos etc.
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProviders>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
          }}
        />
      </AppProviders>
    </SafeAreaProvider>
  );
}

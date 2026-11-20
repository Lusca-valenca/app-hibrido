import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Logo } from '../src/components/Logo';
import { colors } from '../src/theme';

// Tela 1 - Splash: primeira rota do Expo Router (arquivo app/index.js)
export default function Splash() {
  return (
    <View style={s.splash}>
      <Logo light />
      <Text style={s.text}>A maior variedade de livros para você.</Text>
      <ActivityIndicator size="large" color={colors.accent} style={s.spinner} />
    </View>
  );
}

const s = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  text: { color: '#fff', fontSize: 16, marginTop: 22, textAlign: 'center' },
  spinner: { marginTop: 45 },
});

import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Logo } from '../src/components/Logo';
import { useAuth } from '../src/context/AuthContext';
import { colors } from '../src/theme';

// Tela 1 - Splash: mostra a marca e decide para onde ir conforme a sessão salva
export default function Splash() {
  const router = useRouter();
  const { user, ready } = useAuth();
  const [minTimeDone, setMinTimeDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeDone(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready && minTimeDone) {
      router.replace(user ? '/home' : '/login');
    }
  }, [ready, minTimeDone]);

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

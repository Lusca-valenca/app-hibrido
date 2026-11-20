import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../src/components/Input';
import { Logo } from '../src/components/Logo';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { useAuth } from '../src/context/AuthContext';
import { colors } from '../src/theme';

// Tela 2 - Login: valida os dados com as contas salvas no aparelho
export default function Login() {
  const router = useRouter();
  const { signIn, signInGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function enter() {
    const result = signIn(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.replace('/home');
  }

  function enterAsGuest() {
    signInGuest();
    router.replace('/home');
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView style={s.flex} behavior="padding">
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
          <Logo />
          <Text style={s.title}>Bem-vindo de volta!</Text>
          <Text style={s.muted}>Faça login para continuar</Text>

          <View style={s.form}>
            <Input
              placeholder="E-mail"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
            <Input
              placeholder="Senha"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onSubmitEditing={enter}
            />
            {error ? <Text style={s.error}>{error}</Text> : null}

            <PrimaryButton title="ENTRAR" onPress={enter} />
            <Text style={s.or}>ou</Text>
            <PrimaryButton title="CONTINUAR COMO VISITANTE" outline onPress={enterAsGuest} />

            <Text style={s.footer}>
              Não tem conta?{' '}
              <Link href="/cadastro" style={s.link}>
                Criar conta
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: 28, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 21, fontWeight: '800', color: colors.text, marginTop: 30 },
  muted: { color: colors.muted, marginTop: 6 },
  form: { width: '100%', maxWidth: 420, gap: 13, marginTop: 28 },
  error: { color: colors.danger, fontSize: 13 },
  or: { textAlign: 'center', color: colors.muted },
  footer: { textAlign: 'center', marginTop: 18, color: colors.muted },
  link: { color: colors.primary, fontWeight: '700' },
});

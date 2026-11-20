import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../src/components/Input';
import { Logo } from '../src/components/Logo';
import { PrimaryButton } from '../src/components/PrimaryButton';
import { useAuth } from '../src/context/AuthContext';
import { useToast } from '../src/context/ToastContext';
import { colors } from '../src/theme';

// Tela 3 - Cadastro: cria uma conta e salva no armazenamento local
export default function Cadastro() {
  const router = useRouter();
  const { signUp } = useAuth();
  const showToast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  function create() {
    if (password !== confirm) {
      setError('As senhas não são iguais.');
      return;
    }

    const result = signUp({ name, email, password });
    if (!result.ok) {
      setError(result.error);
      return;
    }

    showToast('Conta criada com sucesso!');
    // Fecha as telas abertas por cima (login ou perfil) e entra na loja
    if (router.canDismiss()) router.dismissAll();
    router.replace('/home');
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView style={s.flex} behavior="padding">
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
          <Logo />
          <Text style={s.title}>Criar conta</Text>
          <Text style={s.muted}>Seus dados ficam salvos neste aparelho</Text>

          <View style={s.form}>
            <Input label="Nome" placeholder="Seu nome completo" value={name} onChangeText={setName} />
            <Input
              label="E-mail"
              placeholder="voce@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />
            <Input
              label="Senha"
              placeholder="Mínimo de 6 caracteres"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Input
              label="Confirmar senha"
              placeholder="Repita a senha"
              secureTextEntry
              value={confirm}
              onChangeText={setConfirm}
              onSubmitEditing={create}
            />
            {error ? <Text style={s.error}>{error}</Text> : null}

            <PrimaryButton title="CRIAR CONTA" onPress={create} />

            <Text style={s.footer}>
              Já tem conta?{' '}
              <Link href="/login" replace style={s.link}>
                Entrar
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
  title: { fontSize: 21, fontWeight: '800', color: colors.text, marginTop: 26 },
  muted: { color: colors.muted, marginTop: 6 },
  form: { width: '100%', maxWidth: 420, gap: 13, marginTop: 24 },
  error: { color: colors.danger, fontSize: 13 },
  footer: { textAlign: 'center', marginTop: 14, color: colors.muted },
  link: { color: colors.primary, fontWeight: '700' },
});

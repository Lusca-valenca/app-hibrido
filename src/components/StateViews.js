import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { PrimaryButton } from './PrimaryButton';

// Indicador de carregamento usado enquanto a API responde
export function Loading({ text = 'Carregando...' }) {
  return (
    <View style={s.box}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={s.text}>{text}</Text>
    </View>
  );
}

// Mensagem de erro com botão para tentar de novo
export function ErrorState({ message, onRetry }) {
  return (
    <View style={s.box}>
      <Ionicons name="cloud-offline-outline" size={46} color={colors.danger} />
      <Text style={s.text}>{message}</Text>
      {onRetry ? (
        <View style={s.retry}>
          <PrimaryButton title="TENTAR NOVAMENTE" outline onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center', padding: 28, gap: 12 },
  text: { color: colors.muted, textAlign: 'center', lineHeight: 21 },
  retry: { alignSelf: 'stretch', marginTop: 4 },
});

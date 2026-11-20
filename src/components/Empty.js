import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

// Estado vazio: ícone, título, texto e (opcional) um botão passado como children
export function Empty({ icon, title, text, children }) {
  return (
    <View style={s.empty}>
      <Ionicons name={icon} size={55} color={colors.primary} />
      <Text style={s.title}>{title}</Text>
      <Text style={s.text}>{text}</Text>
      {children ? <View style={s.action}>{children}</View> : null}
    </View>
  );
}

const s = StyleSheet.create({
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: 15, textAlign: 'center' },
  text: { textAlign: 'center', color: colors.muted, marginTop: 7, lineHeight: 21 },
  action: { marginTop: 20, alignSelf: 'stretch' },
});

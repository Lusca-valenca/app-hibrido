import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

// Título de seção com link opcional à direita
export function SectionTitle({ title, actionLabel = 'Ver todas', onAction }) {
  return (
    <View style={s.head}>
      <Text style={s.title}>{title}</Text>
      {onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={s.link}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
    gap: 12,
  },
  title: { flex: 1, fontSize: 17, fontWeight: '800', color: colors.text },
  link: { color: colors.primary, fontWeight: '700' },
});

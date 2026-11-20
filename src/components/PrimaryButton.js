import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

export function PrimaryButton({ title, onPress, outline = false, disabled = false, loading = false }) {
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        s.button,
        outline && s.outline,
        (disabled || loading) && s.disabled,
        pressed && s.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={outline ? colors.primary : '#fff'} />
      ) : (
        <Text style={[s.text, outline && s.outlineText]}>{title}</Text>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    minHeight: 50,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  outline: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: colors.primary },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.8 },
  text: { color: '#fff', fontWeight: '800', textAlign: 'center' },
  outlineText: { color: colors.primary },
});

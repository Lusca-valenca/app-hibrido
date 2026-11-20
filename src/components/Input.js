import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme';

// Campo de texto com rótulo e mensagem de erro
export function Input({ label, error, style, ...props }) {
  return (
    <View style={[s.field, style]}>
      {label ? <Text style={s.label}>{label}</Text> : null}
      <TextInput
        style={[s.input, error ? s.inputError : null]}
        placeholderTextColor={colors.muted}
        accessibilityLabel={label || props.placeholder}
        {...props}
      />
      {error ? <Text style={s.error}>{error}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: '700', color: colors.text },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    color: colors.text,
    fontSize: 15,
  },
  inputError: { borderColor: colors.danger },
  error: { color: colors.danger, fontSize: 12 },
});

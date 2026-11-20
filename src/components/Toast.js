import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shadow } from '../theme';

// Aviso rápido que aparece na parte de baixo da tela
export function Toast({ message }) {
  const insets = useSafeAreaInsets();

  if (!message) return null;

  return (
    <View style={[s.wrap, { bottom: insets.bottom + 84 }]}>
      <View style={s.toast}>
        <Ionicons name="checkmark-circle" size={19} color="#7CE0A7" />
        <Text style={s.text}>{message}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
    pointerEvents: 'none',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: '#172033',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    maxWidth: 420,
    ...shadow,
  },
  text: { color: '#fff', fontWeight: '600', flexShrink: 1 },
});

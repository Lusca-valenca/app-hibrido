import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export function Logo({ light = false, small = false }) {
  const color = light ? colors.accent : colors.primary;

  return (
    <View style={s.logo}>
      <Ionicons name="book" size={small ? 24 : 34} color={color} />
      <Text style={[s.text, { fontSize: small ? 22 : 31, color }]}>Saraiva</Text>
    </View>
  );
}

const s = StyleSheet.create({
  logo: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  text: { fontWeight: '900' },
});

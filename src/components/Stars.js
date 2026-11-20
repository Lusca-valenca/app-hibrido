import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

// Mostra a nota do livro em estrelas (cheia, meia ou vazia)
export function Stars({ value }) {
  if (!value) return null;

  const stars = [1, 2, 3, 4, 5].map((position) => {
    if (value >= position - 0.25) return 'star';
    if (value >= position - 0.75) return 'star-half';
    return 'star-outline';
  });

  return (
    <View style={s.row}>
      {stars.map((icon, index) => (
        <Ionicons key={index} name={icon} size={13} color="#F5A000" />
      ))}
      <Text style={s.value}>{value.toFixed(1)}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 1 },
  value: { fontSize: 12, color: colors.muted, marginLeft: 5 },
});

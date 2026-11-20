import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

// Controle de quantidade do carrinho ( - 1 + )
export function QuantityStepper({ value, onDecrease, onIncrease }) {
  return (
    <View style={s.box}>
      <Pressable onPress={onDecrease} hitSlop={8} accessibilityLabel="Diminuir quantidade">
        <Ionicons name="remove" size={20} color={colors.text} />
      </Pressable>
      <Text style={s.value}>{value}</Text>
      <Pressable onPress={onIncrease} hitSlop={8} accessibilityLabel="Aumentar quantidade">
        <Ionicons name="add" size={20} color={colors.text} />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  box: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    width: 105,
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  value: { fontWeight: '800', color: colors.text },
});

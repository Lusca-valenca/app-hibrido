import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';

// Cabeçalho azul das telas. Com "back", mostra a seta que volta para a tela anterior.
export function Header({ title, back = false, right = null }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/home');
  }

  return (
    <View style={[s.header, { paddingTop: insets.top, height: 58 + insets.top }]}>
      <View style={s.side}>
        {back ? (
          <Pressable onPress={goBack} hitSlop={12} accessibilityLabel="Voltar">
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </Pressable>
        ) : null}
      </View>
      <Text style={s.title} numberOfLines={1}>
        {title}
      </Text>
      <View style={[s.side, s.right]}>{right}</View>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  side: { width: 40 },
  right: { alignItems: 'flex-end' },
  title: { flex: 1, textAlign: 'center', color: '#fff', fontSize: 18, fontWeight: '800' },
});

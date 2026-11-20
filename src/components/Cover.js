import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { shadow } from '../theme';

// Capa do livro: usa a imagem da API quando existe; senão desenha uma capa colorida
export function Cover({ book, large = false }) {
  const [imageFailed, setImageFailed] = useState(false);
  const size = large ? s.large : s.small;
  // Títulos da API são mais longos, então usam letra menor na capa pequena
  const smallFont = book.source === 'api' ? 9 : 11;

  if (book.coverUrl && !imageFailed) {
    return (
      <Image
        source={{ uri: book.coverUrl }}
        style={[s.cover, s.image, size]}
        resizeMode="cover"
        onError={() => setImageFailed(true)}
        accessibilityLabel={`Capa do livro ${book.title}`}
      />
    );
  }

  return (
    <View style={[s.cover, s.drawn, size, { backgroundColor: book.color || '#14263D' }]}>
      <Ionicons name="book-outline" size={large ? 28 : 18} color="#fff" />
      <Text style={[s.tag, { fontSize: large ? 18 : smallFont }]} numberOfLines={5}>
        {book.tag || book.title}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  cover: { borderRadius: 7, ...shadow },
  image: { backgroundColor: '#DDE3EE' },
  drawn: { padding: 8, justifyContent: 'space-between' },
  small: { width: 76, height: 108 },
  large: { width: 150, height: 210 },
  tag: { color: '#fff', fontWeight: '900' },
});

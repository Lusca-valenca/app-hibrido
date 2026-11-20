import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Empty } from '../src/components/Empty';
import { Header } from '../src/components/Header';
import { PrimaryButton } from '../src/components/PrimaryButton';

// Rota exibida quando o endereço não existe
export default function NotFound() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <Header title="Página não encontrada" />
      <Empty
        icon="compass-outline"
        title="Ops! Nada por aqui"
        text="A página que você tentou abrir não existe."
      >
        <PrimaryButton title="IR PARA O INÍCIO" onPress={() => router.replace('/')} />
      </Empty>
    </View>
  );
}

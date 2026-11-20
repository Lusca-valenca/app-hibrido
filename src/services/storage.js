// Armazenamento local com AsyncStorage: os dados continuam salvos ao fechar o app
import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  users: '@saraiva/usuarios',
  session: '@saraiva/sessao',
  cart: '@saraiva/carrinho',
  favorites: '@saraiva/favoritos',
  orders: '@saraiva/pedidos',
  addresses: '@saraiva/enderecos',
};

export async function loadJSON(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export async function saveJSON(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Se o armazenamento falhar, o app continua funcionando só em memória
  }
}

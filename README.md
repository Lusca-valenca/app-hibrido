# Saraiva Mobile

Clone visual acadêmico, sem vínculo comercial com a Saraiva. Aplicativo de livraria feito em React Native com Expo para a P2 da disciplina.

**Vídeo de demonstração:** _cole aqui o link do vídeo_

## O que o projeto usa

| Requisito | Onde está |
|---|---|
| StyleSheet + Flexbox | Todas as telas e componentes (`StyleSheet.create`) |
| Navegação com Expo Router | Pasta `app/` (Stack, abas em `(tabs)` e rotas dinâmicas `[id]` e `[categoria]`) |
| Consumo de API | `src/services/openLibrary.js` (livros) e `src/services/viaCep.js` (CEP) |
| Armazenamento local | `src/services/storage.js` + `src/hooks/usePersistedState.js` (AsyncStorage) |

## Telas (15)

1. Splash (`app/index.js`)
2. Login (`app/login.js`)
3. Cadastro (`app/cadastro.js`)
4. Home (`app/(tabs)/home.js`)
5. Categorias (`app/(tabs)/categorias.js`)
6. Favoritos (`app/(tabs)/favoritos.js`)
7. Carrinho (`app/(tabs)/carrinho.js`)
8. Perfil (`app/(tabs)/perfil.js`)
9. Lista de livros por categoria (`app/livros/[categoria].js`)
10. Detalhes do livro (`app/livro/[id].js`)
11. Busca no acervo online (`app/busca.js`)
12. Checkout (`app/checkout.js`)
13. Pedido confirmado (`app/pedido-confirmado.js`)
14. Meus pedidos (`app/pedidos.js`)
15. Endereços (`app/enderecos.js`)

## Funcionalidades

- Cadastro e login com contas salvas no aparelho, além do modo visitante
- Sessão, carrinho, favoritos, pedidos e endereços continuam salvos ao fechar o app
- Busca de livros na API Open Library, com estados de carregando, erro e vazio
- Sinopse dos livros online carregada da API na tela de detalhes
- Endereço preenchido automaticamente pelo CEP com a API ViaCEP
- Carrinho com quantidade, remoção e total; checkout com endereço e forma de pagamento
- Histórico de pedidos

## Como executar

```bash
npm install
npx expo start
```

Depois, leia o QR Code com o Expo Go ou pressione `a` (Android), `i` (iOS no macOS) ou `w` (navegador).

## Observações

- Compras, pagamentos e preços dos livros online são simulados.
- As contas existem apenas no aparelho; não há servidor.
- Marcas e títulos aparecem apenas para fins educacionais.

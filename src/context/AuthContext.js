import { createContext, useContext } from 'react';
import { usePersistedState } from '../hooks/usePersistedState';
import { KEYS } from '../services/storage';
import { isValidEmail } from '../utils/format';

const AuthContext = createContext(null);

// Cadastro e login simulados: as contas ficam salvas apenas no aparelho
export function AuthProvider({ children }) {
  const [users, setUsers, usersReady] = usePersistedState(KEYS.users, []);
  const [user, setUser, sessionReady] = usePersistedState(KEYS.session, null);

  function signUp({ name, email, password }) {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 3) return { ok: false, error: 'Informe seu nome completo.' };
    if (!isValidEmail(cleanEmail)) return { ok: false, error: 'Informe um e-mail válido.' };
    if (password.length < 6) return { ok: false, error: 'A senha precisa ter 6 caracteres ou mais.' };
    if (users.some((item) => item.email === cleanEmail)) {
      return { ok: false, error: 'Já existe uma conta com este e-mail.' };
    }

    setUsers([...users, { name: cleanName, email: cleanEmail, password }]);
    setUser({ name: cleanName, email: cleanEmail, guest: false });
    return { ok: true };
  }

  function signIn(email, password) {
    const cleanEmail = email.trim().toLowerCase();

    if (!isValidEmail(cleanEmail)) return { ok: false, error: 'Informe um e-mail válido.' };
    if (!password) return { ok: false, error: 'Informe sua senha.' };

    const found = users.find((item) => item.email === cleanEmail);
    if (!found) return { ok: false, error: 'Conta não encontrada. Crie uma conta para entrar.' };
    if (found.password !== password) return { ok: false, error: 'Senha incorreta.' };

    setUser({ name: found.name, email: found.email, guest: false });
    return { ok: true };
  }

  function signInGuest() {
    setUser({ name: 'Visitante', email: '', guest: true });
  }

  function signOut() {
    setUser(null);
  }

  const value = {
    user,
    ready: usersReady && sessionReady,
    signUp,
    signIn,
    signInGuest,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

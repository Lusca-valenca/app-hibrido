import { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { fetchAddressByCep } from '../services/viaCep';
import { colors } from '../theme';
import { formatCep, onlyDigits } from '../utils/format';
import { Input } from './Input';
import { PrimaryButton } from './PrimaryButton';

const EMPTY = { cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' };

// Formulário de endereço: ao digitar o CEP, a rua, o bairro e a cidade vêm da API ViaCEP
export function AddressForm({ onSubmit, submitLabel = 'SALVAR ENDEREÇO' }) {
  const [form, setForm] = useState(EMPTY);
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');
  const [formError, setFormError] = useState('');
  const lastRequest = useRef(0);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleCep(text) {
    const cep = formatCep(text);
    update('cep', cep);
    setCepError('');

    if (onlyDigits(cep).length !== 8) return;

    // Se o usuário digitar outro CEP antes da resposta, a resposta antiga é ignorada
    const request = lastRequest.current + 1;
    lastRequest.current = request;
    setLoadingCep(true);

    try {
      const address = await fetchAddressByCep(cep);
      if (lastRequest.current !== request) return;
      setForm((current) => ({
        ...current,
        logradouro: address.logradouro,
        bairro: address.bairro,
        cidade: address.cidade,
        uf: address.uf,
      }));
    } catch (error) {
      if (lastRequest.current === request) setCepError(error.message);
    } finally {
      if (lastRequest.current === request) setLoadingCep(false);
    }
  }

  function submit() {
    if (onlyDigits(form.cep).length !== 8) return setFormError('Informe um CEP com 8 números.');
    if (!form.logradouro.trim()) return setFormError('Informe a rua.');
    if (!form.numero.trim()) return setFormError('Informe o número.');
    if (!form.cidade.trim() || form.uf.trim().length !== 2) {
      return setFormError('Informe a cidade e a UF com 2 letras.');
    }

    setFormError('');
    onSubmit({
      cep: onlyDigits(form.cep),
      logradouro: form.logradouro.trim(),
      numero: form.numero.trim(),
      complemento: form.complemento.trim(),
      bairro: form.bairro.trim(),
      cidade: form.cidade.trim(),
      uf: form.uf.trim().toUpperCase(),
    });
    setForm(EMPTY);
  }

  return (
    <View style={s.form}>
      <Input
        label="CEP"
        placeholder="00000-000"
        keyboardType="number-pad"
        maxLength={9}
        value={form.cep}
        onChangeText={handleCep}
        error={cepError}
      />
      {loadingCep ? (
        <View style={s.loading}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={s.loadingText}>Buscando endereço pelo CEP...</Text>
        </View>
      ) : null}

      <Input
        label="Rua"
        placeholder="Rua, avenida..."
        value={form.logradouro}
        onChangeText={(text) => update('logradouro', text)}
      />

      <View style={s.line}>
        <Input
          style={s.small}
          label="Número"
          placeholder="123"
          keyboardType="number-pad"
          value={form.numero}
          onChangeText={(text) => update('numero', text)}
        />
        <Input
          style={s.large}
          label="Complemento"
          placeholder="Apto, bloco (opcional)"
          value={form.complemento}
          onChangeText={(text) => update('complemento', text)}
        />
      </View>

      <Input
        label="Bairro"
        placeholder="Bairro"
        value={form.bairro}
        onChangeText={(text) => update('bairro', text)}
      />

      <View style={s.line}>
        <Input
          style={s.large}
          label="Cidade"
          placeholder="Cidade"
          value={form.cidade}
          onChangeText={(text) => update('cidade', text)}
        />
        <Input
          style={s.small}
          label="UF"
          placeholder="SP"
          autoCapitalize="characters"
          maxLength={2}
          value={form.uf}
          onChangeText={(text) => update('uf', text)}
        />
      </View>

      {formError ? <Text style={s.error}>{formError}</Text> : null}
      <PrimaryButton title={submitLabel} onPress={submit} />
    </View>
  );
}

// Texto de uma linha com o endereço completo
export function addressLine(address) {
  const complemento = address.complemento ? `, ${address.complemento}` : '';
  const bairro = address.bairro ? ` - ${address.bairro}` : '';
  return `${address.logradouro}, ${address.numero}${complemento}${bairro}, ${address.cidade}/${address.uf}`;
}

const s = StyleSheet.create({
  form: { gap: 12 },
  line: { flexDirection: 'row', gap: 12 },
  small: { flex: 1 },
  large: { flex: 2 },
  loading: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loadingText: { color: colors.muted, fontSize: 12 },
  error: { color: colors.danger, fontSize: 13 },
});

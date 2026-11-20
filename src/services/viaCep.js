// Consumo da API pública ViaCEP (https://viacep.com.br)
import { fetchJson } from './http';
import { onlyDigits } from '../utils/format';

// Recebe um CEP e devolve o endereço correspondente
export async function fetchAddressByCep(cep) {
  const digits = onlyDigits(cep);
  if (digits.length !== 8) {
    throw new Error('Informe um CEP com 8 números.');
  }

  const data = await fetchJson(`https://viacep.com.br/ws/${digits}/json/`);

  // O ViaCEP responde { erro: true } quando o CEP não existe
  if (data.erro) {
    throw new Error('CEP não encontrado.');
  }

  return {
    cep: digits,
    logradouro: data.logradouro || '',
    bairro: data.bairro || '',
    cidade: data.localidade || '',
    uf: data.uf || '',
  };
}

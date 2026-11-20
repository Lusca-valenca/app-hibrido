// Requisição GET que devolve JSON, com tempo limite e mensagens de erro amigáveis
export async function fetchJson(url, timeout = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`O servidor respondeu com erro (${response.status}).`);
    }
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('A conexão demorou demais. Tente novamente.');
    }
    if (error instanceof TypeError) {
      throw new Error('Sem conexão. Verifique sua internet e tente novamente.');
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

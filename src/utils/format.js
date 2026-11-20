// Funções de formatação usadas em várias telas

// 79.9 -> "R$ 79,90"
export function money(value) {
  const [inteiro, centavos] = Number(value || 0).toFixed(2).split('.');
  const comMilhar = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${comMilhar},${centavos}`;
}

// "01001-000" -> "01001000"
export function onlyDigits(text) {
  return String(text || '').replace(/\D/g, '');
}

// "01001000" -> "01001-000"
export function formatCep(text) {
  const digits = onlyDigits(text).slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

// Data ISO -> "16/11/2026 às 19:30"
export function formatDate(iso) {
  const date = new Date(iso);
  const two = (n) => String(n).padStart(2, '0');
  const dia = `${two(date.getDate())}/${two(date.getMonth() + 1)}/${date.getFullYear()}`;
  return `${dia} às ${two(date.getHours())}:${two(date.getMinutes())}`;
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

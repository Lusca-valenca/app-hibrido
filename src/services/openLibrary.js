// Consumo da API pública Open Library (https://openlibrary.org/developers/api)
import { fetchJson } from './http';

const BASE_URL = 'https://openlibrary.org';
const COVERS_URL = 'https://covers.openlibrary.org/b/id';
const FIELDS = 'key,title,author_name,cover_i,first_publish_year,ratings_average';
const COVER_COLORS = ['#14263D', '#0B3854', '#6D3C20', '#3C4454', '#8D315C', '#176B5B', '#5B4DB2'];

// Guarda em memória os livros já recebidos, para abrir os detalhes sem nova busca
const cache = new Map();

// Número fixo calculado a partir do id (usado no preço simulado e na cor da capa)
function hashOf(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) % 100000;
  }
  return hash;
}

function coverUrl(coverId) {
  return coverId ? `${COVERS_URL}/${coverId}-M.jpg?default=false` : null;
}

// A API não informa preço: a loja é simulada, então o preço é gerado a partir do id
function simulatedPrice(id) {
  return 24.9 + (hashOf(id) % 70);
}

function toBook({ id, title, author, coverId, year, rating, description }) {
  const previous = cache.get(id);
  const book = {
    id,
    title: title || 'Título não informado',
    author: author || 'Autor não informado',
    price: simulatedPrice(id),
    rating: rating ? Number(rating.toFixed(1)) : null,
    year: year || null,
    category: 'online',
    color: COVER_COLORS[hashOf(id) % COVER_COLORS.length],
    tag: (title || 'LIVRO').toUpperCase().slice(0, 28),
    coverUrl: coverUrl(coverId),
    description: description || previous?.description || '',
    source: 'api',
  };
  cache.set(id, book);
  return book;
}

// Busca livros por título ou autor
export async function searchBooks(query, limit = 20) {
  const url =
    `${BASE_URL}/search.json?q=${encodeURIComponent(query.trim())}` +
    `&limit=${limit}&fields=${FIELDS}`;
  const data = await fetchJson(url);

  return (data.docs || []).map((doc) =>
    toBook({
      id: String(doc.key || '').replace('/works/', ''),
      title: doc.title,
      author: doc.author_name?.[0],
      coverId: doc.cover_i,
      year: doc.first_publish_year,
      rating: doc.ratings_average,
    })
  );
}

// A descrição pode vir como texto ou como objeto { value }
function readDescription(description) {
  const text = typeof description === 'string' ? description : description?.value;
  return text ? text.split('\n----------')[0].trim() : '';
}

// Detalhes de uma obra (usado na tela de detalhes para carregar a sinopse)
export async function getBookDetails(id) {
  const cached = cache.get(id);
  if (cached?.description) return cached;

  const work = await fetchJson(`${BASE_URL}/works/${id}.json`);
  let author = cached?.author;

  if (!author) {
    const authorKey = work.authors?.[0]?.author?.key;
    if (authorKey) {
      try {
        const authorData = await fetchJson(`${BASE_URL}${authorKey}.json`);
        author = authorData.name;
      } catch {
        author = undefined;
      }
    }
  }

  return toBook({
    id,
    title: work.title,
    author,
    coverId: work.covers?.find((cover) => cover > 0),
    year: cached?.year,
    rating: cached?.rating,
    description: readDescription(work.description) || 'Sinopse não disponível para este título.',
  });
}

export function getCachedBook(id) {
  return cache.get(id) || null;
}

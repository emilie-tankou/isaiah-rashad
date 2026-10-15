import { API_URL } from './config.js';

// ===== Jeton JWT =====
// sessionStorage : le jeton disparaît quand l'onglet est fermé.
const TOKEN_KEY = 'jwt';
export const getToken = () => sessionStorage.getItem(TOKEN_KEY);
export const setToken = (token) => sessionStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => sessionStorage.removeItem(TOKEN_KEY);

// ===== Sécurité : tout texte venant de l'API est échappé avant d'être mis dans du HTML =====
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Accepte uniquement les liens http(s) (bloque par exemple "javascript:...")
export function safeUrl(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : null;
  } catch {
    return null;
  }
}

// "2026-12-01T00:00:00+00:00" -> "01/12/2026"
export function formatDate(iso) {
  const [year, month, day] = String(iso).slice(0, 10).split('-');
  return `${day}/${month}/${year}`;
}

// ===== Appel à l'API =====
// auth: true  -> ajoute le jeton JWT dans l'en-tête Authorization
export async function apiFetch(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) headers['Authorization'] = `Bearer ${getToken()}`;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Jeton expiré ou invalide : on repart sur la page de connexion
  if (response.status === 401 && auth) {
    clearToken();
    window.location.href = 'login.html';
    throw new Error('Session expirée');
  }

  if (!response.ok) {
    const error = new Error(`Erreur ${response.status}`);
    error.status = response.status;
    error.data = await response.json().catch(() => null);
    throw error;
  }

  return response.status === 204 ? null : response.json();
}
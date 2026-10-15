// ===== CONNEXION ADMIN : l'API Symfony renvoie un jeton JWT =====
import { apiFetch, setToken } from './api.js';

const errorEl = document.getElementById('login-error');

document.getElementById('login-btn').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  errorEl.textContent = '';

  try {
    const { token } = await apiFetch('/login_check', {
      method: 'POST',
      body: { email, password },
    });
    setToken(token);
    window.location.href = 'admin.html';
  } catch (error) {
    errorEl.textContent = error.status === 401
      ? 'Email ou mot de passe incorrect'
      : 'Serveur indisponible, réessaie dans un instant';
  }
});
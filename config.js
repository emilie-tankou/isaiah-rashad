// Adresse de l'API Symfony.
// Sur ton PC (localhost / 127.0.0.1) : l'API locale. En ligne : l'API hébergée sur Render.
const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);

export const API_URL = isLocal
  ? 'http://127.0.0.1:8000/api'
  : 'https://isaiah-rashad-api.onrender.com/api';
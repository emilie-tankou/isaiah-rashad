// ===== PAGE PUBLIQUE : AFFICHER LES DATES (API Symfony) =====
import { apiFetch, escapeHtml, formatDate, safeUrl } from './api.js';

const datesContainer = document.getElementById('dates-container');

async function loadDates() {
  datesContainer.innerHTML = '<p class="vide">Chargement des dates… (le serveur gratuit peut mettre jusqu\'à une minute à se réveiller)</p>';
  try {
    const dates = await apiFetch('/dates');

    if (dates.length === 0) {
      datesContainer.innerHTML = '<p class="vide">Aucune date annoncée pour le moment.</p>';
      return;
    }

    datesContainer.innerHTML = dates.map((d) => {
      const lien = d.lienBilletterie ? safeUrl(d.lienBilletterie) : null;
      return `
        <div class="date-item">
          <span class="date-date">${escapeHtml(formatDate(d.date))}</span>
          <span class="date-ville">${escapeHtml(d.ville)}</span>
          <span class="date-salle">${escapeHtml(d.salle)}</span>
          ${lien ? `<a href="${escapeHtml(lien)}" target="_blank" rel="noopener noreferrer" class="btn">Billetterie</a>` : ''}
        </div>
      `;
    }).join('');
  } catch {
    datesContainer.innerHTML = '<p class="vide">Impossible de charger les dates pour le moment.</p>';
  }
}

loadDates();
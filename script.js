// ===== PAGE PUBLIQUE : AFFICHER LES DATES (API Symfony) =====
import { apiFetch, escapeHtml, formatDate, safeUrl } from './api.js';

const datesContainer = document.getElementById('dates-container');
const seeMoreBtn = document.getElementById('voir-plus-btn');
const MAX_VISIBLE = 6; // nombre de dates affichées avant « Voir plus »

let expanded = false;

function renderDate(d, index) {
  const lien = d.lienBilletterie ? safeUrl(d.lienBilletterie) : null;
  const hidden = index >= MAX_VISIBLE ? ' date-cachee' : '';
  return `
    <div class="date-item${hidden}">
      <span class="date-date">${escapeHtml(formatDate(d.date))}</span>
      <span class="date-ville">${escapeHtml(d.ville)}</span>
      <span class="date-salle">${escapeHtml(d.salle)}</span>
      ${lien ? `<a href="${escapeHtml(lien)}" target="_blank" rel="noopener noreferrer" class="btn">Billetterie</a>` : ''}
    </div>
  `;
}

async function loadDates() {
  seeMoreBtn.style.display = 'none';
  datesContainer.innerHTML = '<p class="vide">Chargement des dates… (le serveur gratuit peut mettre jusqu\'à une minute à se réveiller)</p>';

  try {
    const dates = await apiFetch('/dates');

    if (dates.length === 0) {
      datesContainer.innerHTML = '<p class="vide">Aucune date annoncée pour le moment.</p>';
      return;
    }

    datesContainer.innerHTML = dates.map(renderDate).join('');

    // Le bouton n'apparaît que s'il y a des dates à révéler
    if (dates.length > MAX_VISIBLE) {
      seeMoreBtn.style.display = '';
    }
  } catch {
    datesContainer.innerHTML = '<p class="vide">Impossible de charger les dates pour le moment.</p>';
  }
}

seeMoreBtn.addEventListener('click', () => {
  expanded = !expanded;
  datesContainer.querySelectorAll('.date-item').forEach((item, index) => {
    item.classList.toggle('date-cachee', !expanded && index >= MAX_VISIBLE);
  });
  seeMoreBtn.textContent = expanded ? '− Voir moins de dates' : '+ Voir plus de dates';
});

loadDates();


// ===== EFFET DE PARALLAXE : la pochette suit la souris sur les côtés =====
(() => {
  const section = document.getElementById('album');
  const vinyl = document.getElementById('album-vinyl');
  const text = document.querySelector('.out-now');
  if (!section || !vinyl) return;

  // Pas d'effet sur écran tactile, ni si la personne a demandé de réduire les animations
  if (window.matchMedia('(hover: none)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const COVER_SHIFT = 40; // déplacement maximum de la pochette, en pixels
  const TEXT_SHIFT = 25;  // « OUT NOW » bouge en sens inverse : cela crée de la profondeur

  if (text) text.style.transition = 'transform 0.1s ease-out';

  function move(ratio) {
    vinyl.style.transform = `translateX(${(ratio * COVER_SHIFT).toFixed(1)}px)`;
    if (text) text.style.transform = `translateX(${(-ratio * TEXT_SHIFT).toFixed(1)}px)`;
  }

  section.addEventListener('mousemove', (event) => {
    const rect = section.getBoundingClientRect();
    // -1 : souris tout à gauche de la section, 0 : au centre, +1 : tout à droite
    const ratio = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    move(Math.max(-1, Math.min(1, ratio)));
  });

  section.addEventListener('mouseleave', () => move(0));
})();

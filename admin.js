// ===== PORTAIL ADMIN : CRUD des dates via l'API Symfony (protégée par JWT) =====
import { apiFetch, getToken, clearToken, escapeHtml, formatDate, safeUrl } from './api.js';

// Pas de jeton = pas d'accès à cette page
if (!getToken()) {
  window.location.href = 'login.html';
} else {
  init();
}

function init() {
  const container = document.getElementById('dates-admin');
  const formError = document.getElementById('form-error');
  const fields = {
    ville: document.getElementById('ville'),
    salle: document.getElementById('salle'),
    date: document.getElementById('date'),
    lien: document.getElementById('lien'),
  };

  let editId = null;
  let dates = [];

  document.getElementById('logout-btn').addEventListener('click', () => {
    clearToken();
    window.location.href = 'login.html';
  });

  // ----- Affichage -----
  function render() {
    if (dates.length === 0) {
      container.innerHTML = '<p class="vide">Aucune date enregistrée</p>';
      return;
    }

    container.innerHTML = dates.map((d) => {
      const lien = d.lienBilletterie ? safeUrl(d.lienBilletterie) : null;
      return `
        <div class="date-item">
          <div class="date-info">
            <span class="date-date">${escapeHtml(formatDate(d.date))}</span>
            <span class="date-ville">${escapeHtml(d.ville)}</span>
            <span class="date-salle">${escapeHtml(d.salle)}</span>
            ${lien ? `<a href="${escapeHtml(lien)}" target="_blank" rel="noopener noreferrer">Billetterie</a>` : ''}
          </div>
          <div class="date-actions">
            <button class="btn-edit" data-action="edit" data-id="${d.id}">Modifier</button>
            <button class="btn-delete" data-action="delete" data-id="${d.id}">Supprimer</button>
          </div>
        </div>
      `;
    }).join('');
  }

  async function loadDates() {
    container.innerHTML = '<p class="vide">Chargement…</p>';
    try {
      dates = await apiFetch('/dates');
      render();
    } catch {
      container.innerHTML = '<p class="vide">Impossible de charger les dates.</p>';
    }
  }

  // ----- Formulaire -----
  function resetForm() {
    editId = null;
    Object.values(fields).forEach((input) => { input.value = ''; });
    formError.textContent = '';
    document.getElementById('form-titre').textContent = 'Ajouter une date';
    document.getElementById('submit-btn').textContent = 'Ajouter';
    document.getElementById('cancel-btn').style.display = 'none';
  }

  function startEdit(id) {
    const d = dates.find((item) => item.id === id);
    if (!d) return;
    editId = id;
    fields.ville.value = d.ville;
    fields.salle.value = d.salle ?? '';
    fields.date.value = d.date.slice(0, 10);
    fields.lien.value = d.lienBilletterie ?? '';
    formError.textContent = '';
    document.getElementById('form-titre').textContent = 'Modifier une date';
    document.getElementById('submit-btn').textContent = 'Modifier';
    document.getElementById('cancel-btn').style.display = 'inline-block';
  }

  document.getElementById('submit-btn').addEventListener('click', async () => {
    const ville = fields.ville.value.trim();
    const salle = fields.salle.value.trim();
    const date = fields.date.value;
    const lien = fields.lien.value.trim();

    formError.textContent = '';
    if (!ville || !salle || !date) {
      formError.textContent = 'Ville, salle et date sont obligatoires.';
      return;
    }

    const body = { ville, salle, date, lienBilletterie: lien || null };

    try {
      if (editId) {
        await apiFetch(`/dates/${editId}`, { method: 'PUT', body, auth: true });
      } else {
        await apiFetch('/dates', { method: 'POST', body, auth: true });
      }
      resetForm();
      await loadDates();
    } catch (error) {
      formError.textContent = error.status === 422
        ? 'Données refusées par le serveur (vérifie le lien : il doit commencer par https://).'
        : "Impossible d'enregistrer, réessaie dans un instant.";
    }
  });

  document.getElementById('cancel-btn').addEventListener('click', resetForm);

  // ----- Boutons Modifier / Supprimer (un seul écouteur pour toute la liste) -----
  container.addEventListener('click', async (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const id = Number(button.dataset.id);

    if (button.dataset.action === 'edit') {
      startEdit(id);
    } else if (button.dataset.action === 'delete' && confirm('Supprimer cette date ?')) {
      try {
        await apiFetch(`/dates/${id}`, { method: 'DELETE', auth: true });
        await loadDates();
      } catch {
        formError.textContent = 'Suppression impossible, réessaie dans un instant.';
      }
    }
  });

  loadDates();
}
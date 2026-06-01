import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCs3rUAjjnoonwwICE99RIwqkKqwC2Thbk",
  authDomain: "isaiah-rashad.firebaseapp.com",
  projectId: "isaiah-rashad",
  storageBucket: "isaiah-rashad.firebasestorage.app",
  messagingSenderId: "47081499684",
  appId: "1:47081499684:web:5e1047c76ca832ad52fcb1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'login.html';
  }
});

document.getElementById('logout-btn').addEventListener('click', () => {
  signOut(auth).then(() => {
    window.location.href = 'login.html';
  });
});

let editId = null;

const q = query(collection(db, "dates"), orderBy("date"));
onSnapshot(q, (snapshot) => {
  const container = document.getElementById('dates-admin');
  container.innerHTML = "";

  if (snapshot.empty) {
    container.innerHTML = '<p class="vide">Aucune date enregistrée</p>';
    return;
  }

  snapshot.docs.forEach((docSnap) => {
    const d = docSnap.data();
    const id = docSnap.id;
    container.innerHTML += `
      <div class="date-item">
        <div class="date-info">
          <span class="date-date">${d.date}</span>
          <span class="date-ville">${d.ville}</span>
          <span class="date-salle">${d.salle}</span>
          ${d.lien ? `<a href="${d.lien}" target="_blank">Billetterie</a>` : ""}
        </div>
        <div class="date-actions">
          <button class="btn-edit" onclick="handleEdit('${id}', '${d.ville}', '${d.salle}', '${d.date}', '${d.lien || ''}')">Modifier</button>
          <button class="btn-delete" onclick="handleDelete('${id}')">Supprimer</button>
        </div>
      </div>
    `;
  });
});

document.getElementById('submit-btn').addEventListener('click', async () => {
  const ville = document.getElementById('ville').value;
  const salle = document.getElementById('salle').value;
  const date = document.getElementById('date').value;
  const lien = document.getElementById('lien').value;

  if (!ville || !salle || !date) return;

  if (editId) {
    await updateDoc(doc(db, "dates", editId), { ville, salle, date, lien });
    editId = null;
    document.getElementById('form-titre').textContent = "Ajouter une date";
    document.getElementById('submit-btn').textContent = "Ajouter";
    document.getElementById('cancel-btn').style.display = "none";
  } else {
    await addDoc(collection(db, "dates"), { ville, salle, date, lien });
  }

  document.getElementById('ville').value = "";
  document.getElementById('salle').value = "";
  document.getElementById('date').value = "";
  document.getElementById('lien').value = "";
});

document.getElementById('cancel-btn').addEventListener('click', () => {
  editId = null;
  document.getElementById('form-titre').textContent = "Ajouter une date";
  document.getElementById('submit-btn').textContent = "Ajouter";
  document.getElementById('cancel-btn').style.display = "none";
  document.getElementById('ville').value = "";
  document.getElementById('salle').value = "";
  document.getElementById('date').value = "";
  document.getElementById('lien').value = "";
});

window.handleEdit = (id, ville, salle, date, lien) => {
  editId = id;
  document.getElementById('ville').value = ville;
  document.getElementById('salle').value = salle;
  document.getElementById('date').value = date;
  document.getElementById('lien').value = lien;
  document.getElementById('form-titre').textContent = "Modifier une date";
  document.getElementById('submit-btn').textContent = "Modifier";
  document.getElementById('cancel-btn').style.display = "inline-block";
};

window.handleDelete = async (id) => {
  if (confirm("Supprimer cette date ?")) {
    await deleteDoc(doc(db, "dates", id));
  }
};
// ===== CHARGER LES DATES DEPUIS FIRESTORE =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCs3rUAjjnoonwwICE99RIwqkKqwC2Thbk",
  authDomain: "isaiah-rashad.firebaseapp.com",
  projectId: "isaiah-rashad",
  storageBucket: "isaiah-rashad.firebasestorage.app",
  messagingSenderId: "47081499684",
  appId: "1:47081499684:web:5e1047c76ca832ad52fcb1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const datesContainer = document.getElementById('dates-container');

const q = query(collection(db, "dates"), orderBy("date"));
onSnapshot(q, (snapshot) => {
  datesContainer.innerHTML = "";
  snapshot.docs.forEach((doc) => {
    const d = doc.data();
    datesContainer.innerHTML += `
      <div class="date-item">
        <span class="date-date">${d.date}</span>
        <span class="date-ville">${d.ville}</span>
        <span class="date-salle">${d.salle}</span>
        ${d.lien ? `<a href="${d.lien}" target="_blank" class="btn">Billetterie</a>` : ""}
      </div>
    `;
  });
});
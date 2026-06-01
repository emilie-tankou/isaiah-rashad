import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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

document.getElementById('login-btn').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = 'admin.html';
    })
    .catch(() => {
      document.getElementById('login-error').textContent = 'Email ou mot de passe incorrect';
    });
});
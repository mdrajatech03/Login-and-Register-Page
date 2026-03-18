import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMwFJfbkdFjxWzNhMccXs9FbhqntSKdRM",
  authDomain: "portfolio-auth-19a5e.firebaseapp.com",
  projectId: "portfolio-auth-19a5e",
  storageBucket: "portfolio-auth-19a5e.firebasestorage.app",
  messagingSenderId: "211741915178",
  appId: "1:211741915178:web:b96f48f37ef2477b83ab53"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- UI Controls ---
const wrapper = document.querySelector('.wrapper');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');

if (btnPopup) btnPopup.addEventListener('click', () => wrapper.classList.add('active-popup'));
if (iconClose) iconClose.addEventListener('click', () => wrapper.classList.remove('active-popup'));
if (registerLink) registerLink.addEventListener('click', () => wrapper.classList.add('active'));
if (loginLink) loginLink.addEventListener('click', () => wrapper.classList.remove('active'));

// --- Registration ---
const regForm = document.getElementById('registerForm');
if (regForm) {
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPass').value;
        try {
            const res = await createUserWithEmailAndPassword(auth, email, pass);
            await setDoc(doc(db, "users", res.user.uid), { username: name, email: email, profilePic: "" });
            Swal.fire('Success', 'Account Created!', 'success');
            wrapper.classList.remove('active');
        } catch (err) { Swal.fire('Error', err.message, 'error'); }
    });
}

// --- Login ---
const logForm = document.getElementById('loginForm');
if (logForm) {
    logForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('logEmail').value;
        const pass = document.getElementById('logPass').value;
        signInWithEmailAndPassword(auth, email, pass)
            .then(() => { window.location.href = "portfolio.html"; })
            .catch(() => Swal.fire('Error', 'Invalid Email/Password', 'error'));
    });
}

// --- Auth State & Profile ---
onAuthStateChanged(auth, async (user) => {
    const isPortfolio = window.location.pathname.includes("portfolio.html");
    if (user && isPortfolio) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const data = userDoc.data();
            document.getElementById('welcomeMessage').innerText = `Welcome, ${data.username}!`;
            document.getElementById('userEmailDisplay').innerText = data.email;
            const img = document.getElementById('userDP');
            img.src = data.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
            img.onerror = () => { img.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; };
        }
        
        document.getElementById('btnUpdatePhoto').onclick = async () => {
            const url = document.getElementById('photoURLInput').value.trim();
            if (url) {
                await updateDoc(userDocRef, { profilePic: url });
                Swal.fire('Updated', 'Photo Saved!', 'success').then(() => location.reload());
            }
        };
    } else if (!user && isPortfolio) {
        window.location.href = "index.html";
    }
});

// Logout
const btnLogout = document.getElementById('btnLogout');
if (btnLogout) btnLogout.onclick = () => signOut(auth).then(() => window.location.href = "index.html");

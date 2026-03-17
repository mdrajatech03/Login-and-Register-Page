import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase Configuration
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

// Global Toast Function
const showToast = (icon, title) => {
    Swal.mixin({
        toast: true, position: 'top-end', showConfirmButton: false, timer: 2500, timerProgressBar: true
    }).fire({ icon, title });
};

// --- AUTH STATE MONITOR ---
onAuthStateChanged(auth, async (user) => {
    const isPortfolioPage = window.location.pathname.includes("portfolio.html");

    if (user) {
        if (isPortfolioPage) {
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
                const data = userDoc.data();
                document.getElementById('welcomeMessage').innerText = `Welcome, ${data.username}!`;
                document.getElementById('userEmailDisplay').innerText = data.email;
                if (data.profilePic) document.getElementById('userDP').src = data.profilePic;
            }

            // Photo Update Logic
            document.getElementById('btnUpdatePhoto').onclick = async () => {
                const url = document.getElementById('photoURLInput').value;
                if (url) {
                    await updateDoc(userDocRef, { profilePic: url });
                    document.getElementById('userDP').src = url;
                    showToast('success', 'Profile Updated!');
                }
            };
        }
    } else if (isPortfolioPage) {
        window.location.href = "index.html";
    }
});

// --- LOGIN LOGIC ---
const loginForm = document.querySelector('.form-box.login form');
if (loginForm) {
    loginForm.onsubmit = (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value;
        const password = document.getElementById('logPass').value;
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                showToast('success', 'Login Successful!');
                setTimeout(() => { window.location.href = "portfolio.html"; }, 1500);
            })
            .catch(() => showToast('error', 'Login Failed!'));
    };
}

// --- LOGOUT LOGIC ---
const btnLogout = document.getElementById('btnLogout');
if (btnLogout) {
    btnLogout.onclick = () => {
        signOut(auth).then(() => {
            showToast('info', 'Logged Out!');
            setTimeout(() => { window.location.href = "index.html"; }, 1000);
        });
    };
}

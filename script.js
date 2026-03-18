import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// Selectors
const wrapper = document.getElementById('authWrapper');
const loginSide = document.getElementById('loginSide');
const registerSide = document.getElementById('registerSide');

// UI Controls
document.getElementById('openAuth').onclick = () => { wrapper.style.display = 'block'; showLogin(); };
document.getElementById('closeAuth').onclick = () => wrapper.style.display = 'none';

function showLogin() { loginSide.style.display = 'block'; registerSide.style.display = 'none'; }
function showRegister() { loginSide.style.display = 'none'; registerSide.style.display = 'block'; }

document.getElementById('showReg').onclick = (e) => { e.preventDefault(); showRegister(); };
document.getElementById('showLog').onclick = (e) => { e.preventDefault(); showLogin(); };

// Firebase Register
document.getElementById('registerForm').onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const pass = document.getElementById('regPass').value;

    try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        await setDoc(doc(db, "users", res.user.uid), { username: name, email: email });
        
        Swal.fire({ icon: 'success', title: 'Success!', text: 'Account Created. Login Now.', timer: 2000, showConfirmButton: false });
        
        document.getElementById('registerForm').reset();
        setTimeout(showLogin, 1500); // 100% switch back to login
    } catch (err) { Swal.fire('Error', err.message, 'error'); }
};

// Firebase Login
document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    try {
        await signInWithEmailAndPassword(auth, document.getElementById('logEmail').value, document.getElementById('logPass').value);
        Swal.fire('Success', 'Redirecting...', 'success');
        setTimeout(() => { window.location.href = "portfolio.html"; }, 1500);
    } catch (err) { Swal.fire('Error', 'Wrong Credentials!', 'error'); }
};

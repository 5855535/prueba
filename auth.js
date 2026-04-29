// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyC1G1VWM_0sIaLQhGtrvmG2xPfJpFHzU70",
    authDomain: "autolux-8aa0d.firebaseapp.com",
    projectId: "autolux-8aa0d",
    storageBucket: "autolux-8aa0d.firebasestorage.app",
    messagingSenderId: "902279691304",
    appId: "1:902279691304:web:2afd537763ce1117a3891d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// === INICIAR SESIÓN ===
window.iniciarSesion = async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');

    errorMsg.classList.add('hidden');

    if (!email || !password) {
        errorMsg.textContent = "Por favor ingresa correo y contraseña";
        errorMsg.classList.remove('hidden');
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "index.html";
    } catch (error) {
        console.error("Error al iniciar sesión:", error.code);
        let mensaje = "Credenciales incorrectas";

        if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
            mensaje = "Correo o contraseña incorrectos";
        } else if (error.code === "auth/invalid-email") {
            mensaje = "El formato del correo no es válido";
        } else if (error.code === "auth/too-many-requests") {
            mensaje = "Demasiados intentos. Intenta más tarde";
        }

        errorMsg.textContent = mensaje;
        errorMsg.classList.remove('hidden');
    }
};

// === REGISTRARSE ===
window.registrarse = async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');

    errorMsg.classList.add('hidden');

    if (!email || !password) {
        errorMsg.textContent = "Por favor completa todos los campos";
        errorMsg.classList.remove('hidden');
        return;
    }

    if (password.length < 6) {
        errorMsg.textContent = "La contraseña debe tener al menos 6 caracteres";
        errorMsg.classList.remove('hidden');
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("¡Cuenta creada correctamente!\nAhora puedes iniciar sesión.");
        window.location.href = "index.html";
    } catch (error) {
        console.error("Error al registrar:", error.code);
        let mensaje = "Error al crear la cuenta";

        if (error.code === "auth/email-already-in-use") {
            mensaje = "Este correo electrónico ya está registrado";
        } else if (error.code === "auth/invalid-email") {
            mensaje = "El correo electrónico no es válido";
        } else if (error.code === "auth/weak-password") {
            mensaje = "La contraseña es demasiado débil";
        }

        errorMsg.textContent = mensaje;
        errorMsg.classList.remove('hidden');
    }
};

// Redirigir automáticamente si ya está logueado
onAuthStateChanged(auth, (user) => {
    if (user && window.location.pathname.includes("login.html")) {
        window.location.href = "index.html";
    }
});

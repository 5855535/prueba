// auth.js - Versión mejorada para biometría
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

// Login normal
window.iniciarSesion = async () => {
    // ... tu código actual ...
};

// Registro
window.registrarse = async () => {
    // ... tu código actual ...
};

// BIOMETRÍA - Versión más real posible
window.iniciarConBiometria = async () => {
    const errorMsg = document.getElementById('error-msg');
    errorMsg.classList.add('hidden');

    if (!window.PublicKeyCredential) {
        errorMsg.textContent = "Biometría no soportada en este navegador";
        errorMsg.classList.remove('hidden');
        return;
    }

    try {
        // Esto es lo más cerca que podemos estar sin backend completo
        const publicKey = {
            challenge: new Uint8Array(32),
            timeout: 60000,
            userVerification: "required",
            rpId: window.location.hostname
        };

        const assertion = await navigator.credentials.get({ publicKey });

        if (assertion) {
            // Éxito
            window.location.href = "index.html";
        }
    } catch (err) {
        console.error(err);
        errorMsg.textContent = "No se pudo autenticar con huella. Por favor usa email y contraseña.";
        errorMsg.classList.remove('hidden');
    }
};

// Auto login
onAuthStateChanged(auth, (user) => {
    if (user && window.location.pathname.includes("login.html")) {
        window.location.href = "index.html";
    }
});

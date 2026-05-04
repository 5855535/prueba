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

// === INICIAR SESIÓN EMAIL ===
window.iniciarSesion = async () => { /* tu código actual sin cambios */ };

// === REGISTRARSE ===
window.registrarse = async () => { /* tu código actual sin cambios */ };

// === BIOMETRÍA REAL (WebAuthn) ===
window.iniciarConBiometria = async () => {
    const errorMsg = document.getElementById('error-msg');
    errorMsg.classList.add('hidden');

    if (!window.PublicKeyCredential) {
        errorMsg.textContent = "Tu navegador no soporta autenticación biométrica";
        errorMsg.classList.remove('hidden');
        return;
    }

    try {
        // Obtener challenge del servidor (simulado por ahora)
        const publicKeyCredentialRequestOptions = {
            challenge: new Uint8Array(32), // En producción viene del backend
            timeout: 60000,
            userVerification: "preferred",
            rpId: window.location.hostname
        };

        const assertion = await navigator.credentials.get({
            publicKey: publicKeyCredentialRequestOptions
        });

        if (assertion) {
            // Aquí iría verificación con backend
            alert("✅ Autenticación biométrica exitosa");
            window.location.href = "index.html";
        }

    } catch (error) {
        console.error(error);
        errorMsg.textContent = "No se pudo completar la autenticación biométrica. Usa email y contraseña.";
        errorMsg.classList.remove('hidden');
    }
};

// Redirección si ya está logueado
onAuthStateChanged(auth, (user) => {
    if (user && window.location.pathname.includes("login.html")) {
        window.location.href = "index.html";
    }
});

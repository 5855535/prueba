import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC1G1VWM_0sIaLQhGtrvmG2xPfJpFHzU70",
    authDomain: "autolux-8aa0d.firebaseapp.com",
    projectId: "autolux-8aa0d",
    storageBucket: "autolux-8aa0d.firebasestorage.app",
    messagingSenderId: "902279691304",
    appId: "1:902279691304:web:2afd537763ce1117a3891d",
    measurementId: "G-ZMM7HY0798"
};

// Inicialización
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let autosParaComparar = [];

// --- CARGA DE DATOS ---
async function cargarVehiculos() {
    const contenedor = document.getElementById("contenedor-autos");
    const loader = document.getElementById('loader');
    const appContent = document.getElementById('app-content');

    if(!contenedor) return;

    try {
        const querySnapshot = await getDocs(collection(db, "vehiculos"));
        contenedor.innerHTML = '';

        if (querySnapshot.empty) {
            contenedor.innerHTML = '<p class="col-span-full text-center text-gray-500 uppercase tracking-widest py-10 italic">No hay modelos disponibles.</p>';
        } else {
            querySnapshot.forEach((doc) => {
                const d = doc.data();
                contenedor.innerHTML += `
                    <div class="card-lujo rounded-lg overflow-hidden group" data-aos="fade-up">
                        <div class="h-56 overflow-hidden">
                            <img src="${d.url_imagen}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                        </div>
                        <div class="p-8 text-center">
                            <h3 class="text-xl font-bold mb-4 uppercase italic tracking-wider">${d.nombre}</h3>
                            <button onclick="verDetalles('${d.nombre}', '${d.url_imagen}', '${d['0-100']}', '${d['top speed']}', '${d['precio desde']}')" 
                                    class="w-full border border-white/20 py-3 text-[10px] tracking-[3px] hover:bg-[#ff2800] hover:border-[#ff2800] transition mb-3 uppercase">
                                Explorar
                            </button>
                            <button onclick="añadirAComparar('${d.nombre}', '${d.url_imagen}', '${d['0-100']}', '${d['top speed']}', '${d['precio desde']}')" 
                                    class="text-[9px] tracking-[2px] text-gray-500 hover:text-white transition uppercase">
                                + Comparar
                            </button>
                        </div>
                    </div>
                `;
            });
        }
        
        // Inicializar AOS tras cargar elementos
        if (typeof AOS !== 'undefined') AOS.init();

    } catch (error) {
        console.error("Error al obtener datos:", error);
    } finally {
        // OCULTAR LOADER: Esto asegura que la página se muestre incluso si hay error
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                if (appContent) {
                    appContent.classList.remove('opacity-0');
                    appContent.classList.add('opacity-100');
                }
                document.body.style.overflow = 'auto';
            }, 500);
        }
    }
}

// Iniciar carga
document.addEventListener('DOMContentLoaded', cargarVehiculos);

// --- LÓGICA DE COMPARACIÓN ---
window.añadirAComparar = (nombre, img, acc, vel, precio) => {
    if (autosParaComparar.find(a => a.nombre === nombre)) return;
    if (autosParaComparar.length < 2) {
        autosParaComparar.push({ nombre, img, acc, vel, precio });
        actualizarBarraComparar();
    } else {
        alert("Solo puedes comparar 2 modelos.");
    }
};

function actualizarBarraComparar() {
    const barra = document.getElementById("barra-comparar");
    const slots = document.getElementById("slots-comparar");
    if (autosParaComparar.length > 0) {
        barra.classList.remove("translate-y-full");
        slots.innerHTML = autosParaComparar.map(a => `
            <div class="flex items-center gap-2 bg-white/5 p-2 rounded border border-white/10">
                <img src="${a.img}" class="w-10 h-10 object-cover rounded">
                <span class="text-[9px] font-bold uppercase hidden md:inline">${a.nombre}</span>
            </div>
        `).join('');
    } else {
        barra.classList.add("translate-y-full");
    }
}

window.mostrarTablaComparativa = () => {
    if (autosParaComparar.length < 2) return alert("Selecciona otro modelo para comparar.");
    const [a1, a2] = autosParaComparar;
    document.getElementById("tabla-contenido").innerHTML = `
        <div class="flex flex-col justify-center space-y-10 text-left text-[10px] text-gray-500 tracking-widest pt-24">
            <div>MOTOR / MODELO</div>
            <div class="border-t border-white/5 pt-4">0-100 KM/H</div>
            <div class="border-t border-white/5 pt-4">V. MÁXIMA</div>
            <div class="border-t border-white/5 pt-4">INVERSIÓN</div>
        </div>
        <div class="space-y-10">
            <img src="${a1.img}" class="w-full h-32 object-cover rounded-lg">
            <div class="font-bold text-[#ff2800] uppercase text-xs">${a1.nombre}</div>
            <div class="font-bold border-t border-white/5 pt-4">${a1.acc}</div>
            <div class="font-bold border-t border-white/5 pt-4">${a1.vel}</div>
            <div class="font-bold border-t border-white/5 pt-4">${a1.precio}</div>
        </div>
        <div class="space-y-10">
            <img src="${a2.img}" class="w-full h-32 object-cover rounded-lg">
            <div class="font-bold text-[#ff2800] uppercase text-xs">${a2.nombre}</div>
            <div class="font-bold border-t border-white/5 pt-4">${a2.acc}</div>
            <div class="font-bold border-t border-white/5 pt-4">${a2.vel}</div>
            <div class="font-bold border-t border-white/5 pt-4">${a2.precio}</div>
        </div>
    `;
    document.getElementById("modal-tabla").classList.remove("hidden");
};

window.limpiarComparacion = () => { autosParaComparar = []; actualizarBarraComparar(); };
window.cerrarTabla = () => document.getElementById("modal-tabla").classList.add("hidden");

// --- DETALLE Y MODALES ---
window.verDetalles = (nombre, img, acc, vel, precio) => {
    document.getElementById("modal-titulo").innerText = nombre;
    document.getElementById("modal-img").src = img;
    document.getElementById("modal-specs").innerHTML = `
        <div class="flex justify-between uppercase text-[10px] tracking-widest text-gray-500"><span>0-100 km/h:</span><span class="text-white font-bold">${acc}</span></div>
        <div class="flex justify-between uppercase text-[10px] tracking-widest text-gray-500"><span>V. Máxima:</span><span class="text-white font-bold">${vel}</span></div>
        <div class="pt-6 mt-6 border-t border-white/10 flex justify-between items-center"><span class="text-[10px] text-gray-500 uppercase">Inversión:</span><span class="text-xl font-bold text-[#ff2800]">${precio}</span></div>
    `;
    document.getElementById("modal-detalle").classList.remove("hidden");
    document.body.style.overflow = "hidden";
};

window.cerrarModal = () => { document.getElementById("modal-detalle").classList.add("hidden"); document.body.style.overflow = "auto"; };

window.irAlChatbot = () => {
    const n = document.getElementById("modal-titulo").innerText;
    window.open(`https://wa.me/573000000000?text=Hola,%20deseo%20una%20cotización%20del%20${n}`, '_blank');
};

// --- PWA ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('PWA Lista'))
            .catch(err => console.error('Error en PWA', err));
    });
}

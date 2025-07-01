if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js")
    .then(() => {
      console.log("Service Worker registrado com sucesso.");
      pedirPermissaoENotificar(); // <- Solicita permissão para notificações
    })
    .catch((err) => console.log("Erro ao registrar o Service Worker:", err));
}

let deferredPrompt;
const installButton = document.getElementById("install-button");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installButton.style.display = "block";
});

installButton.addEventListener("click", () => {
  if (!deferredPrompt) return;

  installButton.style.display = "none";
  deferredPrompt.prompt();

  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === "accepted") {
      console.log("Usuário aceitou instalar o PWA.");
    } else {
      console.log("Usuário recusou a instalação do PWA.");
    }
    deferredPrompt = null;
  });
});

window.addEventListener("appinstalled", () => {
  console.log("Aplicativo foi instalado com sucesso!");
});

// ==============================
// Firebase
// ==============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAtQKil0mLHMj0U9xpx5xvpIByiHEqZC7o",
  authDomain: "downloads-8bb3e.firebaseapp.com",
  projectId: "downloads-8bb3e",
  storageBucket: "downloads-8bb3e.firebasestorage.app",
  messagingSenderId: "525179646091",
  appId: "1:525179646091:web:d6d49616df45f99bf4e48e",
  measurementId: "G-8ZGSEH9X46"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

signInAnonymously(auth)
  .then(() => console.log("Usuário autenticado anonimamente."))
  .catch((error) => console.error("Erro na autenticação:", error));

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuário autenticado:", user.uid);
    carregarContagemDownloads();
  }
});

async function carregarContagemDownloads() {
  const elements = document.querySelectorAll(".download-count");

  elements.forEach(async (element) => {
    const appName = element.getAttribute("data-app");
    const appRef = doc(db, "downloads", appName);

    try {
      const docSnap = await getDoc(appRef);
      if (docSnap.exists()) {
        element.innerText = docSnap.data().count;
      }
    } catch (error) {
      console.error("Erro ao carregar contagem de downloads:", error);
    }
  });
}

// ==============================
// Notificações Push
// ==============================

async function pedirPermissaoENotificar() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.error("Push ou Service Worker não suportado");
    return;
  }

  const registration = await navigator.serviceWorker.ready;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    console.warn("Permissão de notificação negada");
    return;
  }

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        "BAu1DjoP9qsFX82GDAGQ6fAakPHd6hVfdmZis-kBaikkBwZN27z-MQNVNgJEQw8F2g0hBzN6APxMW3x2gW_xjPE"
      ),
    });

    console.log("Inscrição Push criada:", JSON.stringify(subscription));

    // Aqui você pode salvar a inscrição no Firestore futuramente se quiser
  } catch (err) {
    console.error("Erro ao se inscrever para notificações:", err);
  }
}

// Converte a chave pública para Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
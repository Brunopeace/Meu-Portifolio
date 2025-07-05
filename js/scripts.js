
  if ('serviceWorker' in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js")
        .then(() => console.log("✅ Service Worker registrado"))
        .catch((err) => console.log("❌ Erro no Service Worker:", err));
    });
  }

const btn = document.getElementById('toggle-theme');
  const body = document.body;

  // Verifica tema salvo
  if (localStorage.getItem('tema') === 'escuro') {
    body.classList.add('dark-mode');
    btn.textContent = '☀️';
  }

  btn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const temaAtual = body.classList.contains('dark-mode') ? 'escuro' : 'claro';
    localStorage.setItem('tema', temaAtual);
    btn.textContent = temaAtual === 'escuro' ? '☀️' : '🌙';
  });
  
  window.onload = () => {
  let deferredPrompt;
  const installBtn = document.getElementById('btnInstalar');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
  });

  installBtn.addEventListener('click', () => {
    installBtn.style.display = 'none';
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ App instalado com sucesso!');
      } else {
        console.log('❌ Instalação cancelada.');
      }
      deferredPrompt = null;
    });
  });
};
  
  
  /* para não pegar o link pelo botão*/
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

  function baixarPDF() {
    const elemento = document.body; // ou pode ser um div específico
    const opt = {
      margin:       0.5,
      filename:     'portfolio-bruno-silva.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(elemento).save();
  }
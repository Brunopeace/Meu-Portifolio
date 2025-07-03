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
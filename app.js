(function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(function () {});
  }

  const frame = document.getElementById('appFrame');
  const launch = document.getElementById('launchScreen');
  const status = document.getElementById('connectionStatus');
  const url = String(window.XS_PRESCRICAO_CONFIG?.appUrl || '');
  const configured = /^https:\/\/script\.google\.com\/macros\/s\/(?!CONFIGURE_DEPLOYMENT_ID(?:\/|$))[^/]+\/exec$/.test(url);

  function load() {
    if (!configured) {
      status.textContent = 'Implantação indisponível. Configure uma URL /exec válida.';
      launch.hidden = false;
      return;
    }
    if (!navigator.onLine) {
      status.textContent = 'Sem conexão. Verifique a internet e tente novamente.';
      launch.hidden = false;
      return;
    }
    launch.hidden = true;
    frame.src = url;
  }

  frame.addEventListener('load', function () {
    if (!configured) return;
    launch.hidden = true;
    status.textContent = '';
  });
  frame.addEventListener('error', function () {
    status.textContent = 'Não foi possível carregar o aplicativo. Verifique a implantação e tente novamente.';
    launch.hidden = false;
  });
  window.addEventListener('offline', function () {
    status.textContent = 'Sem conexão';
    launch.hidden = false;
  });
  window.addEventListener('online', load);
  document.getElementById('retryButton').addEventListener('click', load);
  load();
}());

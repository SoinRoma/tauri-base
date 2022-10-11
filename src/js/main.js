const cw = window.__TAURI__.window.appWindow;
document
    .getElementById('titlebar-minimize')
    .addEventListener('click', () => cw.minimize())
document
    .getElementById('titlebar-maximize')
    .addEventListener('click', () => cw.toggleMaximize())
document
    .getElementById('titlebar-close')
    .addEventListener('click', () => cw.hide())

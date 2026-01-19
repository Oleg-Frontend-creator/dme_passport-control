export function initLoader() {
    const preloader = document.getElementById('preloder');
    if (!preloader) return;

    if (document.readyState === 'complete')
        hidePreloader(preloader);

    window.addEventListener('load', () => hidePreloader(preloader));
}

function hidePreloader(preloader) {
    preloader.style.opacity = '0';
    setTimeout(() => preloader.remove(), 200);
}
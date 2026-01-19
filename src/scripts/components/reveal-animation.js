export function initReveal({
                               selector = ['.reveal', '.timeline-item'],
                               rootMargin = '0px 0px -10% 0px',
                               threshold = 0.3,
                               visibleClass = 'is-visible',
                               once = true,
                           } = {}) {
    const selectors = Array.isArray(selector) ? selector : [selector];
    const elements = document.querySelectorAll(selectors.join(', '));
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
        elements.forEach((el) => el.classList.add(visibleClass));
        return;
    }

    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const element = entry.target;
                const transitionDelay = element.dataset.revealDelay;
                if (transitionDelay) element.style.transitionDelay = `${Number(transitionDelay)}ms`;

                element.classList.add(visibleClass);
                if (once) io.unobserve(element);
            });
        },
        { rootMargin, threshold }
    );

    elements.forEach((element) => io.observe(element));
}
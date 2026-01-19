import KeenSlider from "keen-slider";

export function autoplayPlugin(interval) {
    return (slider) => {
        let timeout;
        let mouseOver = false;

        function clearNextTimeout() {
            clearTimeout(timeout);
        }

        function nextTimeout() {
            clearTimeout(timeout);
            if (mouseOver) return;
            timeout = setTimeout(() => slider.next(), interval);
        }

        slider.on("created", () => {
            slider.container.addEventListener("mouseover", () => {
                mouseOver = true;
                clearNextTimeout();
            });
            slider.container.addEventListener("mouseout", () => {
                mouseOver = false;
                nextTimeout();
            });
            nextTimeout();
        });

        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
    };
}

export function activeClassPlugin(activeClass = "is-active") {
    return (slider) => {
        const setActive = () => {
            slider.slides.forEach((s) => s.classList.remove(activeClass));
            const rel = slider.track.details.rel;
            const el = slider.slides[rel];
            if (el) el.classList.add(activeClass);
        };

        slider.on("created", setActive);
        slider.on("slideChanged", setActive);
        slider.on("animationEnded", setActive);
        slider.on("updated", setActive);
    };
}

export function initSlider({
                               sliderOptions = {},
                               sliderSelector = "#keenSlider",
                               paginationSelector = '#keenPagination'
                           }) {
    const sliderHTMLElement = document.querySelector(sliderSelector);
    const paginationHTMLElement = document.querySelector(paginationSelector);

    if (!sliderHTMLElement || !paginationHTMLElement) return;

    const slider = new KeenSlider(sliderHTMLElement,
        {
            loop: true,
            mode: "snap",
            ...sliderOptions
        },
        [autoplayPlugin(4000), activeClassPlugin()]);

    const count = sliderHTMLElement.querySelectorAll(".keen-slider__slide").length;
    paginationHTMLElement.innerHTML = Array.from({length: count}, (_, i) => {
        const n = String(i + 1).padStart(2, "0");
        return `<span class="pagination-bullet" data-index="${i}">${n}</span>`;
    }).join("");

    paginationHTMLElement.addEventListener("click", (e) => {
        const btn = e.target.closest(".pagination-bullet");
        if (!btn) return;
        slider.moveToIdx(Number(btn.dataset.index));
    });

    const items = [...paginationHTMLElement.querySelectorAll(".pagination-bullet")];

    function setActive() {
        const rel = slider.track.details?.rel ?? 0;
        items.forEach((btn, i) => btn.classList.toggle("is-active", i === rel));
    }

    setActive();

    slider.on("created", setActive);
    slider.on("updated", setActive);
    slider.on("slideChanged", setActive);
    window.addEventListener("resize", () => slider.update());
}
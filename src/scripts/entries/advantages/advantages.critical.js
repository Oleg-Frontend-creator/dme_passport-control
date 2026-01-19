import {initBgSet} from "../../components/bg-set.js";
import {initLoader} from "../../components/loader";
import {initSlider} from "../../components/keen-karousel";
import {initReveal} from "../../components/reveal-animation";

initLoader();
document.addEventListener("DOMContentLoaded", () => {
    initBgSet();
    initReveal();
    initSlider({
        sliderOptions: {
            slides: { perView: 3, spacing: 24 },
            breakpoints: {
                "(max-width: 1130px)": { slides: { perView: 2, spacing: 16 } },
                "(max-width: 750px)": { slides: { perView: 1, spacing: 20 } },
            },
        }
    });
});
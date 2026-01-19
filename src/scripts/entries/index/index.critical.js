import {initBgSet} from "../../components/bg-set.js";
import {initLoader} from "../../components/loader";
import {initSlider} from "../../components/keen-karousel";
import {initReveal} from "../../components/reveal-animation";

initLoader();
document.addEventListener("DOMContentLoaded", () => {
    initBgSet();
    initReveal();
    initSlider({
        sliderOptions: {slides: {perView: 1}}
    });
});
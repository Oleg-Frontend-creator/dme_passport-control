export function initBgSet() {
    document.querySelectorAll(".bg-set-with-filter[data-bgset]").forEach((element) => {
        const bg = element.dataset.bgset;
        element.style.backgroundImage = `linear-gradient(rgba(0,0,0,.2), rgba(0,0,0,.2)), url("${bg}")`;
    });

    document.querySelectorAll(".bg-set[data-bgset]").forEach((element) => {
        const bg = element.dataset.bgset;
        element.style.backgroundImage = `url("${bg}")`;
    });
}
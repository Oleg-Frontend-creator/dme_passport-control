export function initBurgerMenu() {
    const menu = document.querySelector(".header-nav");
    const burger = document.getElementById("burger-menu");
    const items = document.querySelector(".header-nav-items");
    const links = document.querySelectorAll(".header-nav-link");

    if (!burger || !menu || !items) return;

    const setOpen = (isOpen) => {
        menu.classList.toggle("open", isOpen);
        items.classList.toggle("open", isOpen);
        document.body.style.overflow = isOpen ? "hidden" : "unset";
    };

    burger.addEventListener("change", () => setOpen(burger.checked));

    links.forEach((link) => {
        link.addEventListener("click", () => {
            burger.checked = false;
            setOpen(false);
        });
    });
}
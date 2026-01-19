import {initBurgerMenu} from "../../components/burger-menu.js";
import {initAjaxForms, initModals} from "../../components/modal-callback";

document.addEventListener("DOMContentLoaded", () => {
    initBurgerMenu();
    initModals();
    initAjaxForms();
});
import IMask from "imask";

let activeModal = null;
let lastFocus = null;
const phoneMasks = new WeakMap();

async function postForm(url, dataObj) {
    const body = new URLSearchParams(dataObj);
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body,
    });
    if (!res.ok) throw new Error("Request failed");
    return res.text();
}

function getFocusable(root) {
    return Array.from(
        root.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
    );
}

function lockScroll() {
    document.body.classList.add("is-locked");
}

function unlockScroll() {
    document.body.classList.remove("is-locked");
}

export function openModal(id) {
    const modal = document.getElementById(`modal-${id}`);
    if (!modal) return;
    modal.removeAttribute('hidden');
    modal.setAttribute('aria-hidden', 'false');

    if (activeModal) closeModal();

    lastFocus = document.activeElement;
    activeModal = modal;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    lockScroll();

    applyPhoneMasks(modal);

    const focusables = getFocusable(modal);
    (focusables[0] || modal).focus?.();
}

export function closeModal() {
    if (!activeModal) return;

    activeModal.classList.remove("is-open");
    activeModal.setAttribute("aria-hidden", "true");
    unlockScroll();

    const toRestore = lastFocus;
    activeModal = null;
    lastFocus = null;

    toRestore?.focus?.();
}

export function initModals() {
    document.addEventListener("click", (e) => {
        const openBtn = e.target.closest("[data-modal-open]");
        if (openBtn) {
            e.preventDefault();
            openModal(openBtn.dataset.modalOpen);
            return;
        }

        if (e.target.closest("[data-modal-close]")) {
            e.preventDefault();
            closeModal();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (!activeModal) return;

        if (e.key === "Escape") {
            e.preventDefault();
            closeModal();
            return;
        }

        if (e.key === "Tab") {
            const focusables = getFocusable(activeModal);
            if (!focusables.length) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });
}

function applyPhoneMasks(root = document) {
    const inputs = root.querySelectorAll('input[name="phone"]');

    inputs.forEach((input) => {
        if (phoneMasks.has(input)) return;

        const mask = IMask(input, {
            mask: "+{7}(000)000-00-00",
            lazy: true,
        });

        phoneMasks.set(input, mask);

        const validate = () => {
            const ok = mask.masked.isComplete;
            input.setCustomValidity(ok ? "" : "Введите телефон полностью: +7(000)000-00-00");
        };

        input.addEventListener("input", validate);
        input.addEventListener("blur", validate);
        validate();
    });
}

function formToObject(form) {
    const fd = new FormData(form);
    const obj = Object.fromEntries(fd.entries());

    for (const k in obj) {
        if (typeof obj[k] === "string") obj[k] = obj[k].trim();
    }
    return obj;
}

export function initAjaxForms() {
    applyPhoneMasks(document);

    document.addEventListener("submit", async (e) => {
        const form = e.target.closest("[data-ajax-form]");
        if (!form) return;

        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const submitBtn = form.querySelector('[type="submit"]');
        submitBtn?.setAttribute("disabled", "disabled");

        const endpoint = form.dataset.endpoint || "php/mail-callback.php";
        const successModal = form.dataset.successModal || "thanks";
        const errorModal = form.dataset.errorModal || "error";

        const data = formToObject(form);

        try {
            await postForm(endpoint, data);
            if (successModal) openModal(successModal);
            form.reset();
            applyPhoneMasks(form);
        } catch (err) {
            console.error(err);
            if (errorModal) openModal(errorModal);
        } finally {
            submitBtn?.removeAttribute("disabled");
        }
    });
}
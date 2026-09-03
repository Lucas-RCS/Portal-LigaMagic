import { Modal } from "./Modal.js";
import { getRarity } from "../utils/constants.js";

/**
 * Card deletion confirmation modal.
 */
export class ConfirmDeleteModal extends Modal {
  #onConfirm;

  /**
   * @param {HTMLElement} root
   * @param {{ onConfirm?: (card: object) => void }} [options]
   */
  constructor(root, { onConfirm } = {}) {
    super(root);
    this.#onConfirm = onConfirm;
  }

  /** @param {object} card */
  open(card) {
    this.mount(this.#template(card));
    super.open();

    this.element
      .querySelector("[data-confirm-delete]")
      .addEventListener("click", () => {
        this.close();
        this.#onConfirm?.(card);
      });
  }

  #template(card) {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    const panel = document.createElement("div");
    panel.className = "modal-panel modal-panel--sm";
    overlay.append(panel);

    panel.append(
      this.#createHeader(),
      this.#createBody(card),
      this.#createFooter(),
    );

    return overlay;
  }

  #createHeader() {
    const header = document.createElement("header");
    header.className = "modal-header";

    const title = document.createElement("h2");
    title.textContent = "Excluir Carta";

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "modal-close";
    closeBtn.dataset.modalClose = "";
    closeBtn.setAttribute("aria-label", "Fechar");
    closeBtn.textContent = "×";

    header.append(title, closeBtn);
    return header;
  }

  #createBody(card) {
    const rarity = getRarity(card.rarity);

    const body = document.createElement("div");
    body.className = "modal-body confirm-delete";

    const title = document.createElement("p");
    title.className = "confirm-title";
    title.textContent = "Tem certeza que deseja excluir esta carta?";

    const subtitle = document.createElement("p");
    subtitle.className = "confirm-subtitle";
    subtitle.textContent = "Essa ação não pode ser desfeita.";

    body.append(this.#createIcon(), title, subtitle);
    return body;
  }

  #createIcon() {
    const icon = document.createElement("div");
    icon.className = "confirm-icon";
    icon.innerHTML =
      '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 17h.01"/></svg>';
    return icon;
  }

  #createFooter() {
    const footer = document.createElement("footer");
    footer.className = "modal-footer";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "btn btn-ghost";
    cancelBtn.dataset.modalClose = "";
    cancelBtn.textContent = "Cancelar";

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "btn btn-danger";
    confirmBtn.dataset.confirmDelete = "";
    confirmBtn.innerHTML =
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg><span>Excluir Carta</span>';

    footer.append(cancelBtn, confirmBtn);
    return footer;
  }
}

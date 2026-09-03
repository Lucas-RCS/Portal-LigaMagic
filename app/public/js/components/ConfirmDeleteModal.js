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

    const icon = document.createElement("div");
    icon.className = "confirm-icon";
    icon.textContent = "!";

    const title = document.createElement("p");
    title.className = "confirm-title";
    title.textContent = "Tem certeza que deseja excluir esta carta?";

    const subtitle = document.createElement("p");
    subtitle.className = "confirm-subtitle";
    subtitle.textContent = "Essa ação não pode ser desfeita.";

    body.append(icon, title, subtitle, this.#createCardPreview(card, rarity));
    return body;
  }

  #createCardPreview(card, rarity) {
    const preview = document.createElement("div");
    preview.className = "confirm-card-preview";

    if (card.image) {
      const img = document.createElement("img");
      img.src = card.image;
      img.alt = card.name_ing;
      preview.append(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "card-thumb-placeholder";
      placeholder.textContent = "Sem imagem";
      preview.append(placeholder);
    }

    const info = document.createElement("div");

    const name = document.createElement("strong");
    name.textContent = card.name_ing;

    const gameEdition = document.createElement("span");
    gameEdition.textContent = `${card.game_name} - ${card.edition_name}`;

    const badge = document.createElement("span");
    badge.className = `badge badge--${rarity?.cssClass ?? "common"}`;
    badge.textContent = rarity?.label ?? card.rarity;

    info.append(name, gameEdition, badge);
    preview.append(info);
    return preview;
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
    confirmBtn.textContent = "Excluir Carta";

    footer.append(cancelBtn, confirmBtn);
    return footer;
  }
}

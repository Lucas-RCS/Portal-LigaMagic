import { Modal } from "./Modal.js";
import { getRarity } from "../utils/constants.js";

/**
 * Read-only modal with the complete card details.
 */
export class CardDetailsModal extends Modal {
  /** @param {object} card */
  open(card) {
    this.mount(this.#template(card));
    super.open();
  }

  #template(card) {
    const rarity = getRarity(card.rarity);

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    const panel = document.createElement("div");
    panel.className = "modal-panel";
    overlay.append(panel);

    panel.append(
      this.#createHeader(),
      this.#createBody(card, rarity),
      this.#createFooter(),
    );

    return overlay;
  }

  #createHeader() {
    const header = document.createElement("header");
    header.className = "modal-header";

    const title = document.createElement("h2");
    title.textContent = "Detalhes da Carta";

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "modal-close";
    closeBtn.dataset.modalClose = "";
    closeBtn.setAttribute("aria-label", "Fechar");
    closeBtn.textContent = "×";

    header.append(title, closeBtn);
    return header;
  }

  #createBody(card, rarity) {
    const body = document.createElement("div");
    body.className = "modal-body card-details";

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "card-details-image";

    if (card.image) {
      const img = document.createElement("img");
      img.src = card.image;
      img.alt = card.name_ing;
      imageWrapper.append(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "card-thumb-placeholder";
      placeholder.textContent = "Sem imagem";
      imageWrapper.append(placeholder);
    }

    const list = document.createElement("dl");
    list.className = "card-details-list";
    list.append(
      this.#createRow("Nome (Inglês)", card.name_ing),
      this.#createRow("Nome (Português)", card.name_por || "—"),
      this.#createRow("Card Game", card.game_name),
      this.#createRow("Edição", card.edition_name),
      this.#createRarityRow(rarity, card.rarity),
      this.#createImageUrlRow(card.image),
    );

    body.append(imageWrapper, list);
    return body;
  }

  #createRow(term, value) {
    const row = document.createElement("div");

    const dt = document.createElement("dt");
    dt.textContent = term;

    const dd = document.createElement("dd");
    dd.textContent = value;

    row.append(dt, dd);
    return row;
  }

  #createRarityRow(rarity, rawRarity) {
    const row = document.createElement("div");

    const dt = document.createElement("dt");
    dt.textContent = "Raridade";

    const dd = document.createElement("dd");
    const badge = document.createElement("span");
    badge.className = `badge badge--${rarity?.cssClass ?? "common"}`;
    badge.textContent = rarity?.label ?? rawRarity;
    dd.append(badge);

    row.append(dt, dd);
    return row;
  }

  #createImageUrlRow(image) {
    const row = document.createElement("div");

    const dt = document.createElement("dt");
    dt.textContent = "Imagem (URL)";

    const dd = document.createElement("dd");
    if (image) {
      const link = document.createElement("a");
      link.href = image;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = image;
      dd.append(link);
    } else {
      dd.textContent = "—";
    }

    row.append(dt, dd);
    return row;
  }

  #createFooter() {
    const footer = document.createElement("footer");
    footer.className = "modal-footer";

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "btn btn-ghost";
    closeBtn.dataset.modalClose = "";
    closeBtn.textContent = "Fechar";

    footer.append(closeBtn);
    return footer;
  }
}

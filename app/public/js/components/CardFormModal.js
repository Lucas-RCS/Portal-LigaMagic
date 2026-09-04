import { Modal } from "./Modal.js";
import { RARITIES } from "../utils/constants.js";
import { showToast } from "../index.js";
import { fetchCardGames, fetchEditionsByGame } from "../api/game.js";
import { createCard, updateCard } from "../api/card.js";

/**
 * Card creation/editing modal with the Edition field dependent on the selected Card Game.
 */
export class CardFormModal extends Modal {
  #games = [];
  #onSaved;
  #card = null;

  /**
   * @param {HTMLElement} root
   * @param {{ onSaved?: () => void }} [options]
   */
  constructor(root, { onSaved } = {}) {
    super(root);
    this.#onSaved = onSaved;
  }

  /** @param {object|null} card Card to be edited; null to create a new one. */
  async open(card = null) {
    this.#card = card;
    this.mount(this.#template(card));
    super.open();

    const gameSelect = this.element.querySelector("[data-game-select]");
    const editionSelect = this.element.querySelector("[data-edition-select]");

    try {
      this.#games = await fetchCardGames();
    } catch (error) {
      console.error(error);
      showToast("Não foi possível carregar os card games.", "error");
      this.#games = [];
    }

    gameSelect.replaceChildren(
      this.#createOption("", "Selecione um card game"),
      ...this.#games.map((game) => this.#createOption(game.id, game.name)),
    );

    if (card) {
      gameSelect.value = String(card.game_id);
      await this.#loadEditions(card.game_id, card.edition_id);
    }

    gameSelect.addEventListener("change", async () => {
      editionSelect.value = "";

      if (!gameSelect.value) {
        editionSelect.replaceChildren(
          this.#createOption("", "Selecione um card game primeiro"),
        );
        editionSelect.disabled = true;
        return;
      }

      await this.#loadEditions(gameSelect.value);
    });

    this.element
      .querySelector("[data-card-form]")
      .addEventListener("submit", (event) => {
        this.#handleSubmit(event);
      });
  }

  async #loadEditions(gameId, selectedEditionId = null) {
    const editionSelect = this.element.querySelector("[data-edition-select]");

    editionSelect.disabled = true;
    editionSelect.replaceChildren(
      this.#createOption("", "Carregando edições..."),
    );

    try {
      const editions = await fetchEditionsByGame(gameId);

      editionSelect.replaceChildren(
        this.#createOption("", "Selecione uma edição"),
        ...editions.map((edition) =>
          this.#createOption(edition.id, edition.name),
        ),
      );

      if (selectedEditionId) {
        editionSelect.value = String(selectedEditionId);
      }
    } catch (error) {
      console.error(error);
      editionSelect.replaceChildren(
        this.#createOption("", "Erro ao carregar edições"),
      );
      showToast("Não foi possível carregar as edições.", "error");
    } finally {
      editionSelect.disabled = false;
    }
  }

  async #handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
      if (this.#card) {
        await updateCard(this.#card.id, data);
        showToast("Carta atualizada com sucesso.", "success");
      } else {
        await createCard(data);
        showToast("Carta cadastrada com sucesso.", "success");
      }

      this.close();
      this.#onSaved?.();
    } catch (error) {
      console.error(error);
      showToast(error.message ?? "Não foi possível salvar a carta.", "error");
    } finally {
      submitBtn.disabled = false;
    }
  }

  #createOption(value, label) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
  }

  #createField(labelText, inputEl, { full = false } = {}) {
    const field = document.createElement("div");
    field.className = full ? "field field--full" : "field";

    const label = document.createElement("label");
    label.textContent = labelText;

    field.append(label, inputEl);
    return field;
  }

  #template(card) {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    const panel = document.createElement("div");
    panel.className = "modal-panel modal-panel--lg";
    overlay.append(panel);

    panel.append(this.#createHeader(card), this.#createForm(card));
    return overlay;
  }

  #createHeader(card) {
    const header = document.createElement("header");
    header.className = "modal-header";

    const headerText = document.createElement("div");
    headerText.className = "modal-header-text";

    const title = document.createElement("h2");
    title.textContent = card ? "Editar Carta" : "Nova Carta";

    const subtitle = document.createElement("p");
    subtitle.textContent = card
      ? "Atualize as informações da carta selecionada."
      : "Preencha os dados para cadastrar uma nova carta.";

    headerText.append(title, subtitle);

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "modal-close";
    closeBtn.dataset.modalClose = "";
    closeBtn.setAttribute("aria-label", "Fechar");
    closeBtn.textContent = "×";

    header.append(headerText, closeBtn);
    return header;
  }

  #createForm(card) {
    const form = document.createElement("form");
    form.className = "modal-body card-form";
    form.dataset.cardForm = "";

    const nameIngInput = document.createElement("input");
    nameIngInput.type = "text";
    nameIngInput.name = "name_ing";
    nameIngInput.placeholder = "Ex: Black Lotus";
    nameIngInput.value = card?.name_ing ?? "";
    nameIngInput.required = true;

    const namePorInput = document.createElement("input");
    namePorInput.type = "text";
    namePorInput.name = "name_por";
    namePorInput.placeholder = "Ex: Lótus Negra";
    namePorInput.value = card?.name_por ?? "";
    namePorInput.required = true;

    const gameSelect = document.createElement("select");
    gameSelect.name = "game_id";
    gameSelect.dataset.gameSelect = "";
    gameSelect.required = true;
    gameSelect.append(this.#createOption("", "Carregando..."));

    const editionSelect = document.createElement("select");
    editionSelect.name = "edition_id";
    editionSelect.dataset.editionSelect = "";
    editionSelect.disabled = true;
    editionSelect.required = true;
    editionSelect.append(
      this.#createOption("", "Selecione um card game primeiro"),
    );

    const imageInput = document.createElement("input");
    imageInput.type = "url";
    imageInput.name = "image";
    imageInput.placeholder = "https://exemplo.com/imagem.jpg";
    imageInput.value = card?.image ?? "";

    const raritySelect = document.createElement("select");
    raritySelect.name = "rarity";
    raritySelect.required = true;
    raritySelect.append(
      this.#createOption("", "Selecione a raridade"),
      ...RARITIES.map((rarity) => this.#createOption(rarity.id, rarity.label)),
    );
    raritySelect.value = card?.rarity ?? "";

    form.append(
      this.#createField("Nome da Carta (Inglês) *", nameIngInput),
      this.#createField("Nome da Carta (Português) *", namePorInput),
      this.#createField("Card Game *", gameSelect),
      this.#createField("Edição da Carta *", editionSelect),
      this.#createField("Imagem da Carta (URL)", imageInput, { full: true }),
      this.#createField("Raridade da Carta *", raritySelect, { full: true }),
      this.#createFooter(card),
    );

    return form;
  }

  #createFooter(card) {
    const footer = document.createElement("footer");
    footer.className = "modal-footer field--full";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "btn btn-ghost";
    cancelBtn.dataset.modalClose = "";
    cancelBtn.textContent = "Cancelar";

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.className = "btn btn-primary";
    submitBtn.textContent = card ? "Salvar Alterações" : "Salvar Carta";

    footer.append(cancelBtn, submitBtn);
    return footer;
  }
}

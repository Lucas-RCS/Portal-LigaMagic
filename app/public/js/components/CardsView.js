import { RARITIES, PAGE_SIZE, getRarity } from "../utils/constants.js";
import { debounce } from "../utils/functions.js";
import { showToast } from "../index.js";
import { CardFormModal } from "./CardFormModal.js";
import { CardDetailsModal } from "./CardDetailsModal.js";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal.js";

const SVGs = {
  search: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`,
  eye: `<svg viewBox="0 0 24 24"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  edit: `<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16v4Z"/></svg>`,
  delete: `<svg viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/></svg>`,
};

/** Creates an element, optionally setting attributes/text and appending children. */
function el(tag, { attrs = {}, text, children = [] } = {}) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([key, value]) =>
    node.setAttribute(key, value),
  );
  if (text !== undefined) node.textContent = text;
  children.forEach((child) => node.appendChild(child));
  return node;
}

/**
 * Controls the card listing screen: filters, table, pagination, and modals.
 */
export class CardsView {
  #root;
  #modalRoot;
  #filters = { q: "", game_id: "", edition_id: "", rarity: "" };
  #page = 1;
  #total = 0;

  /**
   * @param {HTMLElement} root Main container where the screen is rendered.
   * @param {HTMLElement} modalRoot Container where modals are inserted.
   */
  constructor(root, modalRoot) {
    this.#root = root;
    this.#modalRoot = modalRoot;

    this.formModal = new CardFormModal(modalRoot, {
      onSaved: () => this.#load(),
    });
    this.detailsModal = new CardDetailsModal(modalRoot);
    this.confirmModal = new ConfirmDeleteModal(modalRoot, {
      onConfirm: (card) => this.#handleDelete(card),
    });
  }

  async init() {
    this.#renderShell();
    await this.#populateGameFilter();
    this.#bindStaticEvents();
    await this.#load();
  }

  #renderShell() {
    const pageHeader = el("div", {
      attrs: { class: "page-header" },
      children: [
        el("div", {
          children: [
            el("h2", { text: "Cartas" }),
            el("p", {
              text: "Gerencie todas as cartas cadastradas no sistema.",
            }),
          ],
        }),
        el("button", {
          attrs: {
            type: "button",
            class: "btn btn-primary",
            "data-new-card": "",
          },
          text: "+ Nova Carta",
        }),
      ],
    });

    const searchIcon = el("span", {
      attrs: { class: "icon", "aria-hidden": "true" },
    });
    searchIcon.innerHTML = SVGs.search;

    const rarityOptions = RARITIES.map((rarity) =>
      this.#createOption(rarity.id, rarity.label),
    );

    const filtersBar = el("div", {
      attrs: { class: "filters-bar" },
      children: [
        el("div", {
          attrs: { class: "input-search" },
          children: [
            searchIcon,
            el("input", {
              attrs: {
                type: "search",
                placeholder: "Buscar por nome da carta",
                "data-filter-q": "",
              },
            }),
          ],
        }),
        el("select", {
          attrs: { "data-filter-game": "" },
          children: [this.#createOption("", "Todos os Card Games")],
        }),
        el("select", {
          attrs: { "data-filter-edition": "", disabled: "" },
          children: [this.#createOption("", "Todas as Edições")],
        }),
        el("select", {
          attrs: { "data-filter-rarity": "" },
          children: [
            this.#createOption("", "Todas as Raridades"),
            ...rarityOptions,
          ],
        }),
        el("button", {
          attrs: {
            type: "button",
            class: "btn btn-ghost",
            "data-clear-filters": "",
          },
          text: "Limpar filtros",
        }),
      ],
    });

    const headerRow = el("tr", {
      children: [
        "Imagem",
        "Nome (Inglês)",
        "Nome (Português)",
        "Card Game",
        "Edição",
        "Raridade",
        "Ações",
      ].map((label) => el("th", { text: label })),
    });

    const tbody = el("tbody", {
      attrs: { "data-table-body": "" },
      children: [this.#createStateRow("Carregando cartas...")],
    });

    const tableWrap = el("div", {
      attrs: { class: "table-wrap" },
      children: [
        el("table", {
          attrs: { class: "cards-table" },
          children: [el("thead", { children: [headerRow] }), tbody],
        }),
      ],
    });

    const tableFooter = el("div", {
      attrs: { class: "table-footer" },
      children: [
        el("span", { attrs: { "data-result-count": "" } }),
        el("div", { attrs: { class: "pagination", "data-pagination": "" } }),
      ],
    });

    this.#root.replaceChildren(pageHeader, filtersBar, tableWrap, tableFooter);
  }

  #createOption(value, label) {
    return el("option", { attrs: { value }, text: label });
  }

  #createStateRow(text) {
    return el("tr", {
      children: [
        el("td", { attrs: { colspan: "7", class: "table-state" }, text }),
      ],
    });
  }

  async #populateGameFilter() {
    const gameFilter = this.#root.querySelector("[data-filter-game]");

    try {
      // make fetch

      const games = [
        { id: 1, name: "Test Game 1" },
        { id: 2, name: "Test Game 2" },
      ];
      gameFilter.replaceChildren(
        this.#createOption("", "Todos os Card Games"),
        ...games.map((game) => this.#createOption(game.id, game.name)),
      );
    } catch (error) {
      console.error(error);
      showToast("Não foi possível carregar os card games.", "error");
    }
  }

  #bindStaticEvents() {
    this.#root
      .querySelector("[data-new-card]")
      .addEventListener("click", () => {
        this.formModal.open(null);
      });

    this.#root.querySelector("[data-filter-q]").addEventListener(
      "input",
      debounce((event) => {
        this.#filters.q = event.target.value.trim();
        this.#page = 1;
        this.#load();
      }, 350),
    );

    const gameFilter = this.#root.querySelector("[data-filter-game]");
    const editionFilter = this.#root.querySelector("[data-filter-edition]");

    gameFilter.addEventListener("change", async () => {
      this.#filters.game_id = gameFilter.value;
      this.#filters.edition_id = "";
      this.#page = 1;

      if (!gameFilter.value) {
        editionFilter.replaceChildren(
          this.#createOption("", "Todas as Edições"),
        );
        editionFilter.disabled = true;
      } else {
        editionFilter.disabled = true;
        editionFilter.replaceChildren(this.#createOption("", "Carregando..."));

        try {
          // make fetch

          const editions = [
            { id: 1, name: "Test Edition 1" },
            { id: 2, name: "Test Edition 2" },
          ];

          editionFilter.replaceChildren(
            this.#createOption("", "Todas as Edições"),
            ...editions.map((edition) =>
              this.#createOption(edition.id, edition.name),
            ),
          );
        } catch (error) {
          console.error(error);
          showToast("Não foi possível carregar as edições.", "error");
        } finally {
          editionFilter.disabled = false;
        }
      }

      this.#load();
    });

    editionFilter.addEventListener("change", () => {
      this.#filters.edition_id = editionFilter.value;
      this.#page = 1;
      this.#load();
    });

    this.#root
      .querySelector("[data-filter-rarity]")
      .addEventListener("change", (event) => {
        this.#filters.rarity = event.target.value;
        this.#page = 1;
        this.#load();
      });

    this.#root
      .querySelector("[data-clear-filters]")
      .addEventListener("click", () => {
        this.#filters = { q: "", game_id: "", edition_id: "", rarity: "" };
        this.#page = 1;

        this.#root.querySelector("[data-filter-q]").value = "";
        this.#root.querySelector("[data-filter-game]").value = "";
        this.#root.querySelector("[data-filter-rarity]").value = "";
        editionFilter.replaceChildren(
          this.#createOption("", "Todas as Edições"),
        );
        editionFilter.disabled = true;

        this.#load();
      });
  }

  async #load() {
    const tbody = this.#root.querySelector("[data-table-body]");
    tbody.replaceChildren(this.#createStateRow("Carregando cartas..."));

    try {
      // Mke API call to fetch cards
      const result = {
        items: [
          {
            id: 1,
            name_ing: "Test Card 1",
            name_por: "Carta Teste 1",
            rarity: "comum",
            game_name: "Magic: The Gathering",
            edition_name: "Edição Teste",
            image:
              "https://gatherer-static.wizards.com/Cards/medium/8EF154010202F1165F73FEC893EBED861411C88F00BD065B1839C8736376C455.webp",
          },
          {
            id: 2,
            name_ing: "Test Card 2",
            name_por: "Carta Teste 2",
            rarity: "rara",
            game_name: "Magic: The Gathering",
            edition_name: "Edição Teste",
            image: "",
          },
        ],
        total: 2,
        page: this.#page,
        per_page: PAGE_SIZE,
      };
      this.#renderRows(result.items);
      this.#renderFooter(
        result.items.length,
        result.total,
        result.page,
        result.per_page,
      );
    } catch (error) {
      console.error(error);
      tbody.replaceChildren(
        this.#createStateRow("Erro ao carregar as cartas."),
      );
      showToast("Não foi possível carregar as cartas.", "error");
    }
  }

  #renderRows(cards) {
    const tbody = this.#root.querySelector("[data-table-body]");

    if (cards.length === 0) {
      tbody.replaceChildren(this.#createStateRow("Nenhuma carta encontrada."));
      return;
    }

    tbody.replaceChildren(...cards.map((card) => this.#createCardRow(card)));
  }

  #createCardRow(card) {
    const rarity = getRarity(card.rarity);

    const imageCell = card.image
      ? el("img", {
          attrs: {
            class: "card-thumb",
            src: card.image,
            alt: card.name_ing,
          },
        })
      : el("div", {
          attrs: { class: "card-thumb card-thumb-placeholder" },
          text: "-",
        });

    const badge = el("span", {
      attrs: { class: `badge badge--${rarity?.cssClass ?? "comum"}` },
      text: rarity?.label ?? card.rarity,
    });

    const viewButton = this.#createActionButton(
      "view",
      card.id,
      "Ver detalhes",
      SVGs.eye,
    );
    const editButton = this.#createActionButton(
      "edit",
      card.id,
      "Editar",
      SVGs.edit,
    );
    const deleteButton = this.#createActionButton(
      "delete",
      card.id,
      "Excluir",
      SVGs.delete,
      "icon-btn icon-btn--danger",
    );

    return el("tr", {
      children: [
        el("td", { children: [imageCell] }),
        el("td", { text: card.name_ing }),
        el("td", { text: card.name_por || "—" }),
        el("td", { text: card.game_name }),
        el("td", { text: card.edition_name }),
        el("td", { children: [badge] }),
        el("td", {
          attrs: { class: "actions-cell" },
          children: [viewButton, editButton, deleteButton],
        }),
      ],
    });
  }

  #createActionButton(action, id, label, icon, className = "icon-btn") {
    const button = el("button", {
      attrs: {
        type: "button",
        class: className,
        "data-action": action,
        "data-id": id,
        "aria-label": label,
      },
    });
    button.innerHTML = icon;
    button.addEventListener("click", () => this.#handleRowAction(button));
    return button;
  }

  async #handleRowAction(button) {
    const id = button.dataset.id;
    const action = button.dataset.action;

    try {
      //Make fetch
      const card = {
        id: 1,
        name_ing: "Test Card 1",
        name_por: "Carta Teste 1",
        rarity: "mitica",
        game_name: "Magic: The Gathering",
        edition_name: "Edição Teste",
        image:
          "https://gatherer-static.wizards.com/Cards/medium/8EF154010202F1165F73FEC893EBED861411C88F00BD065B1839C8736376C455.webp",
      };

      if (action === "view") this.detailsModal.open(card);
      if (action === "edit") this.formModal.open(card);
      if (action === "delete") this.confirmModal.open(card);
    } catch (error) {
      console.error(error);
      showToast("Não foi possível carregar a carta.", "error");
    }
  }

  async #handleDelete(card) {
    try {
      // make fetch delete

      showToast("Carta excluída com sucesso.", "success");

      if (this.#page > 1 && this.#total - 1 <= (this.#page - 1) * PAGE_SIZE) {
        this.#page -= 1;
      }

      await this.#load();
    } catch (error) {
      console.error(error);
      showToast(error.message ?? "Não foi possível excluir a carta.", "error");
    }
  }

  #renderFooter(count, total, page, perPage) {
    const resultCount = this.#root.querySelector("[data-result-count]");
    const start = total === 0 ? 0 : (page - 1) * perPage + 1;
    const end = (page - 1) * perPage + count;
    resultCount.textContent = `Mostrando ${start} a ${end} de ${total} cartas.`;

    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const pagination = this.#root.querySelector("[data-pagination]");

    const createPageButton = (label, targetPage, options = {}) => {
      const button = el("button", {
        attrs: {
          type: "button",
          class: `page-btn${options.active ? " is-active" : ""}`,
        },
        text: label,
      });
      if (options.disabled) button.disabled = true;
      button.addEventListener("click", () => {
        if (targetPage < 1 || targetPage > totalPages || targetPage === page)
          return;

        this.#page = targetPage;
        this.#load();
      });
      return button;
    };

    const buttons = [createPageButton("‹", page - 1, { disabled: page <= 1 })];

    for (let p = 1; p <= totalPages; p += 1) {
      buttons.push(createPageButton(String(p), p, { active: p === page }));
    }

    buttons.push(
      createPageButton("›", page + 1, { disabled: page >= totalPages }),
    );

    pagination.replaceChildren(...buttons);
  }
}

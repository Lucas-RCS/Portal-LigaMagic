/**
 * Reusable modal base
 */
export class Modal {
  #onKeydown = (event) => {
    if (event.key === "Escape") this.close();
  };

  /** @param {HTMLElement} root */
  constructor(root) {
    this.root = root;
    this.element = null;
  }

  /**
   * @param {string|HTMLElement} content
   */
  mount(content) {
    this.unmount();

    if (content instanceof HTMLElement) {
      this.element = content;
    } else {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = content.trim();
      this.element = wrapper.firstElementChild;
    }
    this.root.append(this.element);

    this.element.querySelectorAll("[data-modal-close]").forEach((button) => {
      button.addEventListener("click", () => this.close());
    });

    this.element.addEventListener("click", (event) => {
      if (event.target === this.element) this.close();
    });
  }

  open() {
    if (!this.element) return;

    requestAnimationFrame(() => this.element?.classList.add("is-open"));
    document.addEventListener("keydown", this.#onKeydown);
  }

  close() {
    if (!this.element) return;

    this.element.classList.remove("is-open");
    document.removeEventListener("keydown", this.#onKeydown);

    window.setTimeout(() => this.unmount(), 200);
  }

  unmount() {
    this.element?.remove();
    this.element = null;
  }
}

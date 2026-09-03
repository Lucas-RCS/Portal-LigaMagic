import { logout } from "../api/user.js";
import { showToast } from "../index.js";

const MENU_ITEMS = [
  {
    id: "cartas",
    label: "Cartas",
    href: "home.php",
    icon: `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/></svg>`,
  },
];

export class Sidebar {
  /**
   * @param {HTMLElement} root
   * @param {{ activeId?: string }} [options]
   */
  constructor(root, { activeId = "cartas" } = {}) {
    this.root = root;
    this.activeId = activeId;
  }

  init() {
    this.#renderMenu();
    this.#bindLogout();
  }

  #renderMenu() {
    const nav = this.root.querySelector("[data-sidebar-menu]");
    if (!nav) return;

    nav.replaceChildren(
      ...MENU_ITEMS.map((item) => this.#createMenuLink(item)),
    );
  }

  #createMenuLink(item) {
    const link = document.createElement("a");
    link.className = `sidebar-link${item.id === this.activeId ? " is-active" : ""}`;
    link.href = item.href;
    link.dataset.menuId = item.id;

    const icon = document.createElement("span");
    icon.className = "sidebar-icon";
    icon.innerHTML = item.icon;

    const label = document.createElement("span");
    label.className = "sidebar-label";
    label.textContent = item.label;

    link.append(icon, label);
    return link;
  }

  #bindLogout() {
    const logoutBtn = this.root.querySelector("[data-logout]");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", async () => {
      try {
        await logout();
        window.location.href = "index.php";
      } catch (error) {
        console.error(error);
        showToast("Não foi possível encerrar a sessão.", "error");
      }
    });
  }
}

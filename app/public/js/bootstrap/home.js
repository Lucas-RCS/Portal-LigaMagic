import { Sidebar } from "../components/Sidebar.js";
import { CardsView } from "../components/CardsView.js";
import { showToast } from "../utils/toast.js";

document.addEventListener("DOMContentLoaded", () => {
  const spanAvatar = document.querySelector(".avatar");
  if (spanAvatar) {
    spanAvatar.textContent = window.username.charAt(0).toUpperCase();
  }

  const sidebar = new Sidebar(document.getElementById("sidebar"), {
    activeId: "cartas",
  });
  sidebar.init();

  const cardsView = new CardsView(
    document.getElementById("view-root"),
    document.getElementById("modal-root"),
  );
  cardsView.init();

  if (sessionStorage.getItem("showWelcomeToast") === "true") {
    sessionStorage.removeItem("showWelcomeToast");
    showToast("Seja Bem-vindo(a)!", "success");
  }
});

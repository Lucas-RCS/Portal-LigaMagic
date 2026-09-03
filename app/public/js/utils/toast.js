const TOAST_TYPES = {
  success: "toast--success",
  error: "toast--error",
  warning: "toast--warning",
  info: "toast--info",
};

let toastContainer;

/**
 * @param {'success'|'error'|'warning'|'info'} [type='info']
 * @returns {{ container: HTMLElement, type: string, styleClass: string }}
 */
function getContainer(type = "info") {
  if (!toastContainer?.isConnected) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    toastContainer.setAttribute("aria-live", "polite");
    toastContainer.setAttribute("aria-atomic", "true");
    document.body.append(toastContainer);
  }

  const resolvedType = TOAST_TYPES[type] ? type : "info";
  const styleClass = TOAST_TYPES[resolvedType];

  return {
    container: toastContainer,
    type: resolvedType,
    styleClass,
  };
}

/**
 * @param {string} message
 * @param {'success'|'error'|'warning'|'info'} [type='info']
 * @returns {() => void}
 */
export function showToast(message, type = "info") {
  const { container, type: toastType, styleClass } = getContainer(type);

  const toast = document.createElement("div");
  toast.className = `toast ${styleClass}`;
  toast.setAttribute("role", toastType === "error" ? "alert" : "status");

  const text = document.createElement("span");
  text.className = "toast-message";
  text.textContent = String(message);

  const closeButton = document.createElement("button");
  closeButton.className = "toast-close";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Fechar notificação");
  closeButton.textContent = "×";

  toast.append(text, closeButton);
  container.append(toast);

  let isClosed = false;
  let timeoutId;

  const closeToast = () => {
    if (isClosed) {
      return;
    }

    isClosed = true;
    window.clearTimeout(timeoutId);
    toast.classList.add("toast--leaving");

    const removeToast = () => toast.remove();
    toast.addEventListener("animationend", removeToast, { once: true });
    window.setTimeout(removeToast, 200);
  };

  closeButton.addEventListener("click", closeToast);
  timeoutId = window.setTimeout(closeToast, 3000);

  return closeToast;
}

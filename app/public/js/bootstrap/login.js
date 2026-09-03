import { showToast } from "../index.js";
import { login } from "../api/user.js";

/**
 * Displays the error state of a field
 * @param {HTMLInputElement} input
 * @param {string} message
 */
function showFieldError(input, message) {
  const field = input.closest(".field");
  if (!field) {
    console.error("[showFieldError] .field não encontrado para", input.id);
    return;
  }

  clearFieldError(input);
  field.classList.add("has-error");

  const error = document.createElement("span");
  error.className = "field-error";
  error.setAttribute("role", "alert");
  error.textContent = message;

  field.append(error);
}

/**
 * @param {HTMLInputElement} input
 */
function clearFieldError(input) {
  const field = input.closest(".field");
  if (!field) return;

  field.classList.remove("has-error");
  field.querySelector(".field-error")?.remove();
}

/**
 * Validates inputs
 * @param {HTMLInputElement} input
 * @returns {boolean}
 */
function validateRequired(input) {
  if (input.value.trim() !== "") return true;

  const label = input
    .closest(".field")
    ?.querySelector("label")
    ?.textContent?.trim();

  showFieldError(input, `O campo ${label ?? ""} precisa ser preenchido.`);
  return false;
}

/**
 * Toggles password visibility
 * @param {HTMLInputElement} passwordInput
 * @param {HTMLButtonElement} toggleButton
 */
function handleTogglePassword(passwordInput, toggleButton) {
  if (!passwordInput || !toggleButton) return;

  toggleButton.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";
    toggleButton.setAttribute(
      "aria-label",
      isPassword ? "Ocultar senha" : "Mostrar senha",
    );
  });
}

/**
 * Clears field errors
 * @param {HTMLInputElement[]} inputs
 */
function handleClearError(inputs) {
  inputs.forEach((input) => {
    if (!input) return;

    input.addEventListener("focus", () => clearFieldError(input));
    input.addEventListener("input", () => clearFieldError(input));
  });
}

/**
 * Registers form submission: validates the fields and calls the login route.
 * @param {HTMLButtonElement} submitBtn
 * @param {HTMLInputElement} usernameInput
 * @param {HTMLInputElement} passwordInput
 */
function onSubmit(submitBtn, usernameInput, passwordInput) {
  if (!submitBtn) return;

  submitBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const isValid =
      validateRequired(usernameInput) & validateRequired(passwordInput);

    if (!isValid) {
      showToast("Preencha os campos obrigatórios.", "warning");
      return;
    }

    try {
      const response = await login({
        username: usernameInput.value.trim(),
        password: passwordInput.value,
      });

      const result = await response.json();

      if (result.error) {
        showToast("Não foi possível realizar o login.", "error");
        return;
      }
      showToast("Login realizado com sucesso.", "success");
      sessionStorage.setItem("showWelcomeToast", "true");
      /* window.location.href = ""; */
    } catch (error) {
      console.error(error);
      showToast("Não foi possível realizar o login.", "error");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.querySelector(".toggle-password");
  const submitBtn = document.getElementById("submit-btn");

  handleTogglePassword(passwordInput, togglePassword);
  handleClearError([usernameInput, passwordInput]);
  onSubmit(submitBtn, usernameInput, passwordInput);
});

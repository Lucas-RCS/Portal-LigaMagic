import { LOGIN_URL, LOGOUT_URL } from "./routes.js";
import { jsonToFormData } from "../utils/functions.js";

/**
 * Sends the credentials to the login route.
 * @param {{ username: string, password: string }} credentials
 * @returns {Promise<Response>}
 */
export async function login({ username, password }) {
  const body = {
    login: username,
    pass: password,
  };

  try {
    const response = await fetch(LOGIN_URL, {
      method: "POST",
      body: jsonToFormData(body),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
}

/**
 * Ends the authenticated user's session.
 * @returns {Promise<Response>}
 */
export async function logout() {
  return fetch(LOGOUT_URL, { method: "POST" });
}

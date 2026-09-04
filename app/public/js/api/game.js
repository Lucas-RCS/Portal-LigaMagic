import { CARD_GAME_URL } from "./routes.js";

/**
 * @param {Response} response
 */
async function parseResponse(response) {
  const result = await response.json();

  if (result.error) {
    throw new Error(
      result.content?.message ?? "Erro ao processar a solicitação.",
    );
  }

  return result.content;
}

/**
 * @returns {Promise<{id: number, name: string}[]>}
 */
export async function fetchCardGames() {
  const response = await fetch(CARD_GAME_URL);
  const content = await parseResponse(response);

  return content.items;
}

/**
 * @param {number|string} gameId
 * @returns {Promise<{id: number, name: string}[]>}
 */
export async function fetchEditionsByGame(gameId) {
  const response = await fetch(
    `${CARD_GAME_URL}?game_id=${encodeURIComponent(gameId)}`,
  );
  const content = await parseResponse(response);

  return content.items;
}

import { CARD_URL } from "./routes.js";

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
 * Fetches the paginated list of cards
 * @param {{ q?: string, game_id?: string, edition_id?: string, rarity?: string, page?: number, per_page?: number }} [filters]
 */
export async function fetchCards(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, value);
    }
  });

  const response = await fetch(`${CARD_URL}?${params.toString()}`);
  return parseResponse(response);
}

/**
 * Fetches a specific card by id.
 * @param {number|string} id
 */
export async function fetchCard(id) {
  const response = await fetch(`${CARD_URL}?id=${encodeURIComponent(id)}`);
  return parseResponse(response);
}

/**
 * Create a new card.
 * @param {object} data
 */
export async function createCard(data) {
  const response = await fetch(CARD_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return parseResponse(response);
}

/**
 * Update an existing card.
 * @param {number|string} id
 * @param {object} data
 */
export async function updateCard(id, data) {
  const response = await fetch(`${CARD_URL}?id=${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return parseResponse(response);
}

/**
 * Delete a card by id.
 * @param {number|string} id
 */
export async function deleteCard(id) {
  const response = await fetch(`${CARD_URL}?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  return parseResponse(response);
}

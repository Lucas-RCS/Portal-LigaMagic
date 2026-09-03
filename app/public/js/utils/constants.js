export const RARITIES = [
  { id: "comum", label: "Comum", cssClass: "common" },
  { id: "incomum", label: "Incomum", cssClass: "uncommon" },
  { id: "rara", label: "Rara", cssClass: "rare" },
  { id: "mitica", label: "Mítica", cssClass: "mythic" },
  { id: "ultra-rara", label: "Ultra Rara", cssClass: "ultra" },
];

export const PAGE_SIZE = 5;

export function getRarity(id) {
  return RARITIES.find((rarity) => rarity.id === id) ?? null;
}

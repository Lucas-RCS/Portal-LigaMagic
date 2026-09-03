export function jsonToFormData(jsonObject) {
  const formData = new FormData();

  Object.entries(jsonObject).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return formData;
}

/**
 * Defers the execution of `fn` until `wait` ms have passed without new calls.
 * @param {Function} fn
 * @param {number} [wait=300]
 * @returns {Function}
 */
export function debounce(fn, wait = 300) {
  let timeoutId;

  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => fn(...args), wait);
  };
}

export function jsonToFormData(jsonObject) {
  const formData = new FormData();

  Object.entries(jsonObject).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return formData;
}

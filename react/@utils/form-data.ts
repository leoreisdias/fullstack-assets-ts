// HELPER FOR APPENDING DIFFERENT TYPES OF VALUES IN A FORM DATA

export function appendFormData(data: Record<string, any>): FormData {
  const formData = new globalThis.FormData();
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key as string, value);
      } else if (typeof value === "number" || typeof value === "boolean") {
        formData.append(key as string, value.toString());
      } else if (value instanceof Date) {
        formData.append(key as string, value.toISOString());
      } else if (Array.isArray(value)) {
        value.forEach((v) => {
          if (v instanceof File) {
            formData.append(`${key}[]`, v);
          } else if (typeof v === "object") {
            formData.append(`${key}[]`, JSON.stringify(v));
          } else {
            formData.append(`${key}[]`, v.toString());
          }
        });
      } else {
        formData.append(key as string, value as string);
      }
    }
  });
  return formData;
}

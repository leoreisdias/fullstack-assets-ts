export const convertQueryStringToObject = (queryString: string) => {
  const params = new URLSearchParams(queryString);

  const queryObject = params.entries();
  const newFilters: {
    [key: string]: string | string[];
  } = Object.fromEntries(queryObject);

  Object.entries(newFilters).forEach(([key, value]) => {
    if (key.includes("[]")) {
      delete newFilters[key];
      const newKey = key.replace("[]", "");
      newFilters[newKey] = (value as string).split(",");
    }
  });

  return newFilters;
};

export const convertObjectToQueryString = (
  filters: Record<string, string | string[]>
) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      params.set(`${key}[]`, value.join(","));
    } else params.set(key, value);
  });

  return params.toString();
};

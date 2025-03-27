export const convertObjectToQueryParams = (
  obj: Record<string, any>
): string => {
  return Object.entries(obj)
    .reduce((acc: string[], [key, value]) => {
      // Ignora valores undefined ou null
      if (value === undefined || value === null) return acc;
      const encodedKey = encodeURIComponent(key);

      // Se for array, mapeia cada item individualmente
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== undefined && item !== null) {
            acc.push(`${encodedKey}=${encodeURIComponent(item)}`);
          }
        });
      }
      // Se for objeto (exceto array), converte usando JSON.stringify
      else if (typeof value === "object") {
        acc.push(`${encodedKey}=${encodeURIComponent(JSON.stringify(value))}`);
      }
      // Caso padrão para string, número, boolean, etc.
      else {
        acc.push(`${encodedKey}=${encodeURIComponent(value)}`);
      }

      return acc;
    }, [])
    .join("&");
};

/*
// Exemplo de objeto para converter em query params
const exemploObjeto = {
  name: "Leo",
  age: 30,
  skills: ["TypeScript", "JavaScript"],
  details: { city: "São Paulo" },
  active: true,
  // Valores undefined e null serão ignorados:
  extra: undefined,
  missing: null
};

// Converte o objeto em string de query params
const queryParams = convertObjectToQueryParams(exemploObjeto);
console.log(queryParams);
// Saída esperada (a ordem dos parâmetros pode variar):
// name=Leo&age=30&skills=TypeScript&skills=JavaScript&details=%7B%22city%22%3A%22S%C3%A3o%20Paulo%22%7D&active=true
*/

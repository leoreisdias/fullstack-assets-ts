import { axios } from "axios";
import { createServerFetcher } from "./fetcher-sender";

// NOTE: It calls the API Route Handler (`/api/...`). Example in: `@nextjs/proxy-api-example`

export const mainApi = new Proxy({} as AxiosInstance, {
  // This 'get' trap intercepts ALL property access (get, post, put, delete, etc)
  get: (_, methodName: string) => {
    // Return async function that will be called when someone does mainApi.get(), mainApi.post(), etc
    return async (...args: any[]) => {
      // 1. Detect environment
      const isServer = typeof window === "undefined";

      // 2. Get the right axios instance (server or client)
      const instance = isServer ? 
        await createServerFetcher("") : 
        axios.create({
            baseUrl: ""
        });;

      // 3. Get the actual method from the instance (get, post, put, etc)
      const method = (instance as any)[methodName];

      // 4. If it's a function, call it with all the original arguments
      if (typeof method === "function") {
        return method.apply(instance, args);
      }

      // 5. If it's a property (like defaults, interceptors), just return it
      return method;
    };
  },
});

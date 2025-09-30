import { axios } from "axios";

export const proxyApi = axios.create({
    baseUrl: "/api/internal"
});

// NOTE: It calls the API Route Handler (`/api/...`). Example in: `@nextjs/proxy-api-example`
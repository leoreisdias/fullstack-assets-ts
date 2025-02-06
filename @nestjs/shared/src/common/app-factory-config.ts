/* 
Arquivo criado para casos de microservices, uma forma de centralizar as 
configurações de microservices, sua conexão, configurações de CORS, portas e nomes.
E usado o `startAllMicroservices` para que seja possivel inicia-los tambem como HTTP server.
*/

import { INestApplication } from "@nestjs/common";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

function getMicroserviceBaseUrl(serviceName: string) {
  const appBaseUrl = process.env[serviceName] || "";
  const baseUrl = appBaseUrl.split(":");

  const host = baseUrl[0];
  const port = +baseUrl[1];

  return {
    host,
    port,
  };
}

export async function handleAppConfigs(
  app: INestApplication,
  microserviceName: string
) {
  app.enableCors({
    origin: ["http://localhost:3000", "https://0.0.0.0:3000"],
    credentials: true,
  });

  // NOTE: If using Microservices
  const { host, port } = getMicroserviceBaseUrl(microserviceName);
  console.log("handleAppConfigs:host", host, port);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: host,
      port: port,
    },
  });
  await app.startAllMicroservices();

  // NOTE: Optional: Global Prefix
  // app.setGlobalPrefix('api/v1/app-service');

  // NOTE: Optional -> Max JSON limit issue
  // app.use(json({ limit: '50mb' }));
  // app.use(urlencoded({ extended: true, limit: '50mb' }));
}

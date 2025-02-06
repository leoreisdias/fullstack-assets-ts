import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from "@nestjs/microservices";
import { Observable, firstValueFrom } from "rxjs";
import { getMicroserviceBaseUrl } from "../../app-factory-config";
import { IOUploadDto } from "types/uploads/storage";
import { StorageFolders } from "types/enums/storage-containers";
import type { Express } from "express";

@Injectable()
export class IOMultipleFileInterceptor implements NestInterceptor {
  private client: ClientProxy;
  private data: Array<{ name: string }>;
  private containerName: StorageFolders;

  constructor(data: Array<{ name: string }>, containerName: StorageFolders) {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: getMicroserviceBaseUrl("UPLOAD").host,
        port: getMicroserviceBaseUrl("UPLOAD").port,
      },
    });
    this.data = data;
    this.containerName = containerName;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const files: Record<string, Array<Express.Multer.File>> = !!request.file
      ? [request.file]
      : request.files;

    if (!files || Object.keys(files).length === 0) {
      return next.handle();
    }
    // Envia cada arquivo para a API B e aguarda a resposta
    const response = await Promise.all(
      Object.keys(files).flatMap((key) =>
        files[key].map(async (file) => {
          const payload: IOUploadDto = {
            file: {
              type: "buffer",
              data: file.buffer,
            },
            folderName: this.containerName,
            fileName: file.originalname,
          };

          const response = await firstValueFrom(
            this.client.send("upload.file", payload)
          );
          return {
            key,
            response,
          };
        })
      )
    );

    const arrayResponse = {};

    this.data.forEach((item) => {
      console.log("item", item);
      arrayResponse[item.name] = response
        .filter((res) => res.key === item.name)
        .map((res) => res.response);

      // Salva as respostas no request para uso posterior
      request[item.name] = arrayResponse[item.name];
    });

    return next.handle();
  }
}

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
import { IOUploadDto } from "types/upload/storage";
import { StorageFolders } from "types/enums/storage-containers";

@Injectable()
export class IOFileInterceptor implements NestInterceptor {
  private client: ClientProxy;
  private fieldName: string;
  private containerName: StorageFolders;

  constructor(fieldName: string, containerName: StorageFolders) {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: getMicroserviceBaseUrl("UPLOAD").host,
        port: getMicroserviceBaseUrl("UPLOAD").port,
      },
    });
    this.fieldName = fieldName;
    this.containerName = containerName;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const files = !!request.file ? [request.file] : request.files;

    if (!files || files.length === 0) {
      return next.handle();
    }

    // Envia cada arquivo para a API B e aguarda a resposta
    const responses = await Promise.all(
      files.map((file) => {
        const payload: IOUploadDto = {
          file: file.buffer,
          folderName: this.containerName,
          fileName: file.originalname,
        };

        return firstValueFrom(this.client.send("upload.file", payload));
      })
    );

    // Salva as respostas no request para uso posterior
    request[this.fieldName] = responses.filter((response) => !!response);

    return next.handle();
  }
}

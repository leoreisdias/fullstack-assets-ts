import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

import { memoryStorage } from "multer";

export const multerConfig: MulterOptions = {
  storage: memoryStorage(), // Armazena o arquivo em memória para envio
};

// src/decorators/file-upload.decorator.ts
import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    UseInterceptors,
  } from '@nestjs/common';
  import {
    FilesInterceptor as NestFilesInterceptor,
    FileFieldsInterceptor,
  } from '@nestjs/platform-express';
  import { multerConfig } from '../uploads/multerConfig';
  import { IOFileInterceptor } from '../uploads/file-interceptor';
  import { StorageFolders } from 'types/enums/storage-containers';
  import { IOMultipleFileInterceptor } from '../uploads/multiple-file-interceptor';
  
  export function FileUpload(
    fieldName: string,
    containerName: StorageFolders,
    maxCount = 10,
  ) {
    return applyDecorators(
      UseInterceptors(
        NestFilesInterceptor(`${fieldName}[]`, maxCount, multerConfig),
        new IOFileInterceptor(fieldName, containerName),
      ),
    );
  }
  
  export function MultipleFileUpload(
    data: Array<{ name: string; maxCount: number }>,
    containerName: StorageFolders,
  ) {
    const formattedData = data.map(({ name, maxCount }) => ({
      name: `${name}[]`,
      maxCount,
    }));
  
    return applyDecorators(
      UseInterceptors(
        FileFieldsInterceptor(formattedData, multerConfig),
        new IOMultipleFileInterceptor(formattedData, containerName),
      ),
    );
  }
  
  export const Files = createParamDecorator(
    (name: string, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      const response = request[name] ?? request[`${name}[]`] ?? [];
  
      return response;
    },
  );
  

  /*
  USAGE: 

  @FileUpload('image', StorageFolders.AVATARS)
  async updateUser(@Files('image') image: IOUploadResponse[])

  OR

  @MultipleFileUpload(
    [
      { name: 'fileSign', maxCount: 1 },
      { name: 'file', maxCount: 10 },
    ],
    StorageFolders.CONTRACTS,
  )
  async createContract(
    @Files('file') file: IOUploadResponse[],
    @Files('fileSign') fileSign: IOUploadResponse[],
  ) 
  */
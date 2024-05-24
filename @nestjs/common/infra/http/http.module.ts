import { DynamicModule, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

interface HttpOptions {
  baseUrl: string;
}

@Module({
  imports: [],
  exports: [HttpModule],
})
export class HttpRequestModule {
  static register({ baseUrl }: HttpOptions): DynamicModule {
    return {
      module: HttpRequestModule,
      imports: [
        HttpModule.registerAsync({
          useFactory: () => ({
            baseURL: baseUrl,
            headers: {
              'Content-Type': 'application/json',
              'Accept-Encoding': '*',
            },
          }),
        }),
      ],
      exports: [HttpModule],
    };
  }
}

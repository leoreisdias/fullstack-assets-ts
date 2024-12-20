import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { formatDate } from '../utils/date';

const prismaExtendedClient = (prismaClient: PrismaClient) =>
  prismaClient.$extends({
    model: {
      // ...
    },
  });

type ExtendedPrismaClient = ReturnType<typeof prismaExtendedClient>;

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  readonly query: ExtendedPrismaClient = prismaExtendedClient(this); // for custom methods and attributes

  constructor() {
    super();

    return new Proxy(this, {
      get: (target, property) =>
        Reflect.get(property in this.query ? this.query : target, property),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

/*
Usage Example:

For default operations:
  `this.prismaService.myTable.findMany()`

Or for extended features:
  `this.prismaService.query.myTable.customMethod()`

*/

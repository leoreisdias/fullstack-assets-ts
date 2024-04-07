import { Prisma } from '@prisma/client';

export const myUseCaseSelector =
  Prisma.validator<Prisma.MyTableDefaultArgs>()({
    select: {
      // FIELDS
    },
  });

export type MyUseCase = Prisma.MyTableGetPayload<
  typeof myUseCaseSelector
>;

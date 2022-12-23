import { PrismaClient } from '@prisma/client';

const globalAny: any = global;

let prisma: PrismaClient | undefined | any;
const getPrismaClient = () => {
  if (!prisma && !globalAny.prisma) {
    prisma = new PrismaClient();
    globalAny.prisma = prisma;
  } else {
    prisma = globalAny.prisma;
  }
  return prisma;
};

export const db = getPrismaClient();

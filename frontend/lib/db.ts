// export const db = prisma;
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient | undefined;
const getPrismaClient = () => {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
};

export const db = getPrismaClient();

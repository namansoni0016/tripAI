import { PrismaClient } from "@prisma/client";

type GlobalThisWithPrisma = typeof globalThis & {
    prisma?: PrismaClient;
};

const globalWithPrisma = globalThis as GlobalThisWithPrisma;

export const db = globalWithPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalWithPrisma.prisma = db;
}
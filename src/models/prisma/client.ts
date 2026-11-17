import { AsyncLocalStorage } from "node:async_hooks";
import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const root =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = root;

const scope = new AsyncLocalStorage<Prisma.TransactionClient>();
export const prisma: PrismaClient = new Proxy(root, {
  get(target, key) {
    const current = scope.getStore();
    if (key === "$transaction")
      return (work: (tx: Prisma.TransactionClient) => Promise<unknown>) =>
        current
          ? work(current)
          : target.$transaction((tx) => scope.run(tx, () => work(tx)), {
              isolationLevel: "Serializable",
              timeout: 20000,
            });
    const client = current ?? target;
    const value = Reflect.get(client, key);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

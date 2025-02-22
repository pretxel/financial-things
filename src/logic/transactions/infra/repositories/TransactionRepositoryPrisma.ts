import { Transaction } from "../../domain/entities/Transaction";
import { PrismaClient } from "@prisma/client";
import { TransactionRepository } from "../../domain/repositories/TransactionRepository";
import { Service } from "diod";

const prisma = new PrismaClient();

@Service()
export class TransactionRepositoryPrisma implements TransactionRepository {
  async upsertTransaction(transaction: Transaction): Promise<void> {
    await prisma.transaction.upsert({
      where: { referenceId: transaction.referenceId },
      update: transaction,
      create: transaction,
    });
  }
}

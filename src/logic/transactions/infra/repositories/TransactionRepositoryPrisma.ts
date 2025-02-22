import { Transaction } from "../../domain/entities/Transaction";
import { PrismaClient, Transaction as TransactionPrisma } from "@prisma/client";
import { TransactionRepository } from "../../domain/repositories/TransactionRepository";
import { Service } from "diod";

const prisma = new PrismaClient();

@Service()
export class TransactionRepositoryPrisma implements TransactionRepository {
  async upsertTransaction(
    transaction: Transaction
  ): Promise<TransactionPrisma | undefined> {
    const existingTransaction = await prisma.transaction.findUnique({
      where: { referenceId: transaction.referenceId },
    });

    const transactionUpdated = await prisma.transaction.upsert({
      where: { referenceId: transaction.referenceId },
      update: transaction,
      create: transaction,
    });

    if (!existingTransaction) {
      return transactionUpdated;
    }
  }
}

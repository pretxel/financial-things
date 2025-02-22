import { Transaction } from "../entities/Transaction";
import { Transaction as TransactionPrisma } from "@prisma/client";

export abstract class TransactionRepository {
  abstract upsertTransaction(
    transaction: Transaction
  ): Promise<TransactionPrisma | undefined>;
}

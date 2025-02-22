import { Transaction } from "../entities/Transaction";

export abstract class TransactionRepository {
  abstract upsertTransaction(transaction: Transaction): Promise<void>;
}

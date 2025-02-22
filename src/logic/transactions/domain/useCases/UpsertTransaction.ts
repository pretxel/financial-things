import { Service } from "diod";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { ServiceTransaction, Transaction } from "../entities/Transaction";
import { TransactionDTO } from "../dtos/TransactionDTO";
@Service()
export class UpsertTransactionUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  private parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split("-");
    return new Date(`${year}-${month}-${day}`);
  }

  async execute(transactionDTO: TransactionDTO): Promise<void> {
    // Convert TransactionDTO to Transaction
    const transaction: Transaction = {
      amount: transactionDTO.amount,
      description: transactionDTO.description,
      operationDate: this.parseDate(transactionDTO.date2),
      referenceId: transactionDTO.transactionId,
      service: ServiceTransaction.SANTANDER,
    };

    await this.transactionRepository.upsertTransaction(transaction);
  }
}

import { Service } from "diod";
import { TransactionRepository } from "../repositories/TransactionRepository";
import { ServiceTransaction, Transaction } from "../entities/Transaction";
import { TransactionDTO } from "../dtos/TransactionDTO";
import { DocumentRepository } from "../repositories/DocumentRepository";
import { EmbeddingGenerator } from "../embeddings/EmbeddingGenerator";

@Service()
export class UpsertTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly documentRepository: DocumentRepository,
    private readonly embeddingGenerator: EmbeddingGenerator
  ) {}

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

    const transactionCreated =
      await this.transactionRepository.upsertTransaction(transaction);

    if (transactionCreated) {
      const content = `${transaction.description}, ${transaction.operationDate}, ${transaction.amount}`;
      const embedding = await this.embeddingGenerator.createEmbedding(content);

      if (!embedding) {
        return;
      }

      await this.documentRepository.insertDocument(embedding, content);
    }
  }
}

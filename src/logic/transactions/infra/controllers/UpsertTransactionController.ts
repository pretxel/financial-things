import { NextRequest, NextResponse } from "next/server";
import { container } from "../diod.config";
import { UpsertTransactionUseCase } from "../../domain/useCases/UpsertTransaction";
import { z } from "zod";
import { Service } from "diod";
import { TransactionDTO } from "../../domain/dtos/TransactionDTO";

const transactionSchema = z.object({
  amount: z.number(),
  description: z.string(),
  date2: z.string(),
  transactionId: z.string(),
});

const productSchema = z.object({
  transactions: z.array(transactionSchema).optional(),
});

const requestBodySchema = z.array(productSchema);

type TransactionDTOInfer = z.infer<typeof requestBodySchema>;

@Service()
export class UpsertTransactionController {
  private async validateRequestBody(request: NextRequest): Promise<{
    body: TransactionDTOInfer | null;
    response: NextResponse | null;
  }> {
    try {
      const body = await request.json();

      const parsedBody = requestBodySchema.parse(body);

      return { body: parsedBody, response: null };
    } catch (error: unknown) {
      return {
        body: null,
        response: NextResponse.json(
          { error: "Invalid request body", details: error },
          { status: 400 }
        ),
      };
    }
  }

  private readonly extractTransactionsFromBody = (
    body: TransactionDTOInfer
  ): TransactionDTO[] => {
    const transactionsToUpsert: TransactionDTO[] = [];

    for (const product of body) {
      if (
        !Array.isArray(product.transactions) ||
        product.transactions.length === 0
      ) {
        continue;
      }

      transactionsToUpsert.push(...product.transactions);
    }
    return transactionsToUpsert;
  };

  private readonly upsertTransactions = async (
    upsertTransactionUseCase: UpsertTransactionUseCase,
    transactionsToUpsert: TransactionDTO[]
  ): Promise<void> => {
    for (const transaction of transactionsToUpsert) {
      await upsertTransactionUseCase.execute(transaction);
    }
  };

  public async handle(request: NextRequest): Promise<NextResponse> {
    try {
      const upsertTransactionUseCase = container.get(UpsertTransactionUseCase);
      const { body, response } = await this.validateRequestBody(request);

      if (response || !body) {
        return response!;
      }

      const transactionsToUpsert = this.extractTransactionsFromBody(body);
      await this.upsertTransactions(
        upsertTransactionUseCase,
        transactionsToUpsert
      );

      return NextResponse.json(
        { message: "Request processed successfully", data: { items: 1 } },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error processing the request:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }
}

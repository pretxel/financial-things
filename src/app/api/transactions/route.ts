import "reflect-metadata";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { Auth } from "./Auth";
import { container } from "@/logic/transactions/infra/diod.config";
import { UpsertTransactionUseCase } from "@/logic/transactions/domain/useCases/UpsertTransaction";

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

async function validateRequestBody(request: NextRequest): Promise<{
  body: z.infer<typeof requestBodySchema> | null;
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

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const auth = new Auth();
    const upsertTransactionUseCase = container.get(UpsertTransactionUseCase);
    const tokenValidationResponse = await auth.validateToken(request);
    if (tokenValidationResponse) {
      return tokenValidationResponse;
    }

    const { body, response } = await validateRequestBody(request);
    if (response || !body) {
      return response!;
    }

    for (const product of body) {
      if (
        !Array.isArray(product.transactions) ||
        product.transactions.length === 0
      ) {
        continue;
      }
      for (const transaction of product.transactions) {
        console.log(transaction);
        await upsertTransactionUseCase.execute(transaction);
      }
    }

    return NextResponse.json(
      { message: "Request processed successfully", data: { items: 1 } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

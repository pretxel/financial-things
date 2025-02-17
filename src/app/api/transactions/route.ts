import { NextResponse, NextRequest } from "next/server";
import { PrismaClient, Transaction } from "@prisma/client";

const SECRET_KEY_API = process.env.SECRET_KEY_API;
const prisma = new PrismaClient();

async function validateToken(
  request: NextRequest
): Promise<NextResponse | null> {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "No valid token provided" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  if (token !== SECRET_KEY_API) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  return null;
}

async function validateRequestBody(
  request: NextRequest
): Promise<{ body: any; response: NextResponse | null }> {
  const body = await request.json();

  if (!body || Object.keys(body).length === 0) {
    return {
      body: null,
      response: NextResponse.json(
        { error: "No data provided in the request body" },
        { status: 400 }
      ),
    };
  }

  return { body, response: null };
}

function parseDate(dateString: string): Date {
  const [day, month, year] = dateString.split("-");
  return new Date(`${year}-${month}-${day}`);
}

async function saveTransaction(transaction: any) {
  if (!transaction.amount || !transaction.description || !transaction.date2) {
    throw new Error("Invalid transaction data");
  }

  const transactionRow: Omit<Transaction, "id"> = {
    amount: transaction.amount,
    description: transaction.description,
    operationDate: parseDate(transaction.date2),
    referenceId: transaction.transactionId,
    service: "SANTANDER",
  };

  try {
    await prisma.transaction.upsert({
      where: { referenceId: transaction.transactionId },
      update: transactionRow,
      create: transactionRow,
    });
  } catch (error) {
    console.error("Error saving transaction:", error);
    throw new Error("Error saving transaction");
  }
}

export async function POST(request: NextRequest) {
  try {
    const tokenValidationResponse = await validateToken(request);
    if (tokenValidationResponse) {
      return tokenValidationResponse;
    }

    const { body, response } = await validateRequestBody(request);
    if (response) {
      return response;
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
        await saveTransaction(transaction);
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

import "reflect-metadata";
import { NextResponse, NextRequest } from "next/server";
import { container } from "@/logic/transactions/infra/diod.config";
import { UpsertTransactionController } from "@/logic/transactions/infra/controllers/UpsertTransactionController";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const upsertTransactionController = container.get(
      UpsertTransactionController
    );
    return await upsertTransactionController.handle(request);
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { ContainerBuilder } from "diod";
import { TransactionRepositoryPrisma } from "./repositories/TransactionRepositoryPrisma";
import { TransactionRepository } from "../domain/repositories/TransactionRepository";
import { UpsertTransactionUseCase } from "../domain/useCases/UpsertTransaction";

const builder = new ContainerBuilder();

builder.register(TransactionRepository).use(TransactionRepositoryPrisma);
builder.registerAndUse(UpsertTransactionUseCase);
export const container = builder.build();

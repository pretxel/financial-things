import { ContainerBuilder } from "diod";
import { TransactionRepositoryPrisma } from "./repositories/TransactionRepositoryPrisma";
import { TransactionRepository } from "../domain/repositories/TransactionRepository";
import { UpsertTransactionUseCase } from "../domain/useCases/UpsertTransaction";
import { UpsertTransactionController } from "./controllers/UpsertTransactionController";
import { DocumentRepository } from "../domain/repositories/DocumentRepository";
import { DocumentRepositoryPostgres } from "./repositories/DocumentRepositoryPostgres";
import { EmbeddingGenerator } from "../domain/embeddings/EmbeddingGenerator";
import { EmbaddingGeneratorOllama } from "./embeddings/EmbeddingGeneratorOllama";

const builder = new ContainerBuilder();

builder.register(TransactionRepository).use(TransactionRepositoryPrisma);
builder.register(DocumentRepository).use(DocumentRepositoryPostgres);
builder.register(EmbeddingGenerator).use(EmbaddingGeneratorOllama);
builder.registerAndUse(UpsertTransactionUseCase);
builder.registerAndUse(UpsertTransactionController);
export const container = builder.build();

export abstract class EmbeddingGenerator {
  abstract createEmbedding(text: string): Promise<string | null>;
}

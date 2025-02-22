import { Service } from "diod";
import { EmbeddingGenerator } from "../../domain/embeddings/EmbeddingGenerator";
import { OllamaEmbeddings } from "@langchain/ollama";
@Service()
export class EmbaddingGeneratorOllama implements EmbeddingGenerator {
  async createEmbedding(content: string): Promise<string | null> {
    try {
      const embeddingsGenerator = new OllamaEmbeddings({
        model: "nomic-embed-text",
        baseUrl: "http://localhost:11434",
      });

      const embedding = `[${(
        await embeddingsGenerator.embedQuery(content)
      ).join(",")}]`;

      return embedding;
    } catch (e) {
      console.warn(e);
      return null;
    }
  }
}

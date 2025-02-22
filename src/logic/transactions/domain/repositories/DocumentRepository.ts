export abstract class DocumentRepository {
  abstract insertDocument(embedding: string, content: string): Promise<void>;
}

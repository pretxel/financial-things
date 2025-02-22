import { Service } from "diod";
import { DocumentRepository } from "../../domain/repositories/DocumentRepository";
import postgres from "postgres";
import { randomUUID } from "crypto";
@Service()
export class DocumentRepositoryPostgres implements DocumentRepository {
  async insertDocument(embedding: string, content: string): Promise<void> {
    const sql = postgres(process.env.DATABASE_URL as string);

    await sql`
			INSERT INTO Document (id, content, vector)
			VALUES (
                ${randomUUID()},
                ${content},
				${embedding}
			)
		`;
  }
}

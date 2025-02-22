import { RagAgentUseCase } from "../RagAgent";

describe("RagAgent", () => {
  it("should process", async () => {
    const rag = new RagAgentUseCase();
    rag.execute();
  });
});

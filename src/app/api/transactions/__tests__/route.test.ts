import "reflect-metadata";
import { NextRequest } from "next/server";
import { POST } from "../route";
import { Auth } from "../Auth";

describe("POST /api/transactions", () => {
  it("should process transactions and return success when token and body are valid", async () => {
    const mockRequest = new NextRequest("http://localhost", {
      method: "POST",
      headers: {
        Authorization: "Bearer valid-token",
      },
    });

    const mockBody = [
      {
        transactions: [
          {
            amount: 100,
            description: "Test",
            date2: "2023-01-01",
            transactionId: "123",
          },
        ],
      },
    ];

    jest.spyOn(mockRequest, "json").mockResolvedValue(mockBody);
    jest
      .spyOn(Auth.prototype, "getSecretKey")
      .mockImplementation(() => "valid-token");

    const response = await POST(mockRequest);
    const responseData = await response.json();

    expect(response.status).toBe(200);
    expect(responseData).toEqual({
      message: "Request processed successfully",
      data: { items: 1 },
    });
  });
});

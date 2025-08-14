import { describe, it, expect } from "vitest";
import { resultUtil } from "./result.utils";

describe("resultUtil", () => {
  describe("success", () => {
    it("should create a success result with default status 200 and no data", () => {
      const result = resultUtil.success();

      expect(result).toEqual({
        ok: true,
        status: 200,
        data: undefined,
      });
      expect(result.ok).toBe(true);
      expect(result.status).toBe(200);
    });
  });

  describe("type safety and integration", () => {
    it("should maintain type safety for success results", () => {
      interface User {
        id: number;
        name: string;
        email: string;
      }

      const user: User = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
      };

      const result = resultUtil.success(200, user);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.id).toBe(1);
        expect(result.data.name).toBe("John Doe");
        expect(result.data.email).toBe("john@example.com");
      }
    });

    it("should maintain type safety for error results", () => {
      interface ValidationError {
        code: string;
        message: string;
        field: string;
      }

      const validationError: ValidationError = {
        code: "INVALID_EMAIL",
        message: "Email format is invalid",
        field: "email",
      };

      const result = resultUtil.error(400, validationError);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("INVALID_EMAIL");
        expect(result.error.message).toBe("Email format is invalid");
        expect(result.error.field).toBe("email");
      }
    });

    it("should handle success and error results in the same context", () => {
      const successResult = resultUtil.success(200, { message: "OK" });
      const errorResult = resultUtil.error(400, "Bad Request");

      expect(successResult.ok).toBe(true);
      expect(errorResult.ok).toBe(false);

      if (successResult.ok) {
        expect(successResult.data.message).toBe("OK");
      }

      if (!errorResult.ok) {
        expect(errorResult.error).toBe("Bad Request");
      }
    });
  });
});

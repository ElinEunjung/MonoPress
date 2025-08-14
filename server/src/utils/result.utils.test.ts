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

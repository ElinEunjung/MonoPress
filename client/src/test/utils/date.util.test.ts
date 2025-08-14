import { describe, it, expect } from "vitest";
import { formatNorwegianDate } from "../../utils/date.util";

describe("formatNorwegianDate", () => {
  describe("valid dates", () => {
    it("should format a standard date in Norwegian format", () => {
      const date = new Date("2025-08-15T10:30:00Z");
      const result = formatNorwegianDate(date);

      expect(result).toBe("15.8.2025");
    });
  });
});

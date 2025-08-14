import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { JwtTokenHelper } from "./jwt-token.helper";

// Mock dependencies
vi.mock("jsonwebtoken");
vi.mock("crypto");
vi.mock("../../../../../constants/auth/global-jwt-token", () => ({
  JWT_SECRET: "test-secret-key",
}));

describe("JwtTokenHelper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("create", () => {
    it("should create a JWT token with default options", () => {
      const mockPayload = { userId: "123", email: "test@example.com" };
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mocktoken";

      (jwt.sign as any).mockReturnValue(mockToken);

      const result = JwtTokenHelper.create(mockPayload);

      expect(jwt.sign).toHaveBeenCalledWith(mockPayload, "test-secret-key", {
        expiresIn: "3h",
      });
      expect(result).toBe(mockToken);
    });

    it("should create a JWT token with custom options", () => {
      const mockPayload = { userId: "456", role: "admin" };
      const customOptions = { expiresIn: "24h" as const, issuer: "test-app" };
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.customtoken";

      (jwt.sign as any).mockReturnValue(mockToken);

      const result = JwtTokenHelper.create(mockPayload, customOptions);

      expect(jwt.sign).toHaveBeenCalledWith(
        mockPayload,
        "test-secret-key",
        customOptions
      );
      expect(result).toBe(mockToken);
    });

    it("should create a JWT token with empty payload", () => {
      const mockPayload = {};
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.emptytoken";

      (jwt.sign as any).mockReturnValue(mockToken);

      const result = JwtTokenHelper.create(mockPayload);

      expect(jwt.sign).toHaveBeenCalledWith(mockPayload, "test-secret-key", {
        expiresIn: "3h",
      });
      expect(result).toBe(mockToken);
    });

    it("should create a JWT token with complex payload", () => {
      const mockPayload = {
        userId: "789",
        email: "complex@example.com",
        roles: ["user", "editor"],
        metadata: {
          createdAt: "2025-01-01",
          lastLogin: "2025-01-15",
        },
      };
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.complextoken";

      (jwt.sign as any).mockReturnValue(mockToken);

      const result = JwtTokenHelper.create(mockPayload);

      expect(jwt.sign).toHaveBeenCalledWith(mockPayload, "test-secret-key", {
        expiresIn: "3h",
      });
      expect(result).toBe(mockToken);
    });

    it("should handle jwt.sign errors", () => {
      const mockPayload = { userId: "123" };
      const error = new Error("JWT signing failed");

      (jwt.sign as any).mockImplementation(() => {
        throw error;
      });

      expect(() => JwtTokenHelper.create(mockPayload)).toThrow(
        "JWT signing failed"
      );
      expect(jwt.sign).toHaveBeenCalledWith(mockPayload, "test-secret-key", {
        expiresIn: "3h",
      });
    });

    it("should create token with different expiration times", () => {
      const mockPayload = { userId: "123" };
      const shortToken = "short-token";
      const longToken = "long-token";

      (jwt.sign as any)
        .mockReturnValueOnce(shortToken)
        .mockReturnValueOnce(longToken);

      const shortResult = JwtTokenHelper.create(mockPayload, {
        expiresIn: "1h" as const,
      });
      const longResult = JwtTokenHelper.create(mockPayload, {
        expiresIn: "7d" as const,
      });

      expect(jwt.sign).toHaveBeenNthCalledWith(
        1,
        mockPayload,
        "test-secret-key",
        { expiresIn: "1h" }
      );
      expect(jwt.sign).toHaveBeenNthCalledWith(
        2,
        mockPayload,
        "test-secret-key",
        { expiresIn: "7d" }
      );
      expect(shortResult).toBe(shortToken);
      expect(longResult).toBe(longToken);
    });
  });

  describe("verifyAndDecrypt", () => {
    it("should verify and decrypt a valid JWT token", () => {
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.validtoken";
      const mockDecodedPayload = {
        userId: "123",
        email: "test@example.com",
        exp: 1234567890,
      };

      (jwt.verify as any).mockReturnValue(mockDecodedPayload);

      const result =
        JwtTokenHelper.verifyAndDecrypt<typeof mockDecodedPayload>(mockToken);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, "test-secret-key");
      expect(result).toEqual(mockDecodedPayload);
    });

    it("should verify and decrypt a token with complex payload", () => {
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.complextoken";
      const mockDecodedPayload = {
        userId: "456",
        email: "complex@example.com",
        roles: ["admin", "user"],
        metadata: { createdAt: "2025-01-01" },
        exp: 1234567890,
      };

      (jwt.verify as any).mockReturnValue(mockDecodedPayload);

      const result =
        JwtTokenHelper.verifyAndDecrypt<typeof mockDecodedPayload>(mockToken);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, "test-secret-key");
      expect(result).toEqual(mockDecodedPayload);
    });

    it("should handle expired token error", () => {
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.expiredtoken";
      const error = new jwt.TokenExpiredError("jwt expired", new Date());

      (jwt.verify as any).mockImplementation(() => {
        throw error;
      });

      expect(() => JwtTokenHelper.verifyAndDecrypt(mockToken)).toThrow();
      expect(jwt.verify).toHaveBeenCalledWith(mockToken, "test-secret-key");
    });

    it("should handle invalid token error", () => {
      const mockToken = "invalid.token.format";
      const error = new jwt.JsonWebTokenError("invalid token");

      (jwt.verify as any).mockImplementation(() => {
        throw error;
      });

      expect(() => JwtTokenHelper.verifyAndDecrypt(mockToken)).toThrow();
      expect(jwt.verify).toHaveBeenCalledWith(mockToken, "test-secret-key");
    });

    it("should handle malformed token error", () => {
      const mockToken = "malformed-token";
      const error = new jwt.JsonWebTokenError("jwt malformed");

      (jwt.verify as any).mockImplementation(() => {
        throw error;
      });

      expect(() => JwtTokenHelper.verifyAndDecrypt(mockToken)).toThrow();
      expect(jwt.verify).toHaveBeenCalledWith(mockToken, "test-secret-key");
    });

    it("should handle signature verification failure", () => {
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidsignature";
      const error = new jwt.JsonWebTokenError("invalid signature");

      (jwt.verify as any).mockImplementation(() => {
        throw error;
      });

      expect(() => JwtTokenHelper.verifyAndDecrypt(mockToken)).toThrow();
      expect(jwt.verify).toHaveBeenCalledWith(mockToken, "test-secret-key");
    });

    it("should return correct type for typed verification", () => {
      interface CustomPayload {
        userId: string;
        role: string;
        permissions: string[];
      }

      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.typedtoken";
      const mockDecodedPayload: CustomPayload = {
        userId: "789",
        role: "editor",
        permissions: ["read", "write"],
      };

      (jwt.verify as any).mockReturnValue(mockDecodedPayload);

      const result = JwtTokenHelper.verifyAndDecrypt<CustomPayload>(mockToken);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, "test-secret-key");
      expect(result).toEqual(mockDecodedPayload);
      expect(result.userId).toBe("789");
      expect(result.role).toBe("editor");
      expect(result.permissions).toEqual(["read", "write"]);
    });
  });

  describe("generateRandomAccessToken", () => {
    it("should generate a random access token", () => {
      const mockRandomBytes = Buffer.from(
        "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        "hex"
      );
      const expectedToken =
        "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";

      (randomBytes as any).mockReturnValue(mockRandomBytes);

      const result = JwtTokenHelper.generateRandomAccessToken();

      expect(randomBytes).toHaveBeenCalledWith(32);
      expect(result).toBe(expectedToken);
    });

    it("should generate different tokens on subsequent calls", () => {
      const mockRandomBytes1 = Buffer.from(
        "1111111111111111222222222222222233333333333333334444444444444444",
        "hex"
      );
      const mockRandomBytes2 = Buffer.from(
        "5555555555555555666666666666666677777777777777778888888888888888",
        "hex"
      );

      (randomBytes as any)
        .mockReturnValueOnce(mockRandomBytes1)
        .mockReturnValueOnce(mockRandomBytes2);

      const token1 = JwtTokenHelper.generateRandomAccessToken();
      const token2 = JwtTokenHelper.generateRandomAccessToken();

      expect(randomBytes).toHaveBeenCalledTimes(2);
      expect(randomBytes).toHaveBeenNthCalledWith(1, 32);
      expect(randomBytes).toHaveBeenNthCalledWith(2, 32);
      expect(token1).not.toBe(token2);
    });

    it("should generate a 64-character hex string", () => {
      const mockRandomBytes = Buffer.from("abcdef1234567890".repeat(4), "hex");

      (randomBytes as any).mockReturnValue(mockRandomBytes);

      const result = JwtTokenHelper.generateRandomAccessToken();

      expect(randomBytes).toHaveBeenCalledWith(32);
      expect(result).toHaveLength(64);
      expect(result).toMatch(/^[a-f0-9]{64}$/);
    });

    it("should handle crypto.randomBytes errors", () => {
      const error = new Error("Random bytes generation failed");

      (randomBytes as any).mockImplementation(() => {
        throw error;
      });

      expect(() => JwtTokenHelper.generateRandomAccessToken()).toThrow(
        "Random bytes generation failed"
      );
      expect(randomBytes).toHaveBeenCalledWith(32);
    });

    it("should generate tokens with different patterns", () => {
      const patterns = [
        Buffer.from(
          "0000000000000000000000000000000000000000000000000000000000000000",
          "hex"
        ),
        Buffer.from(
          "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          "hex"
        ),
        Buffer.from(
          "123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0",
          "hex"
        ),
      ];

      patterns.forEach((pattern, index) => {
        (randomBytes as any).mockReturnValueOnce(pattern);

        const result = JwtTokenHelper.generateRandomAccessToken();

        expect(result).toHaveLength(64);
        expect(result).toMatch(/^[a-f0-9]{64}$/);
      });

      expect(randomBytes).toHaveBeenCalledTimes(3);
    });
  });

  describe("integration scenarios", () => {
    it("should create and verify token in a complete flow", () => {
      const originalPayload = { userId: "123", email: "test@example.com" };
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.integrationtoken";
      const mockVerifiedPayload = {
        ...originalPayload,
        exp: 1234567890,
        iat: 1234564290,
      };

      (jwt.sign as any).mockReturnValue(mockToken);
      (jwt.verify as any).mockReturnValue(mockVerifiedPayload);

      const createdToken = JwtTokenHelper.create(originalPayload);
      const verifiedPayload =
        JwtTokenHelper.verifyAndDecrypt<typeof mockVerifiedPayload>(
          createdToken
        );

      expect(createdToken).toBe(mockToken);
      expect(verifiedPayload.userId).toBe(originalPayload.userId);
      expect(verifiedPayload.email).toBe(originalPayload.email);
    });

    it("should handle token creation with access token", () => {
      const mockAccessToken =
        "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890";
      const mockRandomBytes = Buffer.from(
        "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        "hex"
      );
      const mockJwtToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.accesstoken";

      (randomBytes as any).mockReturnValue(mockRandomBytes);
      (jwt.sign as any).mockReturnValue(mockJwtToken);

      const accessToken = JwtTokenHelper.generateRandomAccessToken();
      const payload = { userId: "123", accessToken };
      const jwtToken = JwtTokenHelper.create(payload);

      expect(accessToken).toBe(mockAccessToken);
      expect(jwtToken).toBe(mockJwtToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: "123", accessToken: mockAccessToken },
        "test-secret-key",
        { expiresIn: "3h" }
      );
    });
  });

  describe("edge cases", () => {
    it("should handle null payload gracefully", () => {
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.nulltoken";

      (jwt.sign as any).mockReturnValue(mockToken);

      const result = JwtTokenHelper.create(null as any);

      expect(jwt.sign).toHaveBeenCalledWith(null, "test-secret-key", {
        expiresIn: "3h",
      });
      expect(result).toBe(mockToken);
    });

    it("should handle undefined payload gracefully", () => {
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.undefinedtoken";

      (jwt.sign as any).mockReturnValue(mockToken);

      const result = JwtTokenHelper.create(undefined as any);

      expect(jwt.sign).toHaveBeenCalledWith(undefined, "test-secret-key", {
        expiresIn: "3h",
      });
      expect(result).toBe(mockToken);
    });

    it("should handle empty string token verification", () => {
      const error = new jwt.JsonWebTokenError("jwt must be provided");

      (jwt.verify as any).mockImplementation(() => {
        throw error;
      });

      expect(() => JwtTokenHelper.verifyAndDecrypt("")).toThrow();
      expect(jwt.verify).toHaveBeenCalledWith("", "test-secret-key");
    });

    it("should handle very large payload", () => {
      const largePayload = {
        userId: "123",
        data: "x".repeat(10000),
        metadata: Array(1000).fill({ key: "value" }),
      };
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.largetoken";

      (jwt.sign as any).mockReturnValue(mockToken);

      const result = JwtTokenHelper.create(largePayload);

      expect(jwt.sign).toHaveBeenCalledWith(largePayload, "test-secret-key", {
        expiresIn: "3h",
      });
      expect(result).toBe(mockToken);
    });
  });
});

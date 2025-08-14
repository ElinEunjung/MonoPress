import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { userSchemaModel } from "../../models/users/user.mongoose";
import { USER_POLICY } from "../../routes/auth/auth-googles/constants/user-policy.constant";
import { USER_ROLE } from "../../routes/auth/auth-googles/constants/user-role.constant";
import { userService } from "./user.service";

// Mock the mongoose model
vi.mock("../../models/users/user.mongoose", () => ({
  userSchemaModel: {
    findOne: vi.fn(),
    updateOne: vi.fn(),
    insertOne: vi.fn(),
  },
}));

// Mock the JWT payload factory
vi.mock(
  "../../routes/auth/auth-googles/helpers/create-jwt-user-payload-factory"
);

describe("userService", () => {
  const mockUser = {
    _id: "mockUserId",
    accessToken: "mock-access-token",
    googleId: "mock-google-id",
    email: "test@example.com",
    name: "Test User",
    picture: "https://example.com/picture.jpg",
    status: "active",
    resources: {
      role: USER_ROLE.Editor,
      policy: {
        article: {
          reaction: [USER_POLICY.READ, USER_POLICY.UPDATE],
          comments: [
            USER_POLICY.READ,
            USER_POLICY.WRITE,
            USER_POLICY.DELETE,
            USER_POLICY.UPDATE,
          ],
        },
      },
    },
  };

  const mockUserPayload = {
    accessToken: "new-access-token",
    name: "New User",
    email: "newuser@example.com",
    picture: "https://example.com/newpicture.jpg",
    googleId: "new-google-id",
    resources: {
      role: USER_ROLE.NoneEditor,
      policy: {
        article: {
          reaction: [USER_POLICY.READ, USER_POLICY.UPDATE],
          comments: [
            USER_POLICY.READ,
            USER_POLICY.WRITE,
            USER_POLICY.DELETE,
            USER_POLICY.UPDATE,
          ],
        },
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("findUserByAccessToken", () => {
    it("should find a user by access token", async () => {
      // Arrange
      const accessToken = "test-access-token";
      vi.mocked(userSchemaModel.findOne).mockResolvedValue(mockUser);

      // Act
      const result = await userService.findUserByAccessToken(accessToken);

      // Assert
      expect(userSchemaModel.findOne).toHaveBeenCalledWith({ accessToken });
      expect(result).toEqual(mockUser);
    });

    it("should return null when user is not found by access token", async () => {
      // Arrange
      const accessToken = "non-existent-token";
      vi.mocked(userSchemaModel.findOne).mockResolvedValue(null);

      // Act
      const result = await userService.findUserByAccessToken(accessToken);

      // Assert
      expect(userSchemaModel.findOne).toHaveBeenCalledWith({ accessToken });
      expect(result).toBeNull();
    });

    it("should handle errors when finding user by access token", async () => {
      // Arrange
      const accessToken = "test-access-token";
      const error = new Error("Database error");
      vi.mocked(userSchemaModel.findOne).mockRejectedValue(error);

      // Act & Assert
      await expect(
        userService.findUserByAccessToken(accessToken)
      ).rejects.toThrow("Database error");
      expect(userSchemaModel.findOne).toHaveBeenCalledWith({ accessToken });
    });
  });

  describe("findUserByGoogleId", () => {
    it("should find a user by Google ID", async () => {
      // Arrange
      const googleId = "test-google-id";
      vi.mocked(userSchemaModel.findOne).mockResolvedValue(mockUser);

      // Act
      const result = await userService.findUserByGoogleId(googleId);

      // Assert
      expect(userSchemaModel.findOne).toHaveBeenCalledWith({ googleId });
      expect(result).toEqual(mockUser);
    });

    it("should return null when user is not found by Google ID", async () => {
      // Arrange
      const googleId = "non-existent-google-id";
      vi.mocked(userSchemaModel.findOne).mockResolvedValue(null);

      // Act
      const result = await userService.findUserByGoogleId(googleId);

      // Assert
      expect(userSchemaModel.findOne).toHaveBeenCalledWith({ googleId });
      expect(result).toBeNull();
    });

    it("should handle errors when finding user by Google ID", async () => {
      // Arrange
      const googleId = "test-google-id";
      const error = new Error("Database error");
      vi.mocked(userSchemaModel.findOne).mockRejectedValue(error);

      // Act & Assert
      await expect(userService.findUserByGoogleId(googleId)).rejects.toThrow(
        "Database error"
      );
      expect(userSchemaModel.findOne).toHaveBeenCalledWith({ googleId });
    });
  });

  describe("updateUserAccessToken", () => {
    it("should update user access token successfully", async () => {
      // Arrange
      const googleId = "test-google-id";
      const accessToken = "new-access-token";
      const mockUpdateResult = {
        acknowledged: true,
        modifiedCount: 1,
        upsertedId: null,
        upsertedCount: 0,
        matchedCount: 1,
      };
      vi.mocked(userSchemaModel.updateOne).mockResolvedValue(mockUpdateResult);

      // Act
      const result = await userService.updateUserAccessToken(
        googleId,
        accessToken
      );

      // Assert
      expect(userSchemaModel.updateOne).toHaveBeenCalledWith(
        { googleId },
        { $set: { accessToken } }
      );
      expect(result).toEqual(mockUpdateResult);
    });

    it("should return update result with no modifications when user is not found", async () => {
      // Arrange
      const googleId = "non-existent-google-id";
      const accessToken = "new-access-token";
      const mockUpdateResult = {
        acknowledged: true,
        modifiedCount: 0,
        upsertedId: null,
        upsertedCount: 0,
        matchedCount: 0,
      };
      vi.mocked(userSchemaModel.updateOne).mockResolvedValue(mockUpdateResult);

      // Act
      const result = await userService.updateUserAccessToken(
        googleId,
        accessToken
      );

      // Assert
      expect(userSchemaModel.updateOne).toHaveBeenCalledWith(
        { googleId },
        { $set: { accessToken } }
      );
      expect(result.modifiedCount).toBe(0);
      expect(result.matchedCount).toBe(0);
    });

    it("should handle errors when updating user access token", async () => {
      // Arrange
      const googleId = "test-google-id";
      const accessToken = "new-access-token";
      const error = new Error("Database error");
      vi.mocked(userSchemaModel.updateOne).mockRejectedValue(error);

      // Act & Assert
      await expect(
        userService.updateUserAccessToken(googleId, accessToken)
      ).rejects.toThrow("Database error");
      expect(userSchemaModel.updateOne).toHaveBeenCalledWith(
        { googleId },
        { $set: { accessToken } }
      );
    });
  });

  describe("insertUser", () => {
    it("should insert a new user successfully", async () => {
      // Arrange
      const mockInsertedUser = {
        _id: "new-user-id",
        ...mockUserPayload,
        __v: 0,
        toObject: vi.fn(),
        toJSON: vi.fn(),
      };
      vi.mocked(userSchemaModel.insertOne).mockResolvedValue(
        mockInsertedUser as any
      );

      // Act
      const result = await userService.insertUser(mockUserPayload);

      // Assert
      expect(userSchemaModel.insertOne).toHaveBeenCalledWith(mockUserPayload);
      expect(result).toEqual(mockInsertedUser);
    });

    it("should handle validation errors when inserting user", async () => {
      // Arrange
      const invalidPayload = { ...mockUserPayload, email: "" }; // Invalid email
      const error = new Error("Validation error: email is required");
      vi.mocked(userSchemaModel.insertOne).mockRejectedValue(error);

      // Act & Assert
      await expect(userService.insertUser(invalidPayload)).rejects.toThrow(
        "Validation error: email is required"
      );
      expect(userSchemaModel.insertOne).toHaveBeenCalledWith(invalidPayload);
    });

    it("should handle duplicate key errors when inserting user", async () => {
      // Arrange
      const error = new Error("Duplicate key error");
      vi.mocked(userSchemaModel.insertOne).mockRejectedValue(error);

      // Act & Assert
      await expect(userService.insertUser(mockUserPayload)).rejects.toThrow(
        "Duplicate key error"
      );
      expect(userSchemaModel.insertOne).toHaveBeenCalledWith(mockUserPayload);
    });
  });

  describe("updateUser", () => {
    it("should update user successfully", async () => {
      // Arrange
      const googleId = "test-google-id";
      const mockUpdateResult = {
        acknowledged: true,
        modifiedCount: 1,
        upsertedId: null,
        upsertedCount: 0,
        matchedCount: 1,
      };
      vi.mocked(userSchemaModel.updateOne).mockResolvedValue(mockUpdateResult);

      // Act
      const result = await userService.updateUser(googleId, mockUserPayload);

      // Assert
      expect(userSchemaModel.updateOne).toHaveBeenCalledWith(
        { googleId },
        { $set: { ...mockUserPayload } }
      );
      expect(result).toEqual(mockUpdateResult);
    });

    it("should return update result with no modifications when user is not found", async () => {
      // Arrange
      const googleId = "non-existent-google-id";
      const mockUpdateResult = {
        acknowledged: true,
        modifiedCount: 0,
        upsertedId: null,
        upsertedCount: 0,
        matchedCount: 0,
      };
      vi.mocked(userSchemaModel.updateOne).mockResolvedValue(mockUpdateResult);

      // Act
      const result = await userService.updateUser(googleId, mockUserPayload);

      // Assert
      expect(userSchemaModel.updateOne).toHaveBeenCalledWith(
        { googleId },
        { $set: { ...mockUserPayload } }
      );
      expect(result.modifiedCount).toBe(0);
      expect(result.matchedCount).toBe(0);
    });

    it("should handle validation errors when updating user", async () => {
      // Arrange
      const googleId = "test-google-id";
      const invalidPayload = {
        ...mockUserPayload,
        resources: {
          role: "invalid-role",
          policy: {
            article: {
              reaction: [USER_POLICY.READ, USER_POLICY.UPDATE],
              comments: [
                USER_POLICY.READ,
                USER_POLICY.WRITE,
                USER_POLICY.DELETE,
                USER_POLICY.UPDATE,
              ],
            },
          },
        },
      };
      const error = new Error("Validation error: invalid role");
      vi.mocked(userSchemaModel.updateOne).mockRejectedValue(error);

      // Act & Assert
      await expect(
        userService.updateUser(googleId, invalidPayload)
      ).rejects.toThrow("Validation error: invalid role");
      expect(userSchemaModel.updateOne).toHaveBeenCalledWith(
        { googleId },
        { $set: { ...invalidPayload } }
      );
    });

    it("should handle database errors when updating user", async () => {
      // Arrange
      const googleId = "test-google-id";
      const error = new Error("Database connection error");
      vi.mocked(userSchemaModel.updateOne).mockRejectedValue(error);

      // Act & Assert
      await expect(
        userService.updateUser(googleId, mockUserPayload)
      ).rejects.toThrow("Database connection error");
      expect(userSchemaModel.updateOne).toHaveBeenCalledWith(
        { googleId },
        { $set: { ...mockUserPayload } }
      );
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle empty string parameters gracefully", async () => {
      // Arrange
      vi.mocked(userSchemaModel.findOne).mockResolvedValue(null);

      // Act
      const result1 = await userService.findUserByAccessToken("");
      const result2 = await userService.findUserByGoogleId("");

      // Assert
      expect(result1).toBeNull();
      expect(result2).toBeNull();
      expect(userSchemaModel.findOne).toHaveBeenCalledWith({ accessToken: "" });
      expect(userSchemaModel.findOne).toHaveBeenCalledWith({ googleId: "" });
    });

    it("should handle null parameters gracefully", async () => {
      // Arrange
      vi.mocked(userSchemaModel.findOne).mockResolvedValue(null);

      // Act & Assert
      await expect(
        userService.findUserByAccessToken(null as any)
      ).resolves.toBeNull();
      await expect(
        userService.findUserByGoogleId(null as any)
      ).resolves.toBeNull();
    });

    it("should handle undefined parameters gracefully", async () => {
      // Arrange
      vi.mocked(userSchemaModel.findOne).mockResolvedValue(null);

      // Act & Assert
      await expect(
        userService.findUserByAccessToken(undefined as any)
      ).resolves.toBeNull();
      await expect(
        userService.findUserByGoogleId(undefined as any)
      ).resolves.toBeNull();
    });
  });
});

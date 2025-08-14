import { describe, it, expect } from "vitest";
import { createJwtUserPayloadFactory } from "./create-jwt-user-payload-factory";
import { USER_ROLE } from "../constants/user-role.constant";
import { USER_POLICY } from "../constants/user-policy.constant";

describe("createJwtUserPayloadFactory", () => {
  describe("with default payload", () => {
    it("should create a user payload with default values when no arguments provided", () => {
      const result = createJwtUserPayloadFactory();

      expect(result).toEqual({
        accessToken: "",
        name: "",
        email: "",
        picture: "",
        googleId: "",
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
      });
    });

    it("should create a user payload with default values when undefined is passed", () => {
      const result = createJwtUserPayloadFactory(undefined);

      expect(result).toEqual({
        accessToken: "",
        name: "",
        email: "",
        picture: "",
        googleId: "",
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
      });
    });
  });

  describe("with custom payload", () => {
    it("should create a user payload with provided values for Editor role", () => {
      const inputPayload = {
        accessToken: "test-access-token",
        name: "John Doe",
        email: "john.doe@example.com",
        picture: "https://example.com/profile.jpg",
        googleId: "google-12345",
        resources: {
          role: USER_ROLE.Editor,
        },
      };

      const result = createJwtUserPayloadFactory(inputPayload);

      expect(result).toEqual({
        accessToken: "test-access-token",
        name: "John Doe",
        email: "john.doe@example.com",
        picture: "https://example.com/profile.jpg",
        googleId: "google-12345",
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
      });
    });

    it("should create a user payload with provided values for NoneEditor role", () => {
      const inputPayload = {
        accessToken: "another-token",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        picture: "https://example.com/jane-profile.jpg",
        googleId: "google-67890",
        resources: {
          role: USER_ROLE.NoneEditor,
        },
      };

      const result = createJwtUserPayloadFactory(inputPayload);

      expect(result).toEqual({
        accessToken: "another-token",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        picture: "https://example.com/jane-profile.jpg",
        googleId: "google-67890",
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
      });
    });

    it("should create a user payload with custom role as string", () => {
      const inputPayload = {
        accessToken: "custom-token",
        name: "Custom User",
        email: "custom@example.com",
        picture: "https://example.com/custom.jpg",
        googleId: "google-custom",
        resources: {
          role: "custom-role" as any,
        },
      };

      const result = createJwtUserPayloadFactory(inputPayload);

      expect(result).toEqual({
        accessToken: "custom-token",
        name: "Custom User",
        email: "custom@example.com",
        picture: "https://example.com/custom.jpg",
        googleId: "google-custom",
        resources: {
          role: "custom-role",
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
      });
    });
  });

  describe("with partial payload", () => {
    it("should handle payload with missing resources and use default role", () => {
      const inputPayload = {
        accessToken: "partial-token",
        name: "Partial User",
        email: "partial@example.com",
        picture: "https://example.com/partial.jpg",
        googleId: "google-partial",
        resources: undefined as any,
      };

      const result = createJwtUserPayloadFactory(inputPayload);

      expect(result).toEqual({
        accessToken: "partial-token",
        name: "Partial User",
        email: "partial@example.com",
        picture: "https://example.com/partial.jpg",
        googleId: "google-partial",
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
      });
    });

    it("should handle payload with empty resources object and use default role", () => {
      const inputPayload = {
        accessToken: "empty-resources-token",
        name: "Empty Resources User",
        email: "empty@example.com",
        picture: "https://example.com/empty.jpg",
        googleId: "google-empty",
        resources: {} as any,
      };

      const result = createJwtUserPayloadFactory(inputPayload);

      expect(result).toEqual({
        accessToken: "empty-resources-token",
        name: "Empty Resources User",
        email: "empty@example.com",
        picture: "https://example.com/empty.jpg",
        googleId: "google-empty",
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
      });
    });

    it("should handle payload with null role and use default role", () => {
      const inputPayload = {
        accessToken: "null-role-token",
        name: "Null Role User",
        email: "null@example.com",
        picture: "https://example.com/null.jpg",
        googleId: "google-null",
        resources: {
          role: null as any,
        },
      };

      const result = createJwtUserPayloadFactory(inputPayload);

      expect(result).toEqual({
        accessToken: "null-role-token",
        name: "Null Role User",
        email: "null@example.com",
        picture: "https://example.com/null.jpg",
        googleId: "google-null",
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
      });
    });

    it("should handle payload with empty string role and use default role", () => {
      const inputPayload = {
        accessToken: "empty-role-token",
        name: "Empty Role User",
        email: "empty-role@example.com",
        picture: "https://example.com/empty-role.jpg",
        googleId: "google-empty-role",
        resources: {
          role: "",
        },
      };

      const result = createJwtUserPayloadFactory(inputPayload);

      expect(result).toEqual({
        accessToken: "empty-role-token",
        name: "Empty Role User",
        email: "empty-role@example.com",
        picture: "https://example.com/empty-role.jpg",
        googleId: "google-empty-role",
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
      });
    });
  });

  describe("policy behavior", () => {
    it("should always include the same policy regardless of role", () => {
      const editorPayload = {
        accessToken: "editor-token",
        name: "Editor User",
        email: "editor@example.com",
        picture: "https://example.com/editor.jpg",
        googleId: "google-editor",
        resources: {
          role: USER_ROLE.Editor,
        },
      };

      const noneEditorPayload = {
        accessToken: "none-editor-token",
        name: "None Editor User",
        email: "none-editor@example.com",
        picture: "https://example.com/none-editor.jpg",
        googleId: "google-none-editor",
        resources: {
          role: USER_ROLE.NoneEditor,
        },
      };

      const editorResult = createJwtUserPayloadFactory(editorPayload);
      const noneEditorResult = createJwtUserPayloadFactory(noneEditorPayload);

      expect(editorResult.resources.policy).toEqual(
        noneEditorResult.resources.policy
      );
      expect(editorResult.resources.policy).toEqual({
        article: {
          reaction: [USER_POLICY.READ, USER_POLICY.UPDATE],
          comments: [
            USER_POLICY.READ,
            USER_POLICY.WRITE,
            USER_POLICY.DELETE,
            USER_POLICY.UPDATE,
          ],
        },
      });
    });

    it("should include all expected policies", () => {
      const result = createJwtUserPayloadFactory();

      expect(result.resources.policy.article.reaction).toContain(
        USER_POLICY.READ
      );
      expect(result.resources.policy.article.reaction).toContain(
        USER_POLICY.UPDATE
      );
      expect(result.resources.policy.article.reaction).toHaveLength(2);

      expect(result.resources.policy.article.comments).toContain(
        USER_POLICY.READ
      );
      expect(result.resources.policy.article.comments).toContain(
        USER_POLICY.WRITE
      );
      expect(result.resources.policy.article.comments).toContain(
        USER_POLICY.DELETE
      );
      expect(result.resources.policy.article.comments).toContain(
        USER_POLICY.UPDATE
      );
      expect(result.resources.policy.article.comments).toHaveLength(4);
    });
  });

  describe("data preservation", () => {
    it("should preserve all input data without modification", () => {
      const inputPayload = {
        accessToken: "preserve-token",
        name: "Preserve User",
        email: "preserve@example.com",
        picture: "https://example.com/preserve.jpg",
        googleId: "google-preserve",
        resources: {
          role: USER_ROLE.Editor,
        },
      };

      const result = createJwtUserPayloadFactory(inputPayload);

      expect(result.accessToken).toBe(inputPayload.accessToken);
      expect(result.name).toBe(inputPayload.name);
      expect(result.email).toBe(inputPayload.email);
      expect(result.picture).toBe(inputPayload.picture);
      expect(result.googleId).toBe(inputPayload.googleId);
      expect(result.resources.role).toBe(inputPayload.resources.role);
    });

    it("should not modify the original input payload", () => {
      const inputPayload = {
        accessToken: "immutable-token",
        name: "Immutable User",
        email: "immutable@example.com",
        picture: "https://example.com/immutable.jpg",
        googleId: "google-immutable",
        resources: {
          role: USER_ROLE.Editor,
        },
      };
      const originalPayload = { ...inputPayload };

      createJwtUserPayloadFactory(inputPayload);

      expect(inputPayload).toEqual(originalPayload);
    });
  });

  describe("edge cases", () => {
    it("should handle special characters in string fields", () => {
      const inputPayload = {
        accessToken: "token-with-!@#$%^&*()_+",
        name: "User With Special Chars !@#$%",
        email: "special+chars@test-domain.co.uk",
        picture: "https://example.com/special-chars?param=value&other=123",
        googleId: "google-123-abc-!@#",
        resources: {
          role: USER_ROLE.NoneEditor,
        },
      };

      const result = createJwtUserPayloadFactory(inputPayload);

      expect(result.accessToken).toBe("token-with-!@#$%^&*()_+");
      expect(result.name).toBe("User With Special Chars !@#$%");
      expect(result.email).toBe("special+chars@test-domain.co.uk");
      expect(result.picture).toBe(
        "https://example.com/special-chars?param=value&other=123"
      );
      expect(result.googleId).toBe("google-123-abc-!@#");
    });

    it("should handle very long strings", () => {
      const longString = "a".repeat(1000);
      const inputPayload = {
        accessToken: longString,
        name: longString,
        email: `${longString}@example.com`,
        picture: `https://example.com/${longString}`,
        googleId: longString,
        resources: {
          role: USER_ROLE.Editor,
        },
      };

      const result = createJwtUserPayloadFactory(inputPayload);

      expect(result.accessToken).toBe(longString);
      expect(result.name).toBe(longString);
      expect(result.email).toBe(`${longString}@example.com`);
      expect(result.picture).toBe(`https://example.com/${longString}`);
      expect(result.googleId).toBe(longString);
    });
  });
});

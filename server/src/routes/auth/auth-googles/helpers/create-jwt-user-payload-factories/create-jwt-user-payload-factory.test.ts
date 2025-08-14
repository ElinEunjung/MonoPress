import { describe, it, expect } from "vitest";
import { createJwtUserPayloadFactory } from "./create-jwt-user-payload-factory";
import { USER_ROLE } from "../../constants/user-role.constant";
import { USER_POLICY } from "../../constants/user-policy.constant";

describe("createJwtUserPayloadFactory", () => {
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
});

import { it, expect, describe } from "vitest";
import { userPolicy } from "./user-policies.helper";
import { USER_ROLE } from "../../../routes/auth/auth-googles/constants/user-role.constant";
import { USER_POLICY } from "../../../routes/auth/auth-googles/constants/user-policy.constant";

describe("userPolicy", () => {
  describe("isRoleValid()", () => {
    it('should return true for a valid "editor" role', () => {
      expect(userPolicy.isRoleValid(USER_ROLE.Editor)).toBe(true);
    });

    it('should return true for a valid "none-editor" role', () => {
      expect(userPolicy.isRoleValid(USER_ROLE.NoneEditor)).toBe(true);
    });

    it("should return false for an invalid role", () => {
      expect(userPolicy.isRoleValid("gibberish-role" as any)).toBe(false);
    });

    it("should return false for an empty string", () => {
      expect(userPolicy.isRoleValid("" as any)).toBe(false);
    });
  });

  describe("isSomeArticleCommentValid()", () => {
    it("should return true if the policies array includes a required policy (READ)", () => {
      const policies = [USER_POLICY.READ];
      expect(userPolicy.isSomeArticleCommentValid(policies)).toBe(true);
    });

    it("should return true if the policies array includes a required policy (WRITE)", () => {
      const policies = [USER_POLICY.WRITE];
      expect(userPolicy.isSomeArticleCommentValid(policies)).toBe(true);
    });

    it("should return true if the policies array includes a required policy (DELETE)", () => {
      const policies = [USER_POLICY.DELETE];
      expect(userPolicy.isSomeArticleCommentValid(policies)).toBe(true);
    });

    it("should return true if the policies array includes a required policy (UPDATE)", () => {
      const policies = [USER_POLICY.UPDATE];
      expect(userPolicy.isSomeArticleCommentValid(policies)).toBe(true);
    });

    it("should return true if the policies array has all required policies", () => {
      const policies = [
        USER_POLICY.READ,
        USER_POLICY.WRITE,
        USER_POLICY.DELETE,
        USER_POLICY.UPDATE,
      ];
      expect(userPolicy.isSomeArticleCommentValid(policies)).toBe(true);
    });

    it("should return false if the policies array is empty", () => {
      const policies: string[] = [];
      expect(userPolicy.isSomeArticleCommentValid(policies)).toBe(false);
    });

    it("should return false if the policies array does not include any required policies", () => {
      const policies = ["policy1", "policy2"];
      expect(userPolicy.isSomeArticleCommentValid(policies)).toBe(false);
    });
  });

  describe("isSomeArticleReactionValid()", () => {
    it("should return true if the policies array includes a required policy (READ)", () => {
      const policies = [USER_POLICY.READ];
      expect(userPolicy.isSomeArticleReactionValid(policies)).toBe(true);
    });

    it("should return true if the policies array includes a required policy (UPDATE)", () => {
      const policies = [USER_POLICY.UPDATE];
      expect(userPolicy.isSomeArticleReactionValid(policies)).toBe(true);
    });

    it("should return true if the policies array has all required policies", () => {
      const policies = [USER_POLICY.READ, USER_POLICY.UPDATE];
      expect(userPolicy.isSomeArticleReactionValid(policies)).toBe(true);
    });

    it("should return false if the policies array is empty", () => {
      const policies: string[] = [];
      expect(userPolicy.isSomeArticleReactionValid(policies)).toBe(false);
    });

    it("should return false if the policies array includes policies that are not required", () => {
      const policies = [USER_POLICY.WRITE, USER_POLICY.DELETE];
      expect(userPolicy.isSomeArticleReactionValid(policies)).toBe(false);
    });
  });
});

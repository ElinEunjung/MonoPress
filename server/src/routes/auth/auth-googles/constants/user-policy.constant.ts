export interface UserPolicy {
  READ: "read";
  WRITE: "write";
  DELETE: "delete";
  UPDATE: "update";
}

export const USER_POLICY = {
  READ: "read",
  WRITE: "write",
  DELETE: "delete",
  UPDATE: "update",
} as const satisfies UserPolicy;

export interface UserRole {
  Editor: "editor";
  NoneEditor: "none-editor";
}

export const USER_ROLE = {
  Editor: "editor",
  NoneEditor: "none-editor",
} as const satisfies UserRole;

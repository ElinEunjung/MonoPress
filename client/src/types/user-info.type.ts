export interface UserInfo {
  name: string;
  email: string;
  picture: string;
  resources: {
    role: "editor" | "none-editor" | "";
    policy: {
      article: {
        reaction: Array<"read" | "update">;
        comments: Array<"delete" | "read" | "write" | "update">;
      };
    };
  };
}

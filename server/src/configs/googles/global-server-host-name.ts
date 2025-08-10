const SERVER_HOST_NAME_LOCAL = "http://localhost:5173";
const SERVER_HOST_NAME_PRODUCTION =
  "https://mono-press-5a039da642a5.herokuapp.com/";

export const GLOBAL_SERVER_HOST_NAME =
  process.env.NODE_ENV === "production"
    ? SERVER_HOST_NAME_PRODUCTION
    : SERVER_HOST_NAME_LOCAL;

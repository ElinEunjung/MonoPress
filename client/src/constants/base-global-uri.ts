const BACKEND =
  process.env.NODE_ENV === "production"
    ? "https://mono-press-5a039da642a5.herokuapp.com/api"
    : "http://localhost:3000/api";

const FRONTEND =
  process.env.NODE_ENV === "production"
    ? "https://mono-press-5a039da642a5.herokuapp.com"
    : "http://localhost:5173";

export const BASE_GLOBAL_URI = {
  BACKEND,
  FRONTEND,
};

import express from "express";

import { editorArticleRouter } from "./editor-articles/editor-article.router";
import { authRouter } from "./auth/auth.router";
import { validateCookieSession } from "../middleware/validate-cookie-session.middleware";
import { publicArticleRouter } from "./public-articles/public-article.router";

const api = express.Router();

api.use(publicArticleRouter);
api.use(authRouter);

api.use(validateCookieSession); // Middleware for validating cookie session

api.use(editorArticleRouter);

export { api };

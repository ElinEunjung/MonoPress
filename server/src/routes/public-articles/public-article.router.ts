import express from "express";

import { articleCommentsRouter } from "./article-comments/article-comments.router";
import { articleReactionRouter } from "./article-reactions/articles-reaction.router";
import { articleViewsRouter } from "./article-views/article-views.router";

const publicArticleRouter = express.Router();

publicArticleRouter.use(articleCommentsRouter);
publicArticleRouter.use(articleReactionRouter);
publicArticleRouter.use(articleViewsRouter);

export { publicArticleRouter };

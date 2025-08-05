import type { Response, Request } from "express";

export function getAllNews(request: Request, response: Response) {
  const MOCK_NEWS = [
    {
      id: 1,
      title: "Breaking News: TypeScript 6.0 Released",
      content:
        "The latest version of TypeScript introduces exciting new features and improvements.",
    },
    {
      id: 2,
      title: "MonoPress Server Update",
      content:
        "The MonoPress server has been updated to enhance performance and security.",
    },
    {
      id: 3,
      title: "Express Router Enhancements",
      content:
        "Express has introduced new routing capabilities that simplify API development.",
    },
    {
      id: 4,
      title: "Node.js 20 Features",
      content:
        "Node.js 20 brings new features that improve asynchronous programming and performance.",
    },
    {
      id: 5,
      title: "JavaScript ES2020 Features",
      content:
        "ES2020 introduces new syntax and features that make JavaScript development more efficient.",
    },
    {
      id: 6,
      title: "CommonJS Module System in Node.js",
      content:
        "The CommonJS module system continues to be a staple for Node.js applications.",
    },
  ];

  response.json(MOCK_NEWS);
}

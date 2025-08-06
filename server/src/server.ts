import http from "http";
import { app } from "./app";
import { mongoDBConnect } from "./services/mongo";

const server = http.createServer(app);

async function startServer() {
  const PORT = process.env.PORT || 5000;

  await mongoDBConnect();
  server.listen(PORT, () => {
    console.log(`🚀Server running on http://localhost:${PORT}`);
  });
}

startServer();

import http from "http";
import app from "./app";

const server = http.createServer(app);

async function startServer() {
  const PORT = process.env.PORT || 5000;

  // TODO: Legg til MongoDB tilkobling

  server.listen(PORT, () => {
    console.log(`🚀Server running on http://localhost:${PORT}`);
  });
}

startServer();

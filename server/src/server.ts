import dotenv from 'dotenv';
dotenv.config();
import app from "#app/app";
import { createServer } from "http";
import "#app/jobs/expireSubscriptions.js";

const PORT = Number(process.env.PORT ?? 1234);

const server = createServer(app);

server.listen(PORT, () => {
  const address = server.address();

  if (typeof address === "object" && address) {
    console.log(`Server running on port http://localhost:${address.port}`);
  }
});

// process.on("SIGTERM", () => {
//   console.log("SIGTERM received — shutting down gracefully");
//   httpServer.close(() => {
//     console.log("HTTP server closed");
//     process.exit(0);
//   });
// });

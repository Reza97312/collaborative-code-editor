import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { setupSocketHandlers } from "./socket";
import roomsRouter from "./routes/rooms";
import { rateLimiter } from "./middleware/rateLimiter";
import { ServerToClientEvents, ClientToServerEvents } from "./types";

dotenv.config();

const PORT = parseInt(process.env.PORT ?? "4000", 10);
const CLIENT_URL =
  process.env.CLIENT_URL ?? "https://code-editor1234.netlify.app/";
const NODE_ENV = process.env.NODE_ENV ?? "development";

const app = express();
const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60_000,
  pingInterval: 25_000,
  transports: ["websocket", "polling"],
});

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(rateLimiter);

app.use("/api", roomsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  },
);

setupSocketHandlers(io);

const shutdown = (): void => {
  console.log("\n Shutting down…");
  io.close(() =>
    httpServer.close(() => {
      console.log(" Server closed");
      process.exit(0);
    }),
  );
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

httpServer.listen(PORT, () => {
  console.log(`\n Server listening on :${PORT}`);
  console.log(`WebSocket ready`);
  console.log(`CORS origin   : ${CLIENT_URL}`);
  console.log(`Environment   : ${NODE_ENV}\n`);
});

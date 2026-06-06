import { Router, Request, Response } from "express";
import { roomManager } from "../socket/roomManager";

const router = Router();

router.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    ...roomManager.stats(),
  });
});

router.get("/rooms/:roomId", (req: Request, res: Response) => {
  const roomId = String(req.params.roomId);

  if (!roomId || roomId.length > 50 || !/^[\w-]+$/.test(roomId)) {
    res.status(400).json({ error: "Invalid room ID" });
    return;
  }

  const room = roomManager.getRoom(roomId);
  res.json({
    exists: !!room,
    userCount: room?.users.size ?? 0,
  });
});

export default router;
